import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { ShieldAlert, AlertTriangle, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Index({ auth, violations, totalPoints }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Catatan Pelanggaran" />
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl shadow-neon-rose">
                        <ShieldAlert className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-rose-600">
                            Catatan Kedisiplinan
                        </h1>
                        <p className="text-slate-500 font-medium">Rekapitulasi pelanggaran dan poin sanksi Anda.</p>
                    </div>
                    <div className="bg-rose-50 px-6 py-3 rounded-2xl border border-rose-100 text-center">
                        <div className="text-xs font-black text-rose-500 uppercase tracking-widest mb-1">Total Poin</div>
                        <div className="text-3xl font-black text-rose-700 leading-none">{totalPoints}</div>
                    </div>
                </div>

                {/* Desktop View: Table */}
                <div className="hidden md:block bg-white rounded-3xl shadow-glass border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-4 text-sm font-black text-slate-600 uppercase tracking-wider w-[150px]">Tanggal</th>
                                    <th className="p-4 text-sm font-black text-slate-600 uppercase tracking-wider">Pelanggaran</th>
                                    <th className="p-4 text-sm font-black text-slate-600 uppercase tracking-wider w-[120px] text-center">Poin</th>
                                    <th className="p-4 text-sm font-black text-slate-600 uppercase tracking-wider">Tindakan/Catatan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {violations.data.length > 0 ? (
                                    violations.data.map((v) => (
                                        <tr key={v.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-2 text-slate-600 font-bold">
                                                    <Calendar className="w-4 h-4"/>
                                                    <span>{v.violation_date}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-1"><AlertTriangle className="w-4 h-4 text-rose-500"/></div>
                                                    <div>
                                                        <p className="font-bold text-slate-800">{v.violation_name}</p>
                                                        <p className="text-sm font-medium text-slate-500 mt-1">{v.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className="inline-flex px-3 py-1 bg-rose-100 text-rose-700 font-black rounded-xl">
                                                    +{v.points}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm font-medium text-slate-600">
                                                {v.action_taken || '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-slate-400">
                                            Wah hebat! Anda tidak memiliki catatan pelanggaran.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile View: Cards */}
                <div className="md:hidden space-y-4">
                    {violations.data.length > 0 ? (
                        violations.data.map((v) => (
                            <div key={v.id} className="bg-white rounded-2xl shadow-glass border border-slate-200 p-5 flex flex-col gap-3">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <div className="flex items-center gap-2 text-slate-600 font-bold">
                                        <Calendar className="w-4 h-4"/>
                                        <span>{v.violation_date}</span>
                                    </div>
                                    <span className="inline-flex px-3 py-1 bg-rose-100 text-rose-700 font-black rounded-xl text-xs">
                                        +{v.points} Poin
                                    </span>
                                </div>
                                <div className="flex items-start gap-3 mt-1">
                                    <div className="mt-0.5"><AlertTriangle className="w-5 h-5 text-rose-500"/></div>
                                    <div>
                                        <p className="font-bold text-slate-800">{v.violation_name}</p>
                                        <p className="text-sm font-medium text-slate-500 mt-1">{v.description}</p>
                                    </div>
                                </div>
                                {v.action_taken && (
                                    <div className="mt-2 bg-slate-50 rounded-xl p-3 border border-slate-100">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Tindakan/Catatan</div>
                                        <div className="text-sm font-medium text-slate-700">{v.action_taken}</div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-2xl shadow-glass border border-slate-200 p-8 text-center text-slate-400">
                            Wah hebat! Anda tidak memiliki catatan pelanggaran.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
