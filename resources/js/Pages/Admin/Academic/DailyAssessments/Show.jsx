import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { BookOpen, ArrowLeft, Clock, Calendar, Users, Edit3, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Show({ auth, assessment, students }) {
    const records = assessment.records || [];
    
    // Convert array of {student_id, score} to a dictionary
    const initialScores = {};
    students.forEach(student => {
        const record = records.find(r => r.student_id === student.id);
        initialScores[student.id] = record ? record.score : '';
    });

    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        topic: assessment.topic || '',
        records: students.map(s => ({
            student_id: s.id,
            score: initialScores[s.id] || ''
        }))
    });

    const handleScoreChange = (studentId, value) => {
        const newRecords = data.records.map(r => {
            if (r.student_id === studentId) {
                return { ...r, score: value };
            }
            return r;
        });
        setData('records', newRecords);
    };

    const submit = (e) => {
        e.preventDefault();
        // Validation: filter out empty scores if we only want to submit filled ones,
        // but since validation says required, we might need to enforce 0 instead of empty.
        const cleanRecords = data.records.map(r => ({
            student_id: r.student_id,
            score: r.score === '' ? 0 : Number(r.score)
        }));

        put(route('admin.academic.daily-assessments.update', assessment.id), {
            data: { ...data, records: cleanRecords },
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(false);
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Link href={route('admin.academic.daily-assessments.index')} className="p-2.5 bg-white shadow-sm hover:bg-brand-50 rounded-xl transition-colors border border-slate-100">
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <div className="p-3 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl shadow-neon-violet">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="font-black text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-brand-600 tracking-tight">
                            Detail Penilaian Harian
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title={`Detail Penilaian - ${assessment.topic}`} />
            <div className="py-6 md:py-12 relative z-10">
                {/* Ambient Background Blobs */}
                <div className="absolute top-0 -left-40 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob pointer-events-none"></div>
                <div className="absolute top-0 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>
                <div className="absolute -bottom-40 left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000 pointer-events-none"></div>

                <form onSubmit={submit} className="max-w-7xl mx-auto px-0 sm:px-4 md:px-6 lg:px-8 space-y-6 relative z-10">
                    <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-brand-500" />
                                Informasi Penilaian
                            </h3>
                            {!isEditing && (
                                <button type="button" onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">
                                    <Edit3 className="w-4 h-4" /> Edit Nilai
                                </button>
                            )}
                            {isEditing && (
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">
                                        Batal
                                    </button>
                                    <button type="submit" disabled={processing} className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-brand-500/30">
                                        <Save className="w-4 h-4" /> Simpan
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-slate-50/50 p-4 rounded-[1.5rem] border border-slate-100">
                                <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-2"><Calendar className="w-4 h-4 text-brand-500" /> Tanggal</p>
                                <p className="text-base font-bold text-slate-800">{assessment.date}</p>
                            </div>
                            <div className="bg-slate-50/50 p-4 rounded-[1.5rem] border border-slate-100">
                                <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-2"><Clock className="w-4 h-4 text-brand-500" /> Pertemuan</p>
                                <p className="text-base font-bold text-slate-800">Ke-{assessment.session_number}</p>
                            </div>
                            <div className="bg-slate-50/50 p-4 rounded-[1.5rem] border border-slate-100">
                                <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-2"><BookOpen className="w-4 h-4 text-brand-500" /> Mata Pelajaran</p>
                                <p className="text-base font-bold text-slate-800">{assessment.subject?.name || '-'}</p>
                            </div>
                            <div className="bg-slate-50/50 p-4 rounded-[1.5rem] border border-slate-100">
                                <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-2"><Users className="w-4 h-4 text-brand-500" /> Kelas</p>
                                <p className="text-base font-bold text-slate-800">{assessment.school_class?.name || '-'}</p>
                            </div>
                            <div className="sm:col-span-2">
                                <p className="text-sm font-medium text-slate-500 mb-2 ml-1">Topik Penilaian</p>
                                {isEditing ? (
                                    <input 
                                        type="text" 
                                        value={data.topic} 
                                        onChange={e => setData('topic', e.target.value)} 
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                        required
                                    />
                                ) : (
                                    <div className="text-base font-bold text-slate-800 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">{assessment.topic}</div>
                                )}
                                {errors.topic && <p className="text-red-500 text-xs mt-1">{errors.topic}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Tabel Nilai */}
                    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Users className="w-5 h-5 text-brand-500" />
                            Daftar Nilai Siswa
                        </h3>
                        
                        <div className="overflow-x-auto rounded-2xl border border-slate-100">
                            <table className="w-full text-sm text-left text-slate-600">
                                <thead className="text-xs font-semibold text-slate-500 bg-slate-50/80 uppercase tracking-wider border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 w-16 text-center">No</th>
                                        <th className="px-6 py-4 hidden sm:table-cell">NISN</th>
                                        <th className="px-6 py-4">Nama Lengkap</th>
                                        <th className="px-6 py-4 text-center w-32">Nilai</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student, index) => {
                                        const record = data.records.find(r => r.student_id === student.id);
                                        const scoreValue = record ? record.score : '';
                                        
                                        return (
                                            <tr key={student.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                                                <td className="px-6 py-4 text-center font-bold text-slate-400 group-hover:text-brand-500 transition-colors">{index + 1}</td>
                                                <td className="px-6 py-4 font-mono text-slate-500 hidden sm:table-cell">{student.nisn}</td>
                                                <td className="px-6 py-4 font-bold text-slate-800">{student.nama_lengkap}</td>
                                                <td className="px-6 py-4 text-center">
                                                    {isEditing ? (
                                                        <input 
                                                            type="number" 
                                                            min="0" 
                                                            max="100" 
                                                            className="w-20 px-2 py-1.5 text-center bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-bold"
                                                            value={scoreValue}
                                                            onChange={(e) => handleScoreChange(student.id, e.target.value)}
                                                        />
                                                    ) : (
                                                        <span className="inline-block min-w-[3rem] px-3 py-1.5 bg-slate-100 text-slate-700 font-black rounded-lg">
                                                            {scoreValue !== '' ? scoreValue : '-'}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
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
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
