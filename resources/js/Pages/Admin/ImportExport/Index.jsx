import React, { useState, useCallback } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Download, FileSpreadsheet, CheckCircle, AlertCircle, X, Layers } from 'lucide-react';
import axios from 'axios';

export default function ImportExportIndex() {
    const { auth } = usePage().props;
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [statusMessage, setStatusMessage] = useState(null);
    const [errors, setErrors] = useState([]);
    const [importType, setImportType] = useState('students');
    const [exportType, setExportType] = useState('students');

    const types = [
        { id: 'students', label: 'Data Siswa' },
        { id: 'teachers', label: 'Data Guru' },
        { id: 'staffs', label: 'Data Staf' },
        { id: 'subjects', label: 'Data Mata Pelajaran' },
        { id: 'classes', label: 'Data Kelas' },
    ];

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.csv'))) {
            setFile(droppedFile);
            setErrors([]);
            setStatusMessage(null);
        } else {
            setErrors(['Hanya file .xlsx atau .csv yang diperbolehkan.']);
        }
    }, []);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setErrors([]);
            setStatusMessage(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setUploadProgress(0);
        setStatusMessage(null);
        setErrors([]);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', importType);

        try {
            const response = await axios.post(route('admin.import-export.import'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                },
            });

            setStatusMessage({ type: 'success', text: response.data.message });
            setFile(null);
        } catch (error) {
            console.error('Upload Error', error);
            if (error.response && error.response.data) {
                setStatusMessage({ type: 'error', text: error.response.data.message });
                if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
                    setErrors(error.response.data.errors);
                }
            } else {
                setStatusMessage({ type: 'error', text: 'Terjadi kesalahan tidak terduga saat mengunggah.' });
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleExport = () => {
        window.location.href = route('admin.import-export.export', { type: exportType });
    };

    const handleDownloadTemplate = () => {
        window.location.href = route('admin.import-export.template', { type: importType });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Data Master Import & Export</h2>}
        >
            <Head title="Import Export Data" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Import Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl p-8 border border-slate-100 relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                    <FileSpreadsheet className="text-blue-600" size={28} />
                                    Import Data Master
                                </h3>
                                <p className="text-slate-500 text-sm mt-1">
                                    Unggah file Excel (.xlsx) atau CSV untuk memasukkan data master secara massal.
                                </p>
                            </div>
                            <button
                                onClick={handleDownloadTemplate}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors text-sm"
                            >
                                <Download size={16} />
                                Unduh Template {types.find(t => t.id === importType)?.label}
                            </button>
                        </div>

                        {/* Import Type Selector */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Pilih Jenis Data yang Akan Diimpor</label>
                            <div className="flex flex-wrap gap-2">
                                {types.map((type) => (
                                    <button
                                        key={`import-${type.id}`}
                                        onClick={() => setImportType(type.id)}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                                            importType === type.id 
                                                ? 'bg-blue-100 text-blue-700 border-2 border-blue-200' 
                                                : 'bg-slate-50 text-slate-600 border-2 border-transparent hover:bg-slate-100'
                                        }`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Dropzone */}
                        <div 
                            className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 ${
                                isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50'
                            }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <input 
                                type="file" 
                                id="fileInput" 
                                className="hidden" 
                                accept=".xlsx,.csv" 
                                onChange={handleFileChange} 
                                disabled={isUploading}
                            />
                            
                            {!file ? (
                                <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center">
                                    <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4 text-blue-500">
                                        <UploadCloud size={32} />
                                    </div>
                                    <p className="text-slate-700 font-semibold text-lg">Tarik & Lepaskan file Excel di sini</p>
                                    <p className="text-slate-500 text-sm mt-1">atau klik untuk memilih file dari komputer Anda</p>
                                </label>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                        <FileSpreadsheet size={32} />
                                    </div>
                                    <p className="text-slate-800 font-bold text-lg">{file.name}</p>
                                    <p className="text-slate-500 text-sm mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    
                                    {!isUploading && (
                                        <div className="flex gap-3 mt-6">
                                            <button 
                                                onClick={() => setFile(null)}
                                                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors text-sm flex items-center gap-2"
                                            >
                                                <X size={16} /> Batal
                                            </button>
                                            <button 
                                                onClick={handleUpload}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-colors text-sm flex items-center gap-2"
                                            >
                                                <UploadCloud size={16} /> Proses Import
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {isUploading && (
                                <div className="w-full max-w-md mx-auto mt-8">
                                    <div className="flex justify-between text-sm font-medium text-slate-600 mb-2">
                                        <span>Mengunggah...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                                        <motion.div 
                                            className="bg-blue-600 h-2.5 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${uploadProgress}%` }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Alerts */}
                        <AnimatePresence>
                            {statusMessage && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`mt-6 p-4 rounded-xl flex items-start gap-3 ${statusMessage.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}
                                >
                                    {statusMessage.type === 'success' ? <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={20} /> : <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />}
                                    <div>
                                        <p className="font-semibold">{statusMessage.text}</p>
                                        {errors.length > 0 && (
                                            <ul className="mt-2 text-sm list-disc list-inside space-y-1 text-red-600 max-h-40 overflow-y-auto">
                                                {errors.map((err, i) => (
                                                    <li key={i}>{err}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Export Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl p-8 border border-slate-100 relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-green-600"></div>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-2">
                                    <Layers className="text-emerald-600" size={24} />
                                    Export Data Master
                                </h3>
                                <p className="text-slate-500 text-sm">
                                    Pilih jenis data yang ingin Anda unduh secara keseluruhan dalam format Excel.
                                </p>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {types.map((type) => (
                                        <button
                                            key={`export-${type.id}`}
                                            onClick={() => setExportType(type.id)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                                exportType === type.id 
                                                    ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200' 
                                                    : 'bg-slate-50 text-slate-600 border-2 border-transparent hover:bg-slate-100'
                                            }`}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleExport}
                                className="shrink-0 flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all"
                            >
                                <Download size={18} />
                                Export {types.find(t => t.id === exportType)?.label}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
