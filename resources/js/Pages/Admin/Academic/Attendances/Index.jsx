import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ClipboardCheck } from 'lucide-react';
import Form from './Form';

export default function Index({ auth, date, classId, classes, attendances, students = [], schedules = [], presenceRecords = [] }) {
    const [selectedDate, setSelectedDate] = useState(date);
    const [selectedClass, setSelectedClass] = useState(classId || '');
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    // The schedules mapped by the selected class on that date (mock logic for demo, usually from backend)
    // We assume the backend would provide schedule data along with attendance
    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        setSelectedSchedule(null);
        router.get(route('admin.academic.attendances.index'), {
            date: newDate,
            class_id: selectedClass
        }, { preserveState: true, preserveScroll: true });
    };

    const handleClassChange = (e) => {
        const newClass = e.target.value;
        setSelectedClass(newClass);
        setSelectedSchedule(null);
        router.get(route('admin.academic.attendances.index'), {
            date: selectedDate,
            class_id: newClass
        }, { preserveState: true, preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl shadow-neon-violet">
                            <ClipboardCheck className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="font-black text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-brand-600 tracking-tight">
                            Absensi Kelas (KBM)
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Absensi Kelas" />

            <div className="py-6 md:py-12 relative z-10">
                {/* Ambient Background Blobs */}
                <div className="absolute top-0 -left-40 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob pointer-events-none"></div>
                <div className="absolute top-0 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>
                <div className="absolute -bottom-40 left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-0 sm:px-4 md:px-6 lg:px-8 relative z-10 space-y-6">
                    
                    {/* Filter Section */}
                    <div className="bg-white/80 backdrop-blur-xl p-4 md:p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col md:flex-row gap-4 md:items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                className="w-full rounded-xl border-slate-200 shadow-sm focus:border-brand-500 focus:ring-brand-500 bg-slate-50/50"
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Kelas</label>
                            <select
                                value={selectedClass}
                                onChange={handleClassChange}
                                className="w-full rounded-xl border-slate-200 shadow-sm focus:border-brand-500 focus:ring-brand-500 bg-slate-50/50"
                            >
                                <option value="">-- Semua Kelas --</option>
                                {classes.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Schedules & Attendance Form */}
                    {selectedSchedule ? (
                        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden p-6">
                            <button
                                type="button"
                                onClick={() => setSelectedSchedule(null)}
                                className="mb-4 text-sm text-indigo-600 hover:text-indigo-900"
                            >
                                &larr; Kembali ke Jadwal
                            </button>
                            <Form
                                schedule={selectedSchedule}
                                students={students.filter(s => s.class_id === selectedSchedule.class_id)}
                                existingRecords={attendances?.find(a => a.schedule_id === selectedSchedule.id)?.records}
                                presenceRecords={presenceRecords}
                                onSuccess={() => {
                                    setSelectedSchedule(null);
                                    router.reload({ preserveScroll: true, preserveState: true });
                                }}
                            />
                        </div>
                    ) : (
                        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-bold mb-4">Jadwal Pelajaran ({selectedDate})</h3>
                                {schedules && schedules.length > 0 ? (
                                    <div className="space-y-4">
                                        {schedules.map(sched => {
                                            const att = attendances?.find(a => a.schedule_id === sched.id);
                                            return (
                                                <div key={sched.id} className="border border-slate-100 p-4 md:p-6 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white/50 hover:bg-slate-50/80 transition-colors shadow-sm">
                                                    <div>
                                                        <h4 className="font-bold text-slate-800 text-lg">{sched.subject?.name} <span className="text-sm font-normal text-slate-500">({sched.school_class?.name})</span></h4>
                                                        <p className="text-sm text-slate-500">Pengajar: {sched.teacher?.user?.name || sched.teacher?.nama_lengkap}</p>
                                                        <p className="text-sm text-slate-500">Sesi/Waktu: {sched.time_slot?.name} ({sched.time_slot?.start_time} - {sched.time_slot?.end_time})</p>
                                                        {att ? (
                                                            <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-semibold">
                                                                Absensi Tersimpan ({att.records ? att.records.length : 0} Siswa)
                                                            </span>
                                                        ) : (
                                                            <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded font-semibold">
                                                                Absensi Belum Diisi
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <button
                                                            onClick={() => setSelectedSchedule(sched)}
                                                            className="w-full md:w-auto bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold py-2.5 px-5 rounded-xl transition-colors shadow-sm"
                                                        >
                                                            {att ? 'Edit Absensi' : 'Isi Absensi'}
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 py-8">
                                        {classId ? 'Tidak ada jadwal pelajaran untuk kelas dan tanggal ini.' : 'Pilih tanggal dan kelas untuk melihat jadwal.'}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
