import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit, Trash2, User, Users, Calendar, UserCheck, X, Printer, Save } from 'lucide-react';
import Pagination from '@/Components/Pagination';

export default function Index({ auth, semesters, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isInitialRender, setIsInitialRender] = useState(true);
    const [currentId, setCurrentId] = useState(null);

    // Form setup for Add/Edit
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nama_lengkap: '',
        name: '',
        status: '',
        keterangan: 'Aktif',
    });

    // Detect mobile viewport to fetch only 5 items instead of 10
    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        const desiredPerPage = isMobile ? 5 : 10;
        
        if (!filters.per_page || parseInt(filters.per_page) !== desiredPerPage) {
            router.reload({
                data: { search, per_page: desiredPerPage },
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['semesters', 'filters'],
                showProgress: false
            });
        }
    }, []);

    useEffect(() => {
        if (isInitialRender) {
            setIsInitialRender(false);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            router.reload({ 
                data: { search, per_page: filters.per_page },
                preserveState: true, 
                preserveScroll: true,
                replace: true,
                only: ['semesters'],
                showProgress: false
            });
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.reload({ 
            data: { search, per_page: filters.per_page },
            preserveState: true, 
            preserveScroll: true, 
            replace: true,
            only: ['semesters'],
            showProgress: false
        });
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            router.delete(route('admin.master.semesters.destroy', id), { preserveScroll: true });
        }
    };

    const openAddModal = () => {
        setIsEditing(false);
        setCurrentId(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (semester) => {
        setIsEditing(true);
        setCurrentId(semester.id);
        setData({
            nama_lengkap: semester.nama_lengkap,
            name: semester.name,
            status: semester.status || '',
            keterangan: semester.keterangan,
        });
        setIsModalOpen(true);
    };

    const submitForm = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('admin.master.semesters.update', currentId), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post(route('admin.master.semesters.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };


    // Framer motion variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl shadow-neon-violet">
                        <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="font-black text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-brand-600 tracking-tight">
                        Data Semester
                    </h2>
                </div>
            }
        >
            <Head title="Master Semesters" />

            <div className="py-6 md:py-12 relative z-10">
                {/* Ambient Background Blobs */}
                <div className="absolute top-0 -left-40 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob pointer-events-none"></div>
                <div className="absolute top-0 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>
                <div className="absolute -bottom-40 left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-0 sm:px-4 md:px-6 lg:px-8 relative z-10">
                    
                    {/* Header & Search Controls */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                        <form onSubmit={handleSearch} className="w-full md:w-96 relative">
                            <div className="relative flex items-center">
                                <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                                <input 
                                    type="text" 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari nama atau Nama Semester..." 
                                    className="w-full pl-12 pr-4 py-3.5 md:py-3 bg-slate-100/80 md:bg-white border-transparent md:border-slate-200 text-slate-800 placeholder-slate-400 rounded-2xl md:shadow-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all duration-300 outline-none"
                                />
                                <button type="submit" className="hidden md:block absolute right-2 px-4 py-1.5 bg-brand-50 text-brand-600 font-bold rounded-xl text-sm hover:bg-brand-100 transition-colors">
                                    Cari
                                </button>
                            </div>
                        </form>
                        
                        <motion.button 
                            onClick={openAddModal}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="hidden md:flex w-full md:w-auto items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-neon-violet hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Tambah Semester
                        </motion.button>
                    </div>

                    {/* Data Display */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden relative"
                    >
                        {/* Decorative internal blob */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-bl-[100px] -z-10 opacity-50 pointer-events-none"></div>

                        <div className="p-4 sm:p-6 md:p-8">
                            {semesters.data.length === 0 ? (
                                <div className="text-center py-16 bg-white/50 rounded-3xl border border-dashed border-slate-200">
                                    <div className="w-20 h-20 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                        <Search className="w-10 h-10 text-slate-300" />
                                    </div>
                                    <p className="text-slate-500 text-lg font-medium">Tidak ada data semester ditemukan.</p>
                                    <p className="text-slate-400 text-sm mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
                                </div>
                            ) : (
                                <>
                                    {/* DESKTOP VIEW: Table */}
                                    <div className="hidden md:block overflow-x-auto custom-scrollbar relative z-10">
                                        <div className="inline-block min-w-full align-middle">
                                            <table className="min-w-full divide-y divide-slate-100">
                                                <thead className="bg-slate-50/50 backdrop-blur-sm border-b border-slate-100">
                                                    <tr>
                                                        <th className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Semester</th>
                                                        <th className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Keterangan</th>
                                                        <th className="px-6 py-5 text-right text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Aksi</th>
                                                    </tr>
                                                </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {semesters.data.map((item) => (
                                                    <motion.tr variants={itemVariants} key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                                        <td className="px-6 py-4 whitespace-nowrap">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600">
<Calendar className="w-6 h-6" />
</div>
<div>
<div className="font-bold text-slate-800 text-base">{item.name}</div>
</div>
</div>
</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
<span className={`px-4 py-1.5 inline-flex text-xs font-black uppercase tracking-wider rounded-full ${item.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
{item.is_active ? "Aktif" : "Tidak Aktif"}
</span>
</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex justify-end gap-2">
                                                                <button onClick={() => openEditModal(item)} className="p-2.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors" title="Edit">
                                                                    <Edit className="w-5 h-5" />
                                                                </button>
                                                                <button onClick={() => handleDelete(item.id)} className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors" title="Hapus">
                                                                    <Trash2 className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* MOBILE VIEW: Native App Style Card List */}
                                <div className="grid grid-cols-1 gap-3 md:hidden mb-6">
                                    {semesters.data.map((item) => (
                                        <motion.div variants={itemVariants} key={item.id} className="bg-white p-4 rounded-[1.5rem] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] border border-slate-50 flex flex-col relative overflow-hidden">
                                            {/* Decorative side accent */}
                                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.is_active ? 'bg-emerald-400' : 'bg-slate-400'}`}></div>
                                            
                                            <div className="flex items-center gap-3.5 ml-1">
                                                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-brand-600 shrink-0 border-2 border-white shadow-sm">
                                                    <Calendar className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-slate-800 text-base leading-tight truncate">{item.name}</h3>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-50 ml-1">
                                                <span className={`mr-auto px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${item.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'}`}>
{item.is_active ? 'Aktif' : 'Tidak Aktif'}
</span>
                                                
                                                <button onClick={() => openEditModal(item)} className="p-2 text-slate-400 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl active:scale-95 transition-all" title="Edit">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 bg-slate-50 hover:bg-red-50 hover:text-red-600 rounded-xl active:scale-95 transition-all" title="Hapus">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                
                                {/* Pagination */}
                                <Pagination links={semesters.links} />
                            </>
                        )}
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* Native Mobile FAB (Floating Action Button) */}
            <div className="md:hidden fixed bottom-28 right-6 z-40">
                <motion.button 
                    onClick={openAddModal}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-brand-600 to-indigo-500 text-white rounded-full shadow-[0_10px_25px_rgba(79,70,229,0.5)] border-2 border-white/20"
                >
                    <Plus className="w-7 h-7" />
                </motion.button>
            </div>

            {/* Add/Edit Form Modal (Framer Motion) */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden z-10"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="font-black text-xl text-slate-800">
                                    {isEditing ? 'Edit Semester' : 'Tambah Semester'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <form onSubmit={submitForm} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Nama Lengkap</label>
                                    <input 
                                        type="text" 
                                        value={data.nama_lengkap} 
                                        onChange={e => setData('nama_lengkap', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none"
                                        required
                                    />
                                    {errors.nama_lengkap && <div className="text-red-500 text-xs mt-1">{errors.nama_lengkap}</div>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Nama Semester</label>
                                        <input 
                                            type="text" 
                                            value={data.name} 
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none"
                                            required
                                        />
                                        {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                                        <input 
                                            type="text" 
                                            value={data.status} 
                                            onChange={e => setData('status', e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none"
                                        />
                                        {errors.status && <div className="text-red-500 text-xs mt-1">{errors.status}</div>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Keterangan</label>
                                    <select 
                                        value={data.keterangan} 
                                        onChange={e => setData('keterangan', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none"
                                    >
                                        <option value="Aktif">Aktif</option>
                                        <option value="Tidak Aktif">Tidak Aktif</option>
                                    </select>
                                    {errors.keterangan && <div className="text-red-500 text-xs mt-1">{errors.keterangan}</div>}
                                </div>

                                <div className="mt-8 flex gap-3">
                                    <button 
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-brand-500/30 disabled:opacity-50"
                                    >
                                        <Save className="w-5 h-5" />
                                        {processing ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </AuthenticatedLayout>
    );
}