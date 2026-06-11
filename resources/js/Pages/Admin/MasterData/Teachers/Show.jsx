import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Calendar, Award } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TeacherEvaluationsTab from './Tabs/TeacherEvaluationsTab';
import TeacherSchedulesTab from './Tabs/TeacherSchedulesTab';

export default function Show({ auth, teacher }) {
    const [activeTab, setActiveTab] = useState('info');

    const tabs = [
        { id: 'info', label: 'Info Umum', icon: User },
        { id: 'jadwal', label: 'Jadwal', icon: Calendar },
        { id: 'evaluasi', label: 'Evaluasi & KPI', icon: Award }
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Detail Guru</h2>}
        >
            <Head title={`Detail Guru - ${teacher.nama_lengkap}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Header Card */}
                    <div className="mb-6">
                        <Link 
                            href={route('admin.master.teachers.index')}
                            className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-600 font-medium transition-colors mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Master Data
                        </Link>
                        
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6">
                            <div className="w-24 h-24 rounded-full bg-brand-50 border-4 border-white shadow-md flex items-center justify-center text-brand-500 shrink-0">
                                <User className="w-12 h-12" />
                            </div>
                            <div className="text-center md:text-left flex-1">
                                <h1 className="text-2xl md:text-3xl font-black text-slate-800">{teacher.nama_lengkap}</h1>
                                <p className="text-slate-500 mt-1">NIP: <span className="font-semibold text-slate-700">{teacher.nip}</span></p>
                                <div className="mt-3">
                                    <span className={`px-4 py-1.5 inline-flex text-xs font-black uppercase tracking-wider rounded-full ${teacher.gender === 'Laki-laki' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                                        {teacher.gender}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex overflow-x-auto custom-scrollbar gap-2 mb-6 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all flex-1 md:flex-none justify-center ${
                                    activeTab === tab.id 
                                        ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' 
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content Area */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="p-6 md:p-8"
                            >
                                {activeTab === 'info' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Informasi Dasar</h3>
                                            <div className="grid grid-cols-3 gap-2 text-sm">
                                                <div className="text-slate-500 font-medium">Nama Lengkap</div>
                                                <div className="col-span-2 font-bold text-slate-800">: {teacher.nama_lengkap}</div>
                                                
                                                <div className="text-slate-500 font-medium">NIP</div>
                                                <div className="col-span-2 font-bold text-slate-800">: {teacher.nip}</div>
                                                
                                                <div className="text-slate-500 font-medium">NUPTK</div>
                                                <div className="col-span-2 font-bold text-slate-800">: {teacher.nuptk || '-'}</div>
                                                
                                                <div className="text-slate-500 font-medium">Jenis Kelamin</div>
                                                <div className="col-span-2 font-bold text-slate-800">: {teacher.gender}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'jadwal' && (
                                    <TeacherSchedulesTab schedules={teacher.schedules || []} />
                                )}

                                {activeTab === 'evaluasi' && (
                                    <TeacherEvaluationsTab teacher={teacher} evaluations={teacher.evaluations || []} />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
