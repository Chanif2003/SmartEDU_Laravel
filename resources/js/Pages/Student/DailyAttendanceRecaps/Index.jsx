import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { BookOpen, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

export default function Index({ auth, student, subjects, subjectId, attendances }) {
    const handleSubjectChange = (newSubjectId) => {
        router.get(
            route('student.daily-attendance-recaps.index'),
            { subject_id: newSubjectId },
            { preserveState: true, replace: true }
        );
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'hadir': return { label: 'Hadir', icon: <CheckCircle2 className="w-5 h-5" />, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
            case 'izin': return { label: 'Izin', icon: <Clock className="w-5 h-5" />, color: 'bg-blue-50 text-blue-700 border-blue-200' };
            case 'sakit': return { label: 'Sakit', icon: <AlertCircle className="w-5 h-5" />, color: 'bg-amber-50 text-amber-700 border-amber-200' };
            case 'alpa': return { label: 'Alpa', icon: <XCircle className="w-5 h-5" />, color: 'bg-rose-50 text-rose-700 border-rose-200' };
            default: return { label: 'Belum Diisi', icon: <span className="w-5 h-5 text-slate-300">-</span>, color: 'bg-slate-50 text-slate-500 border-slate-100' };
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl shadow-neon-brand">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="font-black text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-brand-600 tracking-tight">
                            Rekap Absensi Keseluruhan
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Rekap Absensi Keseluruhan" />

            <div className="py-6 md:py-12 relative z-10">
                <div className="absolute top-0 -left-40 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob pointer-events-none"></div>
                <div className="absolute top-0 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
                    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold text-slate-500">Kelas Anda</p>
                            <h3 className="text-xl font-black text-slate-800">{student.class_name}</h3>
                        </div>
                        <div className="w-full md:w-64">
                            <label className="block text-sm font-semibold text-slate-700 mb-2 md:sr-only">Pilih Mata Pelajaran</label>
                            <select
                                value={subjectId || ''}
                                onChange={(e) => handleSubjectChange(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all outline-none font-medium text-slate-700"
                            >
                                <option value="" disabled>-- Pilih Mata Pelajaran --</option>
                                {subjects.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl p-4 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                        {subjectId && attendances.length > 0 ? (
                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-4 mb-6 text-xs font-medium text-slate-500 justify-center sm:justify-start">
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Hadir</span>
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-100"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Izin</span>
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-lg border border-amber-100"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Sakit</span>
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 rounded-lg border border-rose-100"><span className="w-2 h-2 rounded-full bg-rose-500"></span>Alpa</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {attendances.map((att, index) => {
                                        const info = getStatusInfo(att.status);
                                        return (
                                            <div key={att.id} className={`p-4 rounded-2xl border ${info.color} flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden group`}>
                                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                                    {info.icon}
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">
                                                    Pertemuan {index + 1}
                                                </span>
                                                <span className="text-sm font-bold mb-3">{att.date}</span>
                                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/60 backdrop-blur-sm shadow-sm text-sm font-bold">
                                                    {info.icon}
                                                    {info.label}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-white shadow-sm">
                                    <BookOpen className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-700 mb-2">
                                    {!subjectId ? 'Pilih Mata Pelajaran' : 'Belum Ada Riwayat Kehadiran'}
                                </h3>
                                <p className="text-slate-500 max-w-sm mx-auto">
                                    {!subjectId 
                                        ? 'Pilih mata pelajaran dari dropdown di atas untuk melihat rekap kehadiran dari awal semester.' 
                                        : 'Belum ada data kehadiran yang dicatat oleh guru untuk mata pelajaran ini.'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
