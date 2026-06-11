import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { FileText, Printer, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Index({ auth, reportCards }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="E-Raport" />
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-neon-blue">
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-blue-600">
                            E-Raport
                        </h1>
                        <p className="text-slate-500 font-medium">Lihat dan unduh laporan hasil belajar Anda per semester.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reportCards.data.length > 0 ? (
                        reportCards.data.map((report) => (
                            <motion.div whileHover={{ y: -5 }} key={report.id} className="bg-white rounded-3xl p-6 shadow-glass border border-slate-200">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                                    <FileText className="w-6 h-6 text-blue-500" />
                                </div>
                                <h3 className="text-xl font-black text-slate-800 mb-1">Semester {report.semester?.name || '-'}</h3>
                                <p className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-6">
                                    <Calendar className="w-4 h-4"/>
                                    Tahun Ajaran {report.semester?.academic_year || '-'}
                                </p>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Status</span>
                                        <span className={`font-bold px-2 py-0.5 rounded-md text-xs ${report.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>{report.status === 'published' ? 'Sudah Rilis' : 'Draft'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Kehadiran (S/I/A)</span>
                                        <span className="font-bold text-slate-800">{report.sick_days || 0} / {report.permission_days || 0} / {report.absent_days || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Sikap Spiritual</span>
                                        <span className="font-bold text-slate-800">{report.spiritual_attitude || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Sikap Sosial</span>
                                        <span className="font-bold text-slate-800">{report.social_attitude || '-'}</span>
                                    </div>
                                </div>

                                <a 
                                    href={route('admin.report-cards.print', { studentId: report.student_id, semesterId: report.semester_id })}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors"
                                >
                                    <Printer className="w-4 h-4" /> Unduh PDF
                                </a>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-slate-400">
                            Belum ada E-Raport yang diterbitkan untuk Anda.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
