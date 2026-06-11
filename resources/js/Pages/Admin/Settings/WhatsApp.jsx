import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import axios from 'axios';

export default function WhatsAppSettings({ auth, waStatus, logs }) {
    const [qrCode, setQrCode] = useState(null);
    const [status, setStatus] = useState(waStatus?.state || 'offline');
    const [loadingQr, setLoadingQr] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        number: '',
        message: '',
    });

    // Auto refresh QR and status if connecting
    useEffect(() => {
        let interval;
        if (status === 'qr' || status === 'connecting' || status === 'offline') {
            interval = setInterval(() => {
                fetchStatusAndQr();
            }, 5000); // Poll every 5 seconds
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [status]);

    const fetchStatusAndQr = async () => {
        try {
            // we use an inertia reload for simplicity to get updated status and logs
            router.reload({ only: ['waStatus'], preserveScroll: true, onSuccess: (page) => {
                const currentStatus = page.props.waStatus?.state;
                setStatus(currentStatus);
                
                if (currentStatus === 'qr') {
                    fetchQr();
                } else {
                    setQrCode(null);
                }
            }});
        } catch (e) {
            console.error(e);
        }
    };

    const fetchQr = async () => {
        try {
            setLoadingQr(true);
            const response = await axios.get(route('admin.settings.whatsapp.qr'));
            if (response.data.qr) {
                setQrCode(response.data.qr);
            }
        } catch (error) {
            console.error('Failed to fetch QR:', error);
        } finally {
            setLoadingQr(false);
        }
    };

    const handleLogout = () => {
        if (confirm('Apakah Anda yakin ingin memutus koneksi WhatsApp?')) {
            router.post(route('admin.settings.whatsapp.logout'));
        }
    };

    const handleTestMessage = (e) => {
        e.preventDefault();
        post(route('admin.settings.whatsapp.test'), {
            onSuccess: () => reset(),
        });
    };

    const renderStatusBadge = () => {
        switch (status) {
            case 'open':
                return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Terhubung</span>;
            case 'qr':
                return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div> Menunggu Pemindaian QR</span>;
            case 'connecting':
                return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">Menghubungkan...</span>;
            case 'error_detail':
                return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">Error: {waStatus?.error} (URL: {waStatus?.url})</span>;
            default:
                return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">Offline / Terputus</span>;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl shadow-neon-violet">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                        </div>
                        <h2 className="font-black text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-brand-600 tracking-tight">
                            Server WhatsApp
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Pengaturan WhatsApp" />

            <div className="py-6 md:py-12 relative z-10">
                {/* Ambient Background Blobs */}
                <div className="absolute top-0 -left-40 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob pointer-events-none"></div>
                <div className="absolute top-0 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-0 sm:px-4 md:px-6 lg:px-8 space-y-6">
                    
                    {/* Device Connection Card */}
                    <div className="bg-white/80 backdrop-blur-xl overflow-hidden sm:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-6">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Koneksi Perangkat</h3>
                                {renderStatusBadge()}
                            </div>

                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                {/* QR Code Area */}
                                <div className="flex flex-col items-center justify-center p-6 bg-gray-50 border rounded-lg w-full md:w-1/3 min-h-[300px]">
                                    {status === 'open' ? (
                                        <div className="text-center">
                                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            </div>
                                            <p className="text-gray-700 font-medium">WhatsApp siap digunakan</p>
                                            <div className="mt-6">
                                                <DangerButton onClick={handleLogout}>Putus Koneksi</DangerButton>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            {qrCode ? (
                                                <>
                                                    <img src={qrCode} alt="WhatsApp QR Code" className="w-64 h-64 mx-auto" />
                                                    <p className="text-sm text-gray-500 mt-4">Buka WhatsApp di HP Anda, pilih Perangkat Tertaut, lalu pindai kode QR di atas.</p>
                                                </>
                                            ) : (
                                                <div className="animate-pulse flex space-x-4">
                                                    <div className="w-64 h-64 bg-gray-300 rounded mx-auto"></div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Test Message Area */}
                                <div className="w-full md:w-2/3">
                                    <h4 className="text-md font-medium text-gray-900 mb-4">Uji Coba Pengiriman Pesan</h4>
                                    <form onSubmit={handleTestMessage} className="space-y-4">
                                        <div>
                                            <InputLabel htmlFor="number" value="Nomor Tujuan (Gunakan format 08... atau 628...)" />
                                            <TextInput
                                                id="number"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.number}
                                                onChange={e => setData('number', e.target.value)}
                                                required
                                                disabled={status !== 'open'}
                                            />
                                            <InputError message={errors.number} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="message" value="Isi Pesan" />
                                            <textarea
                                                id="message"
                                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                rows="3"
                                                value={data.message}
                                                onChange={e => setData('message', e.target.value)}
                                                required
                                                disabled={status !== 'open'}
                                            />
                                            <InputError message={errors.message} className="mt-2" />
                                        </div>

                                        <div className="flex items-center">
                                            <PrimaryButton disabled={processing || status !== 'open'}>
                                                {processing ? 'Mengirim...' : 'Kirim Pesan Uji Coba'}
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                    
                                    {status !== 'open' && (
                                        <div className="mt-4 text-sm text-red-600">
                                            ⚠️ Anda harus menghubungkan perangkat WhatsApp terlebih dahulu untuk menguji fitur ini.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notification Logs Table */}
                    <div className="bg-white/80 backdrop-blur-xl overflow-hidden sm:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-6">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Riwayat Pengiriman Pesan</h3>
                            
                            <div className="overflow-x-auto">
                                <table className="hidden md:table min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penerima</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pesan</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {logs.data.map(log => (
                                            <tr key={log.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(log.created_at).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {log.recipient_number}
                                                    {log.recipient_name && <span className="block text-xs text-gray-500">{log.recipient_name}</span>}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                                                    {log.message_content}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                                    {log.status === 'sent' && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Terkirim</span>}
                                                    {log.status === 'pending' && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>}
                                                    {log.status === 'failed' && (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800" title={log.error_message}>
                                                            Gagal
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile View */}
                            <div className="md:hidden space-y-4 mt-4">
                                {logs.data.map(log => (
                                    <div key={log.id} className="bg-white p-4 rounded-[1.5rem] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] border border-slate-50 flex flex-col">
                                        <div className="flex items-center justify-between mb-3 border-b border-slate-50 pb-3">
                                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                {new Date(log.created_at).toLocaleString('id-ID')}
                                            </div>
                                            <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${
                                                log.status === 'sent' ? 'bg-green-100 text-green-800' : 
                                                log.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                                'bg-red-100 text-red-800'
                                            }`} title={log.error_message}>
                                                {log.status === 'sent' ? 'Terkirim' : log.status === 'pending' ? 'Pending' : 'Gagal'}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 shrink-0 border-2 border-white shadow-sm mt-0.5">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-slate-800 text-base leading-tight truncate">{log.recipient_name || 'Tanpa Nama'}</h3>
                                                <p className="text-xs font-medium text-slate-500 mt-0.5">{log.recipient_number}</p>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 relative">
                                            <div className="absolute -top-2 left-4 text-slate-300">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                                            </div>
                                            <p className="text-xs text-slate-600 pl-4 italic line-clamp-3 leading-relaxed">
                                                {log.message_content}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            

                            {logs.data.length === 0 && (
                                    <div className="text-center py-6 text-gray-500">
                                        Belum ada riwayat pesan.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
