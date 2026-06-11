import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Calendar, Clock, Book, User, GraduationCap, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Index({ auth, schedules }) {
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Jadwal Pelajaran" />
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-neon-emerald">
                        <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-emerald-600">
                            Jadwal Pelajaran
                        </h1>
                        <p className="text-slate-500 font-medium">Lihat jadwal pelajaran mingguan kelas Anda.</p>
                    </div>
                </div>

                <div className="space-y-8">
                    {days.map(day => (
                        <div key={day} className="bg-white rounded-3xl shadow-glass border border-slate-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-slate-100 to-white px-6 py-4 border-b border-slate-200">
                                <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-emerald-500"/> Hari {day}
                                </h2>
                            </div>
                            <div className="p-6">
                                {schedules[day] && schedules[day].length > 0 ? (
                                    <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {schedules[day].map(sched => (
                                            <motion.div key={sched.id} variants={itemVariants} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition-colors group">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h3 className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{sched.subject?.name || '-'}</h3>
                                                    <span className="text-xs font-bold px-2 py-1 bg-white text-emerald-600 rounded-full border border-emerald-100 shadow-sm">
                                                        {sched.start_time} - {sched.end_time}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-2 mt-4 text-xs font-medium text-slate-500">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-blue-500"/>
                                                        <span>{sched.teacher?.user?.name || '-'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4 text-rose-500"/>
                                                        <span>Ruang Teori</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <div className="text-center py-8 text-slate-400">
                                        Tidak ada jadwal pelajaran untuk hari ini.
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
