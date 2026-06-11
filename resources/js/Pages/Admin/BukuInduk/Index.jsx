import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Search, FolderOpen, User, Eye, Download } from 'lucide-react';
import Pagination from '@/Components/Pagination';

export default function Index({ auth, students, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [isInitialRender, setIsInitialRender] = useState(true);

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
                only: ['students', 'filters'],
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
                only: ['students'],
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
            only: ['students'],
            showProgress: false
        });
    };

    // Framer motion variants
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-neon-orange">
                        <FolderOpen className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="font-black text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-amber-600 tracking-tight">
                        Buku Induk Siswa
                    </h2>
                </div>
            }
        >
            <Head title="Buku Induk Siswa" />

            <div className="py-6 md:py-12 relative z-10">
                {/* Ambient Background Blobs */}
                <div className="absolute top-0 -left-40 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob pointer-events-none"></div>
                <div className="absolute top-0 -right-40 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>
                
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
                                    placeholder="Cari nama atau NIS/NISN..." 
                                    className="w-full pl-12 pr-4 py-3.5 md:py-3 bg-slate-100/80 md:bg-white border-transparent md:border-slate-200 text-slate-800 placeholder-slate-400 rounded-2xl md:shadow-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 outline-none"
                                />
                                <button type="submit" className="hidden md:block absolute right-2 px-4 py-1.5 bg-amber-50 text-amber-600 font-bold rounded-xl text-sm hover:bg-amber-100 transition-colors">
                                    Cari
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Data Display */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden relative"
                    >
                        {/* Decorative internal blob */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-bl-[100px] -z-10 opacity-50 pointer-events-none"></div>

                        <div className="p-4 sm:p-6 md:p-8">
                            {students.data.length === 0 ? (
                                <div className="text-center py-16 bg-white/50 rounded-3xl border border-dashed border-slate-200">
                                    <div className="w-20 h-20 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                        <Search className="w-10 h-10 text-slate-300" />
                                    </div>
                                    <p className="text-slate-500 text-lg font-medium">Tidak ada data siswa ditemukan.</p>
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
                                                        <th className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Siswa</th>
                                                        <th className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">NIS / NISN</th>
                                                        <th className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                                                        <th className="px-6 py-5 text-right text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Aksi</th>
                                                    </tr>
                                                </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {students.data.map((item) => (
                                                    <motion.tr variants={itemVariants} key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                                                                    <User className="w-6 h-6" />
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-slate-800 text-base">{item.nama_lengkap}</div>
                                                                    <div className="text-xs text-slate-500">{item.school_class?.name || 'Belum Ada Kelas'}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-bold text-slate-800">{item.nis}</div>
                                                            <div className="text-xs text-slate-500">{item.nisn}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-4 py-1.5 inline-flex text-xs font-black uppercase tracking-wider rounded-full ${item.is_active ? 'bg-emerald-100 text-emerald-700' : (item.is_alumni ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700')}`}>
                                                                {item.is_active ? 'Aktif' : (item.is_alumni ? 'Lulus' : 'Non-Aktif')}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <Link href={route('admin.buku-induk.show', item.id)} className="inline-flex items-center gap-2 px-4 py-2 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors font-bold">
                                                                <Eye className="w-4 h-4" /> Buka Lembaran
                                                            </Link>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* MOBILE VIEW: Native App Style Card List */}
                                <div className="grid grid-cols-1 gap-3 md:hidden mb-6">
                                    {students.data.map((item) => (
                                        <motion.div variants={itemVariants} key={item.id} className="bg-white p-4 rounded-[1.5rem] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] border border-slate-50 flex flex-col relative overflow-hidden">
                                            {/* Decorative side accent */}
                                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.is_active ? 'bg-emerald-400' : 'bg-slate-400'}`}></div>
                                            
                                            <div className="flex items-center gap-3.5 ml-1">
                                                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 shrink-0 border-2 border-white shadow-sm">
                                                    <User className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-slate-800 text-base leading-tight truncate">{item.nama_lengkap}</h3>
                                                    <p className="text-xs font-medium text-slate-500 mt-0.5 truncate">NIS: <span className="text-slate-700 font-semibold">{item.nis}</span></p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-50 ml-1">
                                                <span className={`mr-auto px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${item.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'}`}>
                                                    {item.is_active ? 'Aktif' : 'Non-Aktif'}
                                                </span>
                                                
                                                <Link href={route('admin.buku-induk.show', item.id)} className="flex items-center gap-2 px-3 py-1.5 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg text-xs font-bold transition-colors">
                                                    <Eye className="w-3 h-3" /> Buka Lembaran
                                                </Link>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                
                                {/* Pagination */}
                                <Pagination links={students.links} />
                            </>
                        )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}