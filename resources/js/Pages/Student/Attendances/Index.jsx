import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { ListChecks, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Index({ auth, attendances }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Riwayat Absensi" />
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-neon-violet">
                        <ListChecks className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-600">
                            Riwayat Absensi
                        </h1>
                        <p className="text-slate-500 font-medium">Pantau rekam jejak kehadiran harian Anda.</p>
                    </div>
                </div>

                {/* Desktop View: Table */}
                <div className="hidden md:block bg-white rounded-3xl shadow-glass border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-4 text-sm font-black text-slate-600 uppercase tracking-wider">Tanggal</th>
                                    <th className="p-4 text-sm font-black text-slate-600 uppercase tracking-wider">Waktu Masuk</th>
                                    <th className="p-4 text-sm font-black text-slate-600 uppercase tracking-wider">Waktu Pulang</th>
                                    <th className="p-4 text-sm font-black text-slate-600 uppercase tracking-wider">Status Absensi</th>
                                    <th className="p-4 text-sm font-black text-slate-600 uppercase tracking-wider">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendances.data.length > 0 ? (
                                    attendances.data.map((record) => (
                                        <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-slate-400"/>
                                                    <span className="font-bold text-slate-700">{record.date}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 font-medium text-slate-600">{record.check_in_time || '-'}</td>
                                            <td className="p-4 font-medium text-slate-600">{record.check_out_time || '-'}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                                    record.status_in === 'tepat' ? 'bg-emerald-100 text-emerald-700' :
                                                    record.status_in === 'terlambat' ? 'bg-amber-100 text-amber-700' :
                                                    record.status_in === 'sakit' || record.status_in === 'izin' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-rose-100 text-rose-700'
                                                }`}>
                                                    {record.status_in === 'tepat' ? <CheckCircle className="w-3.5 h-3.5"/> :
                                                     record.status_in === 'terlambat' ? <Clock className="w-3.5 h-3.5"/> :
                                                     <XCircle className="w-3.5 h-3.5"/>}
                                                    {record.status_in ? record.status_in.charAt(0).toUpperCase() + record.status_in.slice(1) : 'Alpa'}
                                                </span>
                                            </td>
                                            <td className="p-4 font-medium text-slate-500">{record.notes || '-'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-slate-400">Tidak ada riwayat absensi ditemukan.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile View: Cards */}
                <div className="md:hidden space-y-4">
                    {attendances.data.length > 0 ? (
                        attendances.data.map((record) => (
                            <div key={record.id} className="bg-white rounded-2xl shadow-glass border border-slate-200 p-4 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-slate-400"/>
                                        <span className="font-bold text-slate-700">{record.date}</span>
                                    </div>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                        record.status_in === 'tepat' ? 'bg-emerald-100 text-emerald-700' :
                                        record.status_in === 'terlambat' ? 'bg-amber-100 text-amber-700' :
                                        record.status_in === 'sakit' || record.status_in === 'izin' ? 'bg-blue-100 text-blue-700' :
                                        'bg-rose-100 text-rose-700'
                                    }`}>
                                        {record.status_in === 'tepat' ? <CheckCircle className="w-3.5 h-3.5"/> :
                                         record.status_in === 'terlambat' ? <Clock className="w-3.5 h-3.5"/> :
                                         <XCircle className="w-3.5 h-3.5"/>}
                                        {record.status_in ? record.status_in.charAt(0).toUpperCase() + record.status_in.slice(1) : 'Alpa'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Masuk</div>
                                        <div className="text-sm font-bold text-slate-700">{record.check_in_time || '-'}</div>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Pulang</div>
                                        <div className="text-sm font-bold text-slate-700">{record.check_out_time || '-'}</div>
                                    </div>
                                </div>
                                {record.notes && (
                                    <div className="mt-1 text-sm text-slate-500 font-medium">
                                        <span className="text-slate-400 mr-1">Catatan:</span> {record.notes}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-2xl shadow-glass border border-slate-200 p-8 text-center text-slate-400">
                            Tidak ada riwayat absensi ditemukan.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
