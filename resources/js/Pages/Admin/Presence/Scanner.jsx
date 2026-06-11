import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { QrCode, CheckCircle, XCircle } from 'lucide-react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

export default function Scanner({ auth, scannerType }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        qr_code: '',
    });

    const [statusMessage, setStatusMessage] = useState(null);
    const [statusType, setStatusType] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const scannerRef = useRef(null);
    const hasScannedRef = useRef(false);

    useEffect(() => {
        if (isScanning && !scannerRef.current) {
            setTimeout(() => {
                try {
                    const html5QrCode = new Html5Qrcode("reader", { 
                        formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ], 
                        verbose: false 
                    });
                    
                    scannerRef.current = html5QrCode;

                    Html5Qrcode.getCameras().then(devices => {
                        if (devices && devices.length) {
                            let cameraId = devices[0].id;
                            // Try to find a back camera
                            const backCamera = devices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('environment'));
                            if (backCamera) {
                                cameraId = backCamera.id;
                            }

                            html5QrCode.start(
                                cameraId,
                                { 
                                    fps: 10,
                                    qrbox: { width: 250, height: 250 },
                                    aspectRatio: 1.0
                                },
                                (decodedText) => {
                                    if (hasScannedRef.current) return;
                                    hasScannedRef.current = true;
                                    
                                    setData('qr_code', decodedText);
                                    
                                    setTimeout(() => {
                                        handleDirectSubmit(decodedText);
                                        if (scannerRef.current) {
                                            if(scannerRef.current.pause) {
                                                scannerRef.current.pause(true);
                                            } else {
                                                setIsScanning(false);
                                            }
                                        }
                                    }, 100);
                                },
                                (error) => {
                                    // ignore constant scan failures
                                }
                            ).catch((err) => {
                                console.error("Failed to start scanner", err);
                                setStatusMessage("Kamera gagal dimulai: " + err);
                                setStatusType("error");
                                setIsScanning(false);
                            });
                        } else {
                            setStatusMessage("Tidak ada kamera ditemukan di perangkat ini.");
                            setStatusType("error");
                            setIsScanning(false);
                        }
                    }).catch(err => {
                        console.error("Camera permissions not granted or HTTPS required", err);
                        setStatusMessage("Akses kamera ditolak atau HTTPS diperlukan: " + err);
                        setStatusType("error");
                        setIsScanning(false);
                    });
                } catch (err) {
                    console.error("Scanner init error:", err);
                }
            }, 100);
        }

        return () => {
            if (scannerRef.current && isScanning === false) {
                if (scannerRef.current.isScanning) {
                    scannerRef.current.stop().catch(console.error);
                }
                scannerRef.current = null;
            }
        };
    }, [isScanning]);

    const handleDirectSubmit = (qrText) => {
        post(route('admin.presence.scan'), {
            preserveScroll: true,
            data: { qr_code: qrText },
            onSuccess: (page) => {
                const props = page.props;
                if (props.flash?.success) {
                    setStatusMessage(props.flash.success);
                    setStatusType('success');
                } else if (props.flash?.error) {
                    setStatusMessage(props.flash.error);
                    setStatusType('error');
                }
                resetScanState();
            },
            onError: (errs) => {
                if (errs.error) {
                    setStatusMessage(errs.error);
                    setStatusType('error');
                } else if (errs.qr_code) {
                    setStatusMessage(errs.qr_code);
                    setStatusType('error');
                }
                resetScanState();
            }
        });
    };

    const resetScanState = () => {
        reset('qr_code');
        setTimeout(() => {
            setStatusMessage(null);
            setStatusType(null);
            hasScannedRef.current = false;
            if (scannerRef.current) {
                if (scannerRef.current.resume) {
                    scannerRef.current.resume();
                } else if (!scannerRef.current.isScanning && isScanning) {
                    // Fallback if pause wasn't supported
                }
            }
        }, 3000);
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        hasScannedRef.current = true;
        handleDirectSubmit(data.qr_code);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{scannerType === 'staff' ? 'Scanner Kehadiran Guru & Staf' : 'Scanner Kehadiran Siswa'}</h2>}
        >
            <Head title={scannerType === 'staff' ? 'Scanner Guru & Staf' : 'Scanner Siswa'} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8 text-center">
                        <QrCode className="w-24 h-24 mx-auto text-indigo-500 mb-4" />
                        <h3 className="text-2xl font-bold mb-2">{scannerType === 'staff' ? 'Scanner QR Code Guru & Staf' : 'Scanner QR Code Siswa'}</h3>
                        
                        <div className="mb-6">
                            {!isScanning ? (
                                <button
                                    onClick={() => setIsScanning(true)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
                                >
                                    <QrCode className="w-5 h-5" />
                                    Mulai Kamera Scanner
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        if (scannerRef.current) {
                                            if (scannerRef.current.isScanning) {
                                                scannerRef.current.stop().catch(console.error);
                                            }
                                            scannerRef.current = null;
                                        }
                                        setIsScanning(false);
                                    }}
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                                >
                                    Tutup Kamera
                                </button>
                            )}
                        </div>

                        {/* Scanner Div - always in DOM, toggle visibility */}
                        <div className={`mb-6 max-w-sm mx-auto overflow-hidden rounded-lg border-2 border-indigo-100 ${isScanning ? 'block' : 'hidden'}`}>
                            <div id="reader" className="w-full"></div>
                        </div>

                        {statusMessage && (
                            <div className={`mb-6 p-4 rounded-lg flex items-center justify-center gap-2 ${
                                statusType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {statusType === 'success' ? (
                                    <CheckCircle className="w-6 h-6" />
                                ) : (
                                    <XCircle className="w-6 h-6" />
                                )}
                                <span className="font-medium">{statusMessage}</span>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500 mb-4">Atau masukkan UUID secara manual untuk simulasi:</p>
                            <form onSubmit={handleManualSubmit} className="max-w-md mx-auto relative">
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Paste UUID di sini..."
                                    value={data.qr_code}
                                    onChange={(e) => setData('qr_code', e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={processing || !data.qr_code}
                                    className="mt-4 w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Memproses...' : 'Submit Manual'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
