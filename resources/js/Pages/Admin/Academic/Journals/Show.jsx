import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { BookOpen, ArrowLeft, Clock, Calendar, Users, ClipboardList, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function Show({ auth, journal, attendance, students }) {
    const [isEditing, setIsEditing] = useState(false);

    // Parse attendance records if exists
    const attendanceRecords = attendance?.records || [];
    
    // Create a map for quick lookup
    const studentStatusMap = {};
    attendanceRecords.forEach(record => {
        studentStatusMap[record.student_id] = record.status;
    });

    const { data, setData, post, processing } = useForm({
        date: journal.date,
        schedule_id: journal.schedule_id,
        records: students.map(student => ({
            student_id: student.id,
            status: studentStatusMap[student.id] || 'Hadir',
            notes: ''
        }))
    });

    const handleStatusChange = (studentId, status) => {
        const newRecords = [...data.records];
        const recordIndex = newRecords.findIndex(r => r.student_id === studentId);
        if (recordIndex !== -1) {
            newRecords[recordIndex].status = status;
        } else {
            newRecords.push({ student_id: studentId, status, notes: '' });
        }
        setData('records', newRecords);
    };

    const submitAttendance = (e) => {
        e.preventDefault();
        post(route('admin.academic.attendances.store'), {
            onSuccess: () => setIsEditing(false),
            preserveScroll: true
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Hadir':
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100"><CheckCircle2 className="w-3.5 h-3.5" /> Hadir</span>;
            case 'Sakit':
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100"><AlertCircle className="w-3.5 h-3.5" /> Sakit</span>;
            case 'Izin':
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100"><ClipboardList className="w-3.5 h-3.5" /> Izin</span>;
            case 'Alpa':
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-100"><XCircle className="w-3.5 h-3.5" /> Alpa</span>;
            default:
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200">-</span>;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Link href={route('admin.academic.journals.index')} className="p-2.5 bg-white shadow-sm hover:bg-brand-50 rounded-xl transition-colors border border-slate-100">
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <div className="p-3 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl shadow-neon-violet">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="font-black text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-brand-600 tracking-tight">
                            Detail Jurnal Mengajar
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title={`Detail Jurnal - ${journal.topic}`} />
            <div className="py-6 md:py-12 relative z-10">
                {/* Ambient Background Blobs */}
                <div className="absolute top-0 -left-40 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob pointer-events-none"></div>
                <div className="absolute top-0 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>
                <div className="absolute -bottom-40 left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-0 sm:px-4 md:px-6 lg:px-8 space-y-6 relative z-10">
                    {/* Detail Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Info Jurnal */}
                        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-brand-500" />
                                Informasi Jurnal
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-slate-50/50 p-4 rounded-[1.5rem] border border-slate-100">
                                    <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-2"><Calendar className="w-4 h-4 text-brand-500" /> Tanggal</p>
                                    <p className="text-base font-bold text-slate-800">{journal.date}</p>
                                </div>
                                <div className="bg-slate-50/50 p-4 rounded-[1.5rem] border border-slate-100">
                                    <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-2"><Clock className="w-4 h-4 text-brand-500" /> Waktu / Pertemuan</p>
                                    <p className="text-base font-bold text-slate-800">{journal.time_context} <span className="text-brand-600">(Pertemuan {journal.session_number})</span></p>
                                </div>
                                <div className="bg-slate-50/50 p-4 rounded-[1.5rem] border border-slate-100">
                                    <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-2"><BookOpen className="w-4 h-4 text-brand-500" /> Mata Pelajaran</p>
                                    <p className="text-base font-bold text-slate-800">{journal.subject?.name || '-'}</p>
                                </div>
                                <div className="bg-slate-50/50 p-4 rounded-[1.5rem] border border-slate-100">
                                    <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-2"><Users className="w-4 h-4 text-brand-500" /> Kelas</p>
                                    <p className="text-base font-bold text-slate-800">{journal.school_class?.name || '-'}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-sm font-medium text-slate-500 mb-2 ml-1">Topik Pembahasan</p>
                                    <div className="text-base font-bold text-slate-800 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">{journal.topic}</div>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-sm font-medium text-slate-500 mb-2 ml-1">Materi / Catatan</p>
                                    <div className="text-sm text-slate-700 bg-brand-50/30 p-5 rounded-2xl border border-brand-100/50 whitespace-pre-wrap leading-relaxed shadow-sm">
                                        {journal.notes || <span className="italic text-slate-400">Tidak ada catatan materi.</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Statistik Absensi */}
                        <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col">
                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <ClipboardList className="w-5 h-5 text-brand-500" />
                                Rekap Kehadiran
                            </h3>
                            {attendance ? (
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center justify-between p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                                        <div className="flex items-center gap-3 text-emerald-700 font-medium">
                                            <div className="p-2 bg-emerald-100 rounded-xl"><CheckCircle2 className="w-5 h-5" /></div> Hadir
                                        </div>
                                        <span className="text-xl font-black text-emerald-700">
                                            {attendanceRecords.filter(r => r.status === 'Hadir').length}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100">
                                        <div className="flex items-center gap-3 text-blue-700 font-medium">
                                            <div className="p-2 bg-blue-100 rounded-xl"><AlertCircle className="w-5 h-5" /></div> Sakit
                                        </div>
                                        <span className="text-xl font-black text-blue-700">
                                            {attendanceRecords.filter(r => r.status === 'Sakit').length}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3.5 bg-amber-50/50 rounded-2xl border border-amber-100">
                                        <div className="flex items-center gap-3 text-amber-700 font-medium">
                                            <div className="p-2 bg-amber-100 rounded-xl"><ClipboardList className="w-5 h-5" /></div> Izin
                                        </div>
                                        <span className="text-xl font-black text-amber-700">
                                            {attendanceRecords.filter(r => r.status === 'Izin').length}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3.5 bg-rose-50/50 rounded-2xl border border-rose-100">
                                        <div className="flex items-center gap-3 text-rose-700 font-medium">
                                            <div className="p-2 bg-rose-100 rounded-xl"><XCircle className="w-5 h-5" /></div> Alpa
                                        </div>
                                        <span className="text-xl font-black text-rose-700">
                                            {attendanceRecords.filter(r => r.status === 'Alpa').length}
                                        </span>
                                    </div>
                                    
                                    <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between px-2">
                                        <span className="font-bold text-slate-500 uppercase tracking-wider text-sm">Total Siswa</span>
                                        <span className="font-black text-3xl text-slate-800">{students.length}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 flex-1 flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                                        <ClipboardList className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <p className="text-slate-500 font-medium">Belum ada rekaman absensi untuk pertemuan ini.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tabel Absensi */}
                    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Users className="w-5 h-5 text-brand-500" />
                                Daftar Absensi Siswa
                            </h3>
                            {!isEditing ? (
                                <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-100 transition-colors text-sm border border-indigo-100">
                                    {attendance ? 'Edit Absensi' : 'Isi Absensi'}
                                </button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl font-semibold hover:bg-slate-100 transition-colors text-sm border border-slate-200">
                                        Batal
                                    </button>
                                    <button onClick={submitAttendance} disabled={processing} className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-sm border border-indigo-700">
                                        {processing ? 'Menyimpan...' : 'Simpan Absensi'}
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        <div className="overflow-x-auto rounded-2xl border border-slate-100">
                            <table className="hidden md:table w-full text-sm text-left text-slate-600">
                                <thead className="text-xs font-semibold text-slate-500 bg-slate-50/80 uppercase tracking-wider border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 w-16 text-center">No</th>
                                        <th className="px-6 py-4">NISN</th>
                                        <th className="px-6 py-4">Nama Lengkap</th>
                                        <th className="px-6 py-4 text-center">Status Kehadiran</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student, index) => (
                                        <tr key={student.id} className="hidden md:table-row border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-6 py-4 text-center font-bold text-slate-400 group-hover:text-brand-500 transition-colors">{index + 1}</td>
                                            <td className="px-6 py-4 font-mono text-slate-500">{student.nisn}</td>
                                            <td className="px-6 py-4 font-bold text-slate-800">{student.nama_lengkap}</td>
                                            <td className="px-6 py-4 text-center">
                                                {isEditing ? (
                                                    <select 
                                                        className="border-slate-200 rounded-xl text-sm focus:ring-brand-500 focus:border-brand-500 w-full"
                                                        value={data.records.find(r => r.student_id === student.id)?.status || 'Hadir'}
                                                        onChange={(e) => handleStatusChange(student.id, e.target.value)}
                                                    >
                                                        <option value="Hadir">Hadir</option>
                                                        <option value="Sakit">Sakit</option>
                                                        <option value="Izin">Izin</option>
                                                        <option value="Alpa">Alpa</option>
                                                    </select>
                                                ) : (
                                                    getStatusBadge(studentStatusMap[student.id])
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {students.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <Users className="w-10 h-10 text-slate-300 mb-3" />
                                                    <p>Tidak ada data siswa di kelas ini.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Mobile View Absensi */}
                            <div className="md:hidden space-y-3">
                                {students.map((student, index) => (
                                    <div key={student.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm gap-3">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 font-bold flex items-center justify-center shrink-0 text-sm border border-slate-100">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{student.nama_lengkap}</p>
                                                <p className="text-xs font-mono text-slate-500 mt-0.5">{student.nisn}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-end ml-11 sm:ml-0 mt-2 sm:mt-0">
                                            {isEditing ? (
                                                <select 
                                                    className="border-slate-200 rounded-xl text-sm focus:ring-brand-500 focus:border-brand-500 w-full sm:w-auto"
                                                    value={data.records.find(r => r.student_id === student.id)?.status || 'Hadir'}
                                                    onChange={(e) => handleStatusChange(student.id, e.target.value)}
                                                >
                                                    <option value="Hadir">Hadir</option>
                                                    <option value="Sakit">Sakit</option>
                                                    <option value="Izin">Izin</option>
                                                    <option value="Alpa">Alpa</option>
                                                </select>
                                            ) : (
                                                getStatusBadge(studentStatusMap[student.id])
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {students.length === 0 && (
                                    <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl flex flex-col items-center justify-center">
                                        <Users className="w-10 h-10 text-slate-300 mb-3" />
                                        <p>Tidak ada data siswa.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
