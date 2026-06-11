import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Download, Upload, RotateCcw, AlertTriangle, ShieldAlert, Sparkles, Database as DatabaseIcon, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DatabaseSettings() {
    const { data, setData, post, processing: importProcessing, errors: importErrors, reset: resetImport } = useForm({
        sql_file: null,
    });

    const { post: postReset, processing: resetProcessing } = useForm();

    const [showImportConfirm, setShowImportConfirm] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [resetStep, setResetStep] = useState(0);

    const handleImport = (e) => {
        e.preventDefault();
        setShowImportConfirm(true);
    };

    const confirmImport = () => {
        post(route('admin.settings.database.import'), {
            onSuccess: () => {
                setShowImportConfirm(false);
                resetImport();
            },
        });
    };

    const confirmReset = () => {
        postReset(route('admin.settings.database.reset'), {
            onSuccess: () => setShowResetConfirm(false),
        });
    };

    const { flash, errors: pageErrors } = usePage().props;

    return (
        <AuthenticatedLayout>
            <Head title="Pengaturan Database" />

            <div className="py-6 md:py-12 relative overflow-hidden">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 mb-6"
                    >
                        <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl shadow-neon-amber">
                            <DatabaseIcon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-red-600">
                                Database Management
                            </h1>
                            <p className="text-slate-500 font-medium">Export, Import, dan Reset basis data sistem EduMapper</p>
                        </div>
                    </motion.div>

                    {/* Alerts */}
                    {(flash?.success || flash?.error || pageErrors?.error) && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 mb-8 rounded-xl font-bold flex items-center gap-3 shadow-sm border ${
                                flash?.success ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                        >
                            {flash?.success ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
                            <span>{flash?.success || flash?.error || pageErrors?.error}</span>
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Export Card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col h-full relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 opacity-50 rounded-full blur-2xl transform group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="relative z-10 flex-1 flex flex-col">
                                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl w-max mb-6">
                                    <Download className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-black text-slate-800 mb-2">Export Database</h3>
                                <p className="text-sm text-slate-500 mb-8 font-medium">
                                    Unduh seluruh isi database saat ini ke dalam format `.sql`. Gunakan fitur ini untuk melakukan backup rutin.
                                </p>
                                <div className="mt-auto">
                                    <a 
                                        href={route('admin.settings.database.export')}
                                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-6 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95"
                                    >
                                        <Download className="w-5 h-5" />
                                        Mulai Export (.sql)
                                    </a>
                                </div>
                            </div>
                        </motion.div>

                        {/* Import Card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col h-full relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 opacity-50 rounded-full blur-2xl transform group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="relative z-10 flex-1 flex flex-col">
                                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl w-max mb-6">
                                    <Upload className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-black text-slate-800 mb-2">Import Database</h3>
                                <p className="text-sm text-slate-500 mb-6 font-medium">
                                    Unggah file `.sql` untuk memulihkan database. <strong className="text-rose-500">Peringatan:</strong> Ini akan menimpa/mengganti data yang sudah ada!
                                </p>
                                
                                <form onSubmit={handleImport} className="mt-auto space-y-4">
                                    <div>
                                        <input 
                                            type="file" 
                                            accept=".sql"
                                            onChange={e => setData('sql_file', e.target.files[0])}
                                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all cursor-pointer"
                                            required
                                        />
                                        {importErrors.sql_file && <p className="mt-1 text-xs text-rose-500 font-bold">{importErrors.sql_file}</p>}
                                    </div>
                                    <button 
                                        type="submit"
                                        disabled={!data.sql_file || importProcessing}
                                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 px-6 rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
                                    >
                                        <Upload className="w-5 h-5" />
                                        {importProcessing ? 'Mengimpor...' : 'Mulai Import'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>

                        {/* Reset Card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-100 flex flex-col h-full relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 opacity-50 rounded-full blur-2xl transform group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="relative z-10 flex-1 flex flex-col">
                                <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl w-max mb-6">
                                    <RotateCcw className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-black text-slate-800 mb-2">Reset Database</h3>
                                <p className="text-sm text-slate-500 mb-8 font-medium">
                                    Menghapus <strong className="text-rose-600">seluruh</strong> data dalam sistem dan mengembalikannya ke kondisi awal (kosong). Hanya akun admin default yang akan tersisa.
                                </p>
                                <div className="mt-auto">
                                    <button 
                                        onClick={() => {
                                            setResetStep(1);
                                            setShowResetConfirm(true);
                                        }}
                                        className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white py-3.5 px-6 rounded-xl font-bold shadow-lg shadow-rose-500/30 transition-all active:scale-95"
                                    >
                                        <ShieldAlert className="w-5 h-5" />
                                        Kosongkan Database
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Import Confirmation Modal */}
            <AnimatePresence>
                {showImportConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl"
                        >
                            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-center text-slate-800 mb-2">Konfirmasi Import</h3>
                            <p className="text-center text-slate-500 font-medium mb-8">
                                Mengimpor file SQL akan menimpa data yang ada saat ini. Pastikan Anda telah melakukan export (backup) sebelumnya. Lanjutkan?
                            </p>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setShowImportConfirm(false)}
                                    className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
                                >
                                    Batal
                                </button>
                                <button 
                                    onClick={confirmImport}
                                    disabled={importProcessing}
                                    className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-emerald-500/30"
                                >
                                    Ya, Import
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Reset Confirmation Modal */}
            <AnimatePresence>
                {showResetConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl border-2 border-rose-100"
                        >
                            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                <ShieldAlert className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-center text-rose-600 mb-2">PERINGATAN KERAS!</h3>
                            
                            {resetStep === 1 ? (
                                <>
                                    <p className="text-center text-slate-600 font-medium mb-8">
                                        Anda akan menghapus <strong className="text-rose-600 font-black">SELURUH DATA</strong> secara permanen. Tindakan ini tidak bisa dibatalkan.
                                    </p>
                                    <div className="flex gap-4">
                                        <button 
                                            onClick={() => setShowResetConfirm(false)}
                                            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
                                        >
                                            Batal Sekarang
                                        </button>
                                        <button 
                                            onClick={() => setResetStep(2)}
                                            className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-rose-500/30"
                                        >
                                            Lanjutkan
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-center text-slate-600 font-medium mb-8">
                                        Apakah Anda benar-benar yakin? Anda akan dikeluarkan dari sistem setelah proses ini selesai.
                                    </p>
                                    <div className="flex gap-4 flex-col">
                                        <button 
                                            onClick={confirmReset}
                                            disabled={resetProcessing}
                                            className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black transition-colors shadow-lg shadow-rose-500/30"
                                        >
                                            {resetProcessing ? 'Sedang Mereset...' : 'YA, HAPUS SEMUA DATA!'}
                                        </button>
                                        <button 
                                            onClick={() => setShowResetConfirm(false)}
                                            disabled={resetProcessing}
                                            className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
