import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { CalendarDays, Search, CheckCircle2, XCircle, Clock, AlertCircle, BookOpen } from 'lucide-react';

export default function Index({ auth, isAdmin, isTeacher, date, classId, subjectId, classes, subjects, dailyData, semesterData }) {
    const handleFilterChange = (key, value) => {
        router.get(
            route('admin.academic.daily-attendance-recaps.index'),
            { date, class_id: classId, subject_id: subjectId, [key]: value },
            { preserveState: true, replace: true }
        );
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'hadir': return 'H';
            case 'izin': return 'I';
            case 'sakit': return 'S';
            case 'alpa': return 'A';
            default: return '-';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'hadir': return 'bg-emerald-50 text-emerald-700 font-bold border-emerald-200';
            case 'izin': return 'bg-blue-50 text-blue-700 font-bold border-blue-200';
            case 'sakit': return 'bg-amber-50 text-amber-700 font-bold border-amber-200';
            case 'alpa': return 'bg-rose-50 text-rose-700 font-bold border-rose-200';
            default: return 'bg-slate-50 text-slate-400 border-slate-100';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-neon-emerald">
                            <CalendarDays className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="font-black text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-emerald-600 tracking-tight">
                            Rekap Absensi Keseluruhan
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Rekap Absensi Keseluruhan" />

            <div className="py-6 md:py-12 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
                    {/* Filters */}
                    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {isAdmin && (
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Tanggal (Khusus Harian)</label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => handleFilterChange('date', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Pilih Kelas</label>
                                <select
                                    value={classId || ''}
                                    onChange={(e) => handleFilterChange('class_id', e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                                >
                                    <option value="" disabled>-- Pilih Kelas --</option>
                                    {classes.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Pilih Mata Pelajaran</label>
                                <select
                                    value={subjectId || ''}
                                    onChange={(e) => handleFilterChange('subject_id', e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                                    disabled={!classId}
                                >
                                    <option value="" disabled>-- Pilih Mapel --</option>
                                    {subjects.map((s) => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {classId ? (
                        <>
                            {/* DAILY RECAP CARD (ADMIN ONLY) */}
                            {isAdmin && (
                                <div className="bg-white/80 backdrop-blur-xl p-4 md:p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
                                        <h3 className="text-lg font-bold text-slate-800">Matriks Kehadiran Harian ({date})</h3>
                                    </div>
                                    
                                    {dailyData.schedules.length > 0 ? (
                                        <div className="w-full overflow-x-auto rounded-2xl border border-slate-100">
                                            <table className="w-full text-sm text-left text-slate-600">
                                                <thead className="text-xs font-semibold text-slate-500 bg-slate-50/80 uppercase tracking-wider border-b border-slate-100">
                                                    <tr>
                                                        <th className="px-4 py-3 md:px-6 md:py-4 border-r border-slate-100 whitespace-nowrap sticky left-0 bg-slate-50/90 backdrop-blur z-10 min-w-[120px] max-w-[150px] md:max-w-none md:w-64">Nama Siswa</th>
                                                        {dailyData.schedules.map((schedule) => (
                                                            <th key={schedule.id} className="px-4 py-4 text-center min-w-[120px] border-r border-slate-100">
                                                                <div className="flex flex-col items-center gap-1">
                                                                    <span className="font-bold text-slate-800 line-clamp-1">{schedule.subject?.name}</span>
                                                                    <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full text-slate-600">{schedule.time_slot?.name}</span>
                                                                </div>
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {dailyData.students.map((student) => (
                                                        <tr key={student.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-4 py-3 md:px-6 md:py-4 font-medium text-slate-800 border-r border-slate-100 sticky left-0 bg-white/90 backdrop-blur z-10 whitespace-nowrap shadow-[4px_0_15px_-3px_rgba(0,0,0,0.05)] truncate max-w-[150px] md:max-w-none">
                                                                {student.user?.name}
                                                                <div className="text-[10px] text-slate-400 font-normal mt-0.5 truncate">{student.nisn}</div>
                                                            </td>
                                                            {dailyData.schedules.map((schedule) => {
                                                                const attRecord = dailyData.attendances[schedule.id];
                                                                let status = null;
                                                                if (attRecord && attRecord.records) {
                                                                    const studentRec = attRecord.records.find(r => r.student_id === student.id);
                                                                    if (studentRec) status = studentRec.status;
                                                                }

                                                                return (
                                                                    <td key={schedule.id} className="px-4 py-3 text-center border-r border-slate-50">
                                                                        <div className={`mx-auto w-8 h-8 flex items-center justify-center rounded-xl border ${getStatusColor(status)}`}>
                                                                            {getStatusLabel(status)}
                                                                        </div>
                                                                    </td>
                                                                );
                                                            })}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6">
                                            <p className="text-slate-500">Tidak ada jadwal harian pada tanggal ini.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* SEMESTER RECAP CARD */}
                            {subjectId ? (
                                <div className="bg-white/80 backdrop-blur-xl p-4 md:p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-brand-100 overflow-hidden">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
                                        <h3 className="text-lg font-bold text-brand-800">Matriks Kehadiran Semester Per Mapel</h3>
                                        <div className="flex flex-wrap gap-3 md:gap-4 text-xs font-medium text-slate-500">
                                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>Hadir</span>
                                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>Izin</span>
                                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>Sakit</span>
                                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>Alpa</span>
                                        </div>
                                    </div>
                                    
                                    {semesterData.dates.length > 0 ? (
                                        <div className="w-full overflow-x-auto rounded-2xl border border-slate-100">
                                            <table className="w-full text-sm text-left text-slate-600">
                                                <thead className="text-xs font-semibold text-slate-500 bg-brand-50/50 uppercase tracking-wider border-b border-brand-100">
                                                    <tr>
                                                        <th className="px-4 py-3 md:px-6 md:py-4 border-r border-brand-100 whitespace-nowrap sticky left-0 bg-brand-50 backdrop-blur z-10 min-w-[120px] max-w-[150px] md:max-w-none md:w-64">Nama Siswa</th>
                                                        {semesterData.dates.map((d, index) => (
                                                            <th key={index} className="px-4 py-4 text-center min-w-[100px] border-r border-brand-100">
                                                                <div className="flex flex-col items-center gap-1">
                                                                    <span className="font-bold text-brand-800">P{index + 1}</span>
                                                                    <span className="text-[10px] bg-white border border-brand-200 px-2 py-0.5 rounded-full text-brand-600 whitespace-nowrap">{d}</span>
                                                                </div>
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {semesterData.students.map((student) => (
                                                        <tr key={student.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-4 py-3 md:px-6 md:py-4 font-medium text-slate-800 border-r border-slate-100 sticky left-0 bg-white/90 backdrop-blur z-10 whitespace-nowrap shadow-[4px_0_15px_-3px_rgba(0,0,0,0.05)] truncate max-w-[150px] md:max-w-none">
                                                                {student.user?.name}
                                                                <div className="text-[10px] text-slate-400 font-normal mt-0.5 truncate">{student.nisn}</div>
                                                            </td>
                                                            {semesterData.dates.map((d, index) => {
                                                                const dayAttendances = semesterData.attendances[d];
                                                                let status = null;
                                                                
                                                                if (dayAttendances) {
                                                                    // A class might have multiple sessions of same subject on same day, we just pick the first valid one or combine. Let's pick first.
                                                                    foreach: for (const att of dayAttendances) {
                                                                        if (att.records) {
                                                                            const studentRec = att.records.find(r => r.student_id === student.id);
                                                                            if (studentRec) {
                                                                                status = studentRec.status;
                                                                                break foreach;
                                                                            }
                                                                        }
                                                                    }
                                                                }

                                                                return (
                                                                    <td key={index} className="px-4 py-3 text-center border-r border-slate-50">
                                                                        <div className={`mx-auto w-8 h-8 flex items-center justify-center rounded-xl border ${getStatusColor(status)}`}>
                                                                            {getStatusLabel(status)}
                                                                        </div>
                                                                    </td>
                                                                );
                                                            })}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6">
                                            <p className="text-slate-500">Belum ada riwayat pertemuan/absensi untuk mata pelajaran ini.</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-white/80 backdrop-blur-xl p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-brand-100 text-center">
                                    <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                                        <BookOpen className="w-10 h-10 text-brand-300" />
                                    </div>
                                    <h3 className="text-lg font-bold text-brand-700 mb-1">Pilih Mata Pelajaran</h3>
                                    <p className="text-slate-500">Silakan pilih mata pelajaran untuk melihat rekap kehadiran satu semester.</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-white/80 backdrop-blur-xl p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                                <Search className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 mb-1">Pilih Kelas</h3>
                            <p className="text-slate-500">Silakan pilih kelas terlebih dahulu untuk melihat rekapitulasi absensi.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
