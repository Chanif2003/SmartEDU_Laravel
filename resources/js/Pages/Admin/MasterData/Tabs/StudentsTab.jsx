import React, { useState, useEffect } from 'react';
import { router, useForm } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit, Trash2, QrCode, User, Users, UserCheck, X, Printer, Save } from 'lucide-react';
import Pagination from '@/Components/Pagination';

export default function StudentsTab({ auth, tabData: students, filters, majors = [] }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedQr, setSelectedQr] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isInitialRender, setIsInitialRender] = useState(true);
    const [currentId, setCurrentId] = useState(null);

    // Form setup for Add/Edit
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nama_lengkap: '',
        nis: '',
        nisn: '',
        gender: 'Laki-laki',
        major_id: '',
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

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            router.delete(route('admin.master.students.destroy', id), { preserveScroll: true });
        }
    };

    const openAddModal = () => {
        setIsEditing(false);
        setCurrentId(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (student) => {
        setIsEditing(true);
        setCurrentId(student.id);
        setData({
            nama_lengkap: student.nama_lengkap,
            nis: student.nis,
            nisn: student.nisn || '',
            gender: student.gender,
            major_id: student.major_id || '',
        });
        setIsModalOpen(true);
    };

    const submitForm = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('admin.master.students.update', currentId), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post(route('admin.master.students.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const printQrCode = () => {
        const printContent = document.getElementById('qr-print-area').innerHTML;
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head>');
        printWindow.document.write('<style>body{display:flex;justify-content:center;align-items:center;height:100vh;margin:0;font-family:sans-serif;}</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
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
        <>
            

            <div className="md:py-4 relative z-10">
                {/* Ambient Background Blobs */}
                
                
                

                <div className="relative z-10">
                    
                    {/* er & Search Controls */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                        <form onSubmit={handleSearch} className="w-full md:w-96 relative">
                            <div className="relative flex items-center">
                                <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                                <input 
                                    type="text" 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari nama atau NIS..." 
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
                            Tambah Siswa
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
                                                        <th className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Gender</th>
                                                        <th className="px-6 py-5 text-right text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Aksi</th>
                                                    </tr>
                                                </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {students.data.map((item) => (
                                                    <motion.tr variants={itemVariants} key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600">
                                                                    <User className="w-6 h-6" />
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-slate-800 text-base">{item.nama_lengkap}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-bold text-slate-800">{item.nis}</div>
                                                            <div className="text-xs text-slate-500">{item.nisn}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-4 py-1.5 inline-flex text-xs font-black uppercase tracking-wider rounded-full ${item.gender === 'Laki-laki' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                                                                {item.gender}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex justify-end gap-2">
                                                                <button onClick={() => setSelectedQr(item)} className="p-2.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors" title="Kartu QR">
                                                                    <QrCode className="w-5 h-5" />
                                                                </button>
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
                                    {students.data.map((item) => (
                                        <motion.div variants={itemVariants} key={item.id} className="bg-white p-4 rounded-[1.5rem] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] border border-slate-50 flex flex-col relative overflow-hidden">
                                            {/* Decorative side accent */}
                                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.gender === 'Laki-laki' ? 'bg-blue-400' : 'bg-pink-400'}`}></div>
                                            
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
                                                <span className={`mr-auto px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${item.gender === 'Laki-laki' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                                                    {item.gender}
                                                </span>
                                                
                                                <button onClick={() => setSelectedQr(item)} className="p-2 text-slate-400 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl active:scale-95 transition-all" title="QR">
                                                    <QrCode className="w-4 h-4" />
                                                </button>
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
                                <Pagination links={students.links} />
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
                                    {isEditing ? 'Edit Siswa' : 'Tambah Siswa'}
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
                                        <label className="block text-sm font-bold text-slate-700 mb-1">NIS</label>
                                        <input 
                                            type="text" 
                                            value={data.nis} 
                                            onChange={e => setData('nis', e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none"
                                            required
                                        />
                                        {errors.nis && <div className="text-red-500 text-xs mt-1">{errors.nis}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">NISN</label>
                                        <input 
                                            type="text" 
                                            value={data.nisn} 
                                            onChange={e => setData('nisn', e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none"
                                        />
                                        {errors.nisn && <div className="text-red-500 text-xs mt-1">{errors.nisn}</div>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Gender</label>
                                    <select 
                                        value={data.gender} 
                                        onChange={e => setData('gender', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none"
                                    >
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                    {errors.gender && <div className="text-red-500 text-xs mt-1">{errors.gender}</div>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Jurusan</label>
                                    <select 
                                        value={data.major_id} 
                                        onChange={e => setData('major_id', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none"
                                    >
                                        <option value="">Pilih Jurusan (Opsional)</option>
                                        {majors.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                    {errors.major_id && <div className="text-red-500 text-xs mt-1">{errors.major_id}</div>}
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

            {/* QR Code Modal (Framer Motion) */}
            <AnimatePresence>
                {selectedQr && (
                    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 md:p-0">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedQr(null)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 100, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 100, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden z-10 pb-4 md:pb-0"
                        >
                            {/* Modal er */}
                            <div className="flex justify-between items-center p-5 border-b border-slate-100">
                                <h3 className="font-bold text-slate-800">Kartu Identitas QR</h3>
                                <button onClick={() => setSelectedQr(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            {/* Modal Body */}
                            <div className="p-6">
                                <div id="qr-print-area" className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                                    <h2 className="text-lg font-black text-slate-800 mb-6 text-center">{selectedQr.nama_lengkap}</h2>
                                    <div className="bg-white p-4 rounded-xl shadow-sm">
                                        <QRCodeSVG value={selectedQr.id.toString()} size={180} />
                                    </div>
                                    <div className="mt-6 flex flex-col items-center gap-1 text-slate-500">
                                        <p className="text-sm font-semibold tracking-widest uppercase">NIS</p>
                                        <p className="text-xl font-bold text-slate-700">{selectedQr.nis}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Modal Footer */}
                            <div className="p-5 border-t border-slate-100 flex gap-3">
                                <button 
                                    onClick={() => setSelectedQr(null)}
                                    className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                                >
                                    Tutup
                                </button>
                                <button 
                                    onClick={printQrCode}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-brand-500/30"
                                >
                                    <Printer className="w-4 h-4" />
                                    Cetak PDF
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}