import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function ReportCardShow({ auth, student, semester, reportCard, scores }) {
    const handleGenerate = () => {
        router.post(route('admin.report-cards.generate', [student.id, semester.id]), {}, {
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Raport: {student.nama_lengkap}</h2>}
        >
            <Head title={`Raport ${student.nama_lengkap}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto px-0 sm:px-4 md:px-6 lg:px-8 space-y-6 relative z-10">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob pointer-events-none"></div>
        <div className="absolute top-0 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h3 className="text-lg font-bold">Semester: {semester.name}</h3>
                            <p className="text-sm text-gray-500">Tahun Ajaran: {semester.academic_year}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                            <SecondaryButton className="w-full sm:w-auto justify-center" onClick={handleGenerate}>Generate / Update Data Agregasi</SecondaryButton>
                            {reportCard && (
                                <a href={route('admin.report-cards.print', [student.id, semester.id])} target="_blank" rel="noreferrer" className="w-full sm:w-auto block">
                                    <PrimaryButton className="w-full sm:w-auto justify-center">Cetak PDF</PrimaryButton>
                                </a>
                            )}
                        </div>
                    </div>

                    {!reportCard ? (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        Data raport untuk semester ini belum digenerate. Silakan klik tombol "Generate / Update Data Agregasi" di atas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem] rounded-2xl border border-slate-100 overflow-hidden">
                                <div className="p-6">
                                    <h3 className="font-medium mb-4">Kehadiran</h3>
                                    <ul className="space-y-2">
                                        <li>Sakit: <strong>{reportCard.sick_days}</strong> hari</li>
                                        <li>Izin: <strong>{reportCard.permission_days}</strong> hari</li>
                                        <li>Tanpa Keterangan: <strong>{reportCard.absent_days}</strong> hari</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div className="bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem] rounded-2xl border border-slate-100 overflow-hidden">
                                <div className="p-6">
                                    <h3 className="font-medium mb-4">Catatan Wali Kelas</h3>
                                    <p className="text-sm text-gray-600">{reportCard.notes || 'Belum ada catatan.'}</p>
                                    {/* Bisa ditambahkan form untuk update notes di sini */}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem] rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-lg font-medium mb-4">Rincian Nilai</h3>
                            <div className="overflow-x-auto rounded-2xl border border-slate-100">
                                <table className="hidden md:table min-w-full text-sm text-left text-slate-600">
                                    <thead className="text-xs font-semibold text-slate-500 bg-slate-50/80 uppercase tracking-wider border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4">Mata Pelajaran</th>
                                            <th className="px-6 py-4">Capaian Pembelajaran</th>
                                            <th className="px-6 py-4 text-center">Nilai PTS</th>
                                            <th className="px-6 py-4 text-center">Nilai PAS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {scores.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="text-center py-8 text-sm text-slate-500">Belum ada data nilai yang tersimpan.</td>
                                            </tr>
                                        ) : (
                                            scores.map(score => (
                                                <tr key={score.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-slate-800">{score.subject?.name}</td>
                                                    <td className="px-6 py-4 text-slate-600">{score.learning_objective?.target}</td>
                                                    <td className="px-6 py-4 text-center whitespace-nowrap text-slate-800">{score.pts_score || '-'}</td>
                                                    <td className="px-6 py-4 text-center whitespace-nowrap text-brand-600 font-bold">{score.pas_score || '-'}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>

                                {/* Mobile Cards */}
                                <div className="md:hidden flex flex-col gap-3 p-2 bg-slate-50/30">
                                    {scores.length === 0 ? (
                                        <div className="p-6 text-center text-slate-500 text-sm">Belum ada data nilai yang tersimpan.</div>
                                    ) : (
                                        scores.map(score => (
                                            <div key={score.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="px-2.5 py-1 bg-brand-50 text-brand-700 text-[10px] font-bold rounded-lg border border-brand-100 uppercase tracking-wider">
                                                        {score.subject?.name}
                                                    </span>
                                                </div>
                                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                    <p className="text-[10px] text-slate-500 mb-1 font-semibold uppercase">Capaian Pembelajaran</p>
                                                    <p className="text-sm font-medium text-slate-800">{score.learning_objective?.target}</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3 mt-1">
                                                    <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50 text-center">
                                                        <p className="text-[10px] text-indigo-500 mb-1 font-semibold uppercase">PTS</p>
                                                        <p className="text-lg font-bold text-indigo-700">{score.pts_score || '-'}</p>
                                                    </div>
                                                    <div className="bg-brand-50/50 p-3 rounded-xl border border-brand-100/50 text-center">
                                                        <p className="text-[10px] text-brand-500 mb-1 font-semibold uppercase">PAS</p>
                                                        <p className="text-lg font-bold text-brand-700">{score.pas_score || '-'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
