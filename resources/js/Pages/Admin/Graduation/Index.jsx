import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, Link } from '@inertiajs/react';
import { GraduationCap, Search, CheckSquare, Square, CheckCircle, AlertTriangle, X, Users, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GraduationIndex({ auth, classes, students, selectedClassId }) {
    const [search, setSearch] = useState('');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    
    // For bulk selection
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        student_ids: [],
        graduation_date: '',
        graduation_year: new Date().getFullYear().toString(),
    });

    const handleClassChange = (e) => {
        const classId = e.target.value;
        router.get(route('admin.graduation.index'), { class_id: classId }, { preserveState: true });
        // Reset selections when class changes
        setSelectedStudentIds([]);
        setData('student_ids', []);
    };

    const filteredStudents = useMemo(() => {
        return students.filter(student => 
            student.nama_lengkap.toLowerCase().includes(search.toLowerCase()) || 
            (student.nisn && student.nisn.includes(search))
        );
    }, [students, search]);

    const handleSelectAll = () => {
        if (selectedStudentIds.length === filteredStudents.length) {
            setSelectedStudentIds([]);
            setData('student_ids', []);
        } else {
            const allIds = filteredStudents.map(s => s.id);
            setSelectedStudentIds(allIds);
            setData('student_ids', allIds);
        }
    };

    const handleSelectRow = (id) => {
        const newSelectedIds = selectedStudentIds.includes(id)
            ? selectedStudentIds.filter(studentId => studentId !== id)
            : [...selectedStudentIds, id];
            
        setSelectedStudentIds(newSelectedIds);
        setData('student_ids', newSelectedIds);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        post(route('admin.graduation.bulk-graduate'), {
            onSuccess: () => {
                setIsConfirmModalOpen(false);
                setSelectedStudentIds([]);
                reset();
                // Optionally reload data
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-neon-emerald">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="font-black text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-emerald-600 tracking-tight">
                                Kelulusan & Alumni
                            </h2>
                            <p className="text-sm font-medium text-slate-500 mt-1">Kelola data kelulusan siswa tingkat akhir secara massal</p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Manajemen Kelulusan" />

            <div className="py-6 md:py-12 relative z-10">
                {/* Ambient Background Blobs */}
                <div className="absolute top-0 -left-40 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob pointer-events-none"></div>
                <div className="absolute top-0 -right-40 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
                    
                    {/* Tabs Navigation */}
                    <div className="flex bg-white rounded-2xl shadow-sm p-1.5 border border-slate-100 mb-6">
                        <Link 
                            href={route('admin.graduation.index')}
                            className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold bg-emerald-50 text-emerald-600 shadow-sm transition-all"
                        >
                            Proses Kelulusan
                        </Link>
                        <Link 
                            href={route('admin.graduation.alumni')}
                            className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all"
                        >
                            Data Alumni
                        </Link>
                    </div>

                    {/* Header Controls */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/80 backdrop-blur-xl p-4 md:p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col md:flex-row gap-4"
                    >
                        <div className="flex-1 w-full md:w-1/3">
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Pilih Kelas</label>
                            <select
                                value={selectedClassId || ''}
                                onChange={handleClassChange}
                                className="w-full rounded-xl border-slate-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50/50 font-medium"
                            >
                                <option value="">-- Pilih Kelas Tingkat Akhir --</option>
                                {classes.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        {selectedClassId && (
                            <div className="flex-1 w-full md:w-1/3">
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Cari Siswa</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Cari nama atau NISN..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-10 rounded-xl border-slate-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50/50 font-medium"
                                    />
                                </div>
                            </div>
                        )}

                        {selectedClassId && (
                            <div className="flex-1 flex items-end justify-end">
                                <button
                                    onClick={() => setIsConfirmModalOpen(true)}
                                    disabled={selectedStudentIds.length === 0}
                                    className={`w-full md:w-auto px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                                        selectedStudentIds.length > 0 
                                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:scale-105' 
                                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    }`}
                                >
                                    <GraduationCap className="w-5 h-5" />
                                    Luluskan ({selectedStudentIds.length}) Siswa
                                </button>
                            </div>
                        )}
                    </motion.div>

                    {/* Table Section */}
                    {selectedClassId ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden"
                        >
                            <div className="overflow-x-auto">
                                <table className="hidden md:table w-full text-sm text-left text-slate-600">
                                    <thead className="text-xs font-bold text-slate-500 bg-slate-50/80 uppercase tracking-wider border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4 w-16">
                                                <button onClick={handleSelectAll} className="text-slate-400 hover:text-emerald-600 transition-colors">
                                                    {filteredStudents.length > 0 && selectedStudentIds.length === filteredStudents.length ? (
                                                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                                                    ) : (
                                                        <Square className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </th>
                                            <th className="px-6 py-4">Nama Lengkap</th>
                                            <th className="px-6 py-4">NISN</th>
                                            <th className="px-6 py-4">Kelas</th>
                                            <th className="px-6 py-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredStudents.length > 0 ? (
                                            filteredStudents.map((student) => (
                                                <tr 
                                                    key={student.id} 
                                                    className={`border-b border-slate-50 hover:bg-slate-50/80 transition-colors cursor-pointer ${selectedStudentIds.includes(student.id) ? 'bg-emerald-50/50' : ''}`}
                                                    onClick={() => handleSelectRow(student.id)}
                                                >
                                                    <td className="px-6 py-4">
                                                        {selectedStudentIds.includes(student.id) ? (
                                                            <CheckSquare className="w-5 h-5 text-emerald-600" />
                                                        ) : (
                                                            <Square className="w-5 h-5 text-slate-300" />
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-slate-800">{student.nama_lengkap}</td>
                                                    <td className="px-6 py-4 font-medium text-slate-500">{student.nisn || '-'}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold inline-block">
                                                            {student.class_name}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {student.is_active ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                                                                Aktif
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                                                                Non-Aktif
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center justify-center gap-3">
                                                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                                                            <Users className="w-8 h-8 text-slate-400" />
                                                        </div>
                                                        <p className="text-slate-500 font-medium">Tidak ada data siswa ditemukan.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile View */}
                            <div className="md:hidden">
                                {filteredStudents.length > 0 ? (
                                    <div className="divide-y divide-slate-100">
                                        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-500 uppercase">Pilih Semua</span>
                                            <button onClick={handleSelectAll} className="text-slate-400 hover:text-emerald-600 transition-colors p-2">
                                                {filteredStudents.length > 0 && selectedStudentIds.length === filteredStudents.length ? (
                                                    <CheckSquare className="w-6 h-6 text-emerald-600" />
                                                ) : (
                                                    <Square className="w-6 h-6" />
                                                )}
                                            </button>
                                        </div>
                                        {filteredStudents.map((student) => (
                                            <div 
                                                key={student.id}
                                                className={`p-4 flex items-start gap-4 transition-colors ${selectedStudentIds.includes(student.id) ? 'bg-emerald-50/50' : 'bg-white'}`}
                                                onClick={() => handleSelectRow(student.id)}
                                            >
                                                <button className="mt-1 shrink-0">
                                                    {selectedStudentIds.includes(student.id) ? (
                                                        <CheckSquare className="w-6 h-6 text-emerald-600" />
                                                    ) : (
                                                        <Square className="w-6 h-6 text-slate-300" />
                                                    )}
                                                </button>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-slate-800 truncate">{student.nama_lengkap}</h4>
                                                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                                        <span className="text-xs font-medium text-slate-500">NISN: {student.nisn || '-'}</span>
                                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-bold">
                                                            {student.class_name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center px-4">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                                                <Users className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-700">Siswa Tidak Ditemukan</p>
                                                <p className="text-sm text-slate-500 mt-1">Tidak ada siswa yang sesuai dengan pencarian Anda.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-center px-4">
                            <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-emerald-100">
                                <GraduationCap className="w-12 h-12 text-emerald-500" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Pilih Kelas Terlebih Dahulu</h3>
                            <p className="text-slate-500 max-w-md mx-auto font-medium leading-relaxed">
                                Silakan pilih kelas tingkat akhir pada dropdown di atas untuk melihat daftar siswa dan mengelola kelulusan mereka.
                            </p>
                        </div>
                    )}

                </div>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {isConfirmModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => !processing && setIsConfirmModalOpen(false)}
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
                                        <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center">
                                            <AlertTriangle className="w-6 h-6 text-amber-600" />
                                        </div>
                                        <h3 className="text-xl font-black text-slate-800">Konfirmasi Kelulusan</h3>
                                    </div>
                                    <button 
                                        onClick={() => !processing && setIsConfirmModalOpen(false)}
                                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                                    >
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>

                                <p className="text-slate-600 font-medium mb-6">
                                    Apakah Anda yakin menetapkan kelulusan untuk <span className="font-black text-emerald-600 text-lg">{selectedStudentIds.length}</span> siswa terpilih? Aksi ini akan mengubah status mereka menjadi Alumni dan mengarsipkan data mereka.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Tanggal Kelulusan</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Calendar className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <input
                                                type="date"
                                                value={data.graduation_date}
                                                onChange={e => setData('graduation_date', e.target.value)}
                                                className="w-full pl-10 rounded-xl border-slate-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50/50 font-medium"
                                                required
                                            />
                                        </div>
                                        {errors.graduation_date && <p className="text-rose-500 text-xs font-bold mt-1.5">{errors.graduation_date}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Tahun Kelulusan</label>
                                        <input
                                            type="text"
                                            value={data.graduation_year}
                                            onChange={e => setData('graduation_year', e.target.value)}
                                            className="w-full rounded-xl border-slate-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50/50 font-medium"
                                            placeholder="YYYY"
                                            required
                                            maxLength={4}
                                        />
                                        {errors.graduation_year && <p className="text-rose-500 text-xs font-bold mt-1.5">{errors.graduation_year}</p>}
                                    </div>

                                    {errors.student_ids && <p className="text-rose-500 text-xs font-bold mt-1.5">{errors.student_ids}</p>}

                                    <div className="flex items-center gap-3 mt-8 pt-6 border-t border-slate-100">
                                        <button
                                            type="button"
                                            onClick={() => !processing && setIsConfirmModalOpen(false)}
                                            className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                                            disabled={processing}
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing || !data.graduation_date || !data.graduation_year}
                                            className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg shadow-emerald-500/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Memproses...' : 'Ya, Luluskan'}
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
