import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { FileSpreadsheet, Search, CheckCircle, Clock, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RecapIndex({ auth, records, type, date }) {
    const [selectedDate, setSelectedDate] = useState(date);
    const [search, setSearch] = useState('');

    const handleFilter = () => {
        router.get(route('admin.presence.recap'), {
            type: type,
            date: selectedDate
        }, { preserveState: true });
    };

    const title = type === 'student' ? 'Rekap Kehadiran Siswa' : 'Rekap Kehadiran Guru & Staf';

    const filteredRecords = records.filter(r => 
        r.person_name.toLowerCase().includes(search.toLowerCase()) || 
        r.identifier.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusBadge = (status) => {
        if (!status) return <span className="text-xs text-slate-400 font-medium">-</span>;
        
        if (status.toLowerCase().includes('tepat') || status.toLowerCase().includes('awal')) {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {status}
                </span>
            );
        } else if (status.toLowerCase().includes('terlambat')) {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                    <Clock className="w-3.5 h-3.5" />
                    {status}
                </span>
            );
        }
        
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {status}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl shadow-neon-violet">
                            <FileSpreadsheet className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="font-black text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-brand-600 tracking-tight">
                            {title}
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title={title} />

            <div className="py-6 md:py-12 relative z-10">
                {/* Ambient Background Blobs */}
                <div className="absolute top-0 -left-40 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob pointer-events-none"></div>
                <div className="absolute top-0 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>
                
                <div className="max-w-7xl mx-auto px-0 sm:px-4 md:px-6 lg:px-8 relative z-10 space-y-6">
                    
                    {/* Filter Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/80 backdrop-blur-xl p-4 md:p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col md:flex-row gap-4 md:items-end"
                    >
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Tanggal</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full rounded-xl border-slate-200 shadow-sm focus:border-brand-500 focus:ring-brand-500 bg-slate-50/50 font-medium"
                            />
                        </div>
                        <div className="w-full md:w-auto">
                            <button
                                onClick={handleFilter}
                                className="w-full md:w-auto bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm"
                            >
                                Tampilkan
                            </button>
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Cari Nama/ID</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Cari..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 rounded-xl border-slate-200 shadow-sm focus:border-brand-500 focus:ring-brand-500 bg-slate-50/50 font-medium"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Table Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-600 hidden md:table">
                                <thead className="text-xs font-bold text-slate-500 bg-slate-50/80 uppercase tracking-wider border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4">No</th>
                                        <th className="px-6 py-4">Nama</th>
                                        <th className="px-6 py-4">Tipe / ID</th>
                                        <th className="px-6 py-4">Jam Datang</th>
                                        <th className="px-6 py-4">Jam Pulang</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRecords.length > 0 ? (
                                        filteredRecords.map((record, index) => (
                                            <tr key={record.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                                                <td className="px-6 py-4 font-medium">{index + 1}</td>
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-slate-800">{record.person_name}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-bold mb-1 inline-block uppercase tracking-wider">{record.person_type}</span>
                                                    <p className="text-xs font-medium text-slate-500">{record.identifier}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {record.check_in ? (
                                                        <div className="flex flex-col gap-1.5 items-start">
                                                            <span className="font-black text-slate-700 text-base">{record.check_in}</span>
                                                            {getStatusBadge(record.status_in)}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-rose-500 font-bold bg-rose-50 px-2.5 py-1 rounded-md">Belum Hadir</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {record.check_out ? (
                                                        <div className="flex flex-col gap-1.5 items-start">
                                                            <span className="font-black text-slate-700 text-base">{record.check_out}</span>
                                                            {getStatusBadge(record.status_out)}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 font-medium">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center gap-3">
                                                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                                                        <XCircle className="w-8 h-8 text-slate-400" />
                                                    </div>
                                                    <p className="text-slate-500 font-medium">Tidak ada data kehadiran pada tanggal ini.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            
                            {/* Mobile View */}
                            <div className="md:hidden flex flex-col p-4 gap-4">
                                {filteredRecords.length > 0 ? (
                                    filteredRecords.map((record, index) => (
                                        <div key={record.id} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex flex-col gap-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-slate-800">{record.person_name}</h4>
                                                    <p className="text-xs text-slate-500 mt-0.5">{record.person_type} - {record.identifier}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Datang</p>
                                                    {record.check_in ? (
                                                        <div className="flex flex-col gap-1 items-start">
                                                            <span className="font-black text-slate-700">{record.check_in}</span>
                                                            {getStatusBadge(record.status_in)}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-rose-500 font-bold">Belum Hadir</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pulang</p>
                                                    {record.check_out ? (
                                                        <div className="flex flex-col gap-1 items-start">
                                                            <span className="font-black text-slate-700">{record.check_out}</span>
                                                            {getStatusBadge(record.status_out)}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 font-medium">-</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-10 text-center flex flex-col items-center justify-center gap-3">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                                            <XCircle className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <p className="text-slate-500 font-medium text-sm">Tidak ada data kehadiran pada tanggal ini.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
