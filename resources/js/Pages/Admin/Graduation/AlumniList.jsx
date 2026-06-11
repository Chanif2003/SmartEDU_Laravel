import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { GraduationCap, Search, Printer, Edit2, Users, FileText, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Pagination from '@/Components/Pagination';

export default function AlumniList({ auth, alumni, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [editingStudent, setEditingStudent] = useState(null);
    const [isInitialRender, setIsInitialRender] = useState(true);

    // Detect mobile viewport for per_page
    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        const desiredPerPage = isMobile ? 5 : 10;
        
        if (!filters?.per_page || parseInt(filters.per_page) !== desiredPerPage) {
            router.reload({
                data: { search, per_page: desiredPerPage },
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['alumni', 'filters'],
                showProgress: false
            });
        }
    }, []);

    // Search debounce
    useEffect(() => {
        if (isInitialRender) {
            setIsInitialRender(false);
            return;
        }

        const timeoutId = setTimeout(() => {
            const isMobile = window.innerWidth < 768;
            router.get(
                route('admin.graduation.alumni'),
                { search, per_page: isMobile ? 5 : 10 },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['alumni', 'filters'],
                }
            );
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [search]);

    const { data, setData, post, processing, errors, reset } = useForm({
        skl_number: '',
        ijazah_number: '',
        ijazah_scan: null,
    });

    const openEditModal = (student) => {
        setEditingStudent(student);
        setData({
            skl_number: student.skl_number || '',
            ijazah_number: student.ijazah_number || '',
            ijazah_scan: null,
        });
    };

    const closeEditModal = () => {
        setEditingStudent(null);
        reset();
    };

    const handleUpdateIjazah = (e) => {
        e.preventDefault();
        post(route('admin.graduation.update-ijazah', editingStudent.id), {
            onSuccess: () => closeEditModal(),
        });
    };

    const alumniData = alumni.data || [];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Data Alumni & Kelulusan</h2>}
        >
            <Head title="Data Alumni" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Tabs Navigation */}
                    <div className="flex bg-white rounded-2xl shadow-sm p-1.5 border border-slate-100 mb-6">
                        <Link 
                            href={route('admin.graduation.index')}
                            className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all"
                        >
                            Proses Kelulusan
                        </Link>
                        <Link 
                            href={route('admin.graduation.alumni')}
                            className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold bg-emerald-50 text-emerald-600 shadow-sm transition-all"
                        >
                            Data Alumni
                        </Link>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Daftar Alumni</h3>
                                    <p className="text-slate-500 text-sm mt-1">Kelola nomor ijazah dan cetak SKL siswa yang telah lulus.</p>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Cari nama, NISN, atau Ijazah..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 rounded-xl border-slate-200 text-sm focus:border-emerald-500 focus:ring-emerald-500 w-full md:w-80 shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="hidden md:table w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Nama Lengkap & NISN</th>
                                        <th className="px-6 py-4 font-bold">Tahun Lulus</th>
                                        <th className="px-6 py-4 font-bold">No. SKL</th>
                                        <th className="px-6 py-4 font-bold">No. Ijazah</th>
                                        <th className="px-6 py-4 font-bold text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alumniData.map((student) => (
                                        <tr key={student.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-800">{student.nama_lengkap}</div>
                                                <div className="text-xs text-slate-500 mt-1">NISN: {student.nisn || '-'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-600">
                                                    {student.graduation_year}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-slate-600">
                                                {student.skl_number || '-'}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs">
                                                {student.ijazah_number ? (
                                                    <span className="text-emerald-600 font-medium">{student.ijazah_number}</span>
                                                ) : (
                                                    <span className="text-rose-400 font-medium italic">Belum diisi</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => openEditModal(student)}
                                                    className="inline-flex items-center justify-center p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors"
                                                    title="Input SKL/Ijazah"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                {student.skl_number && (
                                                    <a
                                                        href={route('admin.graduation.print-skl', student.id)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center justify-center p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                                                        title="Cetak SKL"
                                                    >
                                                        <Printer size={16} />
                                                    </a>
                                                )}
                                                {student.ijazah_scan && (
                                                    <a
                                                        href={`/storage/${student.ijazah_scan}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center justify-center p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                                                        title="Lihat Scan Ijazah"
                                                    >
                                                        <FileText size={16} />
                                                    </a>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {alumniData.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                                Tidak ada data alumni ditemukan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden divide-y divide-slate-100">
                            {alumniData.length > 0 ? alumniData.map((student) => (
                                <div key={student.id} className="p-4 bg-white flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-slate-800">{student.nama_lengkap}</h4>
                                            <div className="text-xs text-slate-500 mt-0.5">NISN: {student.nisn || '-'}</div>
                                        </div>
                                        <span className="inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-600">
                                            Lulus {student.graduation_year}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                                            <span className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">No. SKL</span>
                                            <span className="font-mono text-slate-700 font-medium">{student.skl_number || '-'}</span>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                                            <span className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">No. Ijazah</span>
                                            {student.ijazah_number ? (
                                                <span className="font-mono text-emerald-600 font-medium">{student.ijazah_number}</span>
                                            ) : (
                                                <span className="text-rose-400 font-medium italic">Belum diisi</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 justify-end mt-1">
                                        <button
                                            onClick={() => openEditModal(student)}
                                            className="flex-1 inline-flex items-center justify-center p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors text-xs font-bold gap-1.5"
                                        >
                                            <Edit2 size={14} />
                                            <span>Input</span>
                                        </button>
                                        {student.skl_number && (
                                            <a
                                                href={route('admin.graduation.print-skl', student.id)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                                            >
                                                <Printer size={16} />
                                            </a>
                                        )}
                                        {student.ijazah_scan && (
                                            <a
                                                href={`/storage/${student.ijazah_scan}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                                            >
                                                <FileText size={16} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <div className="py-12 text-center px-4">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                                            <Users className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-700">Alumni Tidak Ditemukan</p>
                                            <p className="text-sm text-slate-500 mt-1">Belum ada data alumni yang lulus.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                            <Pagination links={alumni.links} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Input Ijazah */}
            <AnimatePresence>
                {editingStudent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => !processing && closeEditModal()}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden"
                        >
                            <div className="p-6 md:p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center">
                                            <FileText className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <h3 className="text-xl font-black text-slate-800">Input Nomor Ijazah</h3>
                                    </div>
                                    <button 
                                        onClick={() => !processing && closeEditModal()}
                                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                                    >
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>

                                <form onSubmit={handleUpdateIjazah} className="space-y-4">
                                    <div>
                                        <p className="text-sm text-slate-500 mb-4">
                                            Masukkan data SKL dan Ijazah untuk <span className="font-bold text-slate-800">{editingStudent.nama_lengkap}</span>.
                                        </p>
                                        
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Nomor SKL</label>
                                                <input
                                                    type="text"
                                                    value={data.skl_number}
                                                    onChange={e => setData('skl_number', e.target.value)}
                                                    className="w-full rounded-xl border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50/50 font-medium"
                                                    placeholder="001/SKL/2026"
                                                />
                                                {errors.skl_number && <p className="text-rose-500 text-xs font-bold mt-1.5">{errors.skl_number}</p>}
                                                <p className="text-xs text-slate-500 mt-1">Harus diisi agar bisa mencetak SKL.</p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Nomor Ijazah</label>
                                                <input
                                                    type="text"
                                                    value={data.ijazah_number}
                                                    onChange={e => setData('ijazah_number', e.target.value)}
                                                    className="w-full rounded-xl border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50/50 font-medium"
                                                    placeholder="DN-01 Mk 0000000"
                                                />
                                                {errors.ijazah_number && <p className="text-rose-500 text-xs font-bold mt-1.5">{errors.ijazah_number}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Upload Scan Ijazah</label>
                                                <input
                                                    type="file"
                                                    onChange={e => setData('ijazah_scan', e.target.files[0])}
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                    className="w-full rounded-xl border border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                                />
                                                {errors.ijazah_scan && <p className="text-rose-500 text-xs font-bold mt-1.5">{errors.ijazah_scan}</p>}
                                                {editingStudent.ijazah_scan && !data.ijazah_scan && (
                                                    <p className="text-xs text-emerald-600 mt-1 font-medium">✓ File scan sudah ada. Upload baru untuk mengganti.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mt-8 pt-6 border-t border-slate-100">
                                        <button
                                            type="button"
                                            onClick={() => !processing && closeEditModal()}
                                            className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                                            disabled={processing}
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing || !data.ijazah_number}
                                            className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Menyimpan...' : 'Simpan Ijazah'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
