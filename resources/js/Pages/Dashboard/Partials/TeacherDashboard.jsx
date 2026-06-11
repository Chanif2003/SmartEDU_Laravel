import React from 'react';
import { Book, CheckCircle, Clock, GraduationCap, Users, Sparkles, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } }
};

export default function TeacherDashboard({ metrics }) {
    const todayDayName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][new Date().getDay()];

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-8 relative z-10"
        >
            {/* Ambient Background Blobs */}
            <div className="absolute top-0 -left-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob pointer-events-none"></div>
            <div className="absolute top-0 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>
            <div className="absolute -bottom-40 left-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000 pointer-events-none"></div>

            {/* Header Title Section */}
            <motion.div variants={cardVariants} className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl shadow-neon-blue">
                    <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-600">
                        Teacher Workspace
                    </h1>
                    <p className="text-slate-500 font-medium">Selamat datang, jadikan hari ini inspiratif!</p>
                </div>
            </motion.div>
            {/* Top Stat Cards - Native App Style Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-4">
                
                {/* Rapor Bulanan Card */}
                <motion.div 
                    variants={cardVariants} 
                    whileHover={{ y: -5, scale: 1.02 }} 
                    className="col-span-1 lg:col-span-2 relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-700 p-5 md:p-8 text-white shadow-neon-blue group"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-white opacity-10 rounded-full blur-2xl md:blur-3xl transform group-hover:scale-150 transition-transform duration-700 ease-out"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row justify-between h-full gap-4 md:gap-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-white/20 p-3 md:p-4 rounded-xl md:rounded-2xl backdrop-blur-md shadow-glass shrink-0">
                                <UserCheck className="w-6 h-6 md:w-8 md:h-8 text-white"/>
                            </div>
                            <div>
                                <h3 className="text-[11px] md:text-sm font-bold uppercase tracking-widest text-indigo-100 mb-1 md:mb-2">Rapor Kinerja</h3>
                                <p className="text-sm md:text-lg italic font-medium drop-shadow-md">"Kinerja mengajar Anda sangat baik bulan ini. Pertahankan!"</p>
                                <p className="text-[10px] text-white/70 font-bold uppercase mt-2">— Evaluasi Kepala Sekolah</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Metrics Small Cards */}
                <div className="col-span-1 flex flex-col gap-4 md:gap-8">
                    <motion.div 
                        variants={cardVariants} 
                        whileHover={{ x: -5, scale: 1.02 }}
                        className="flex-1 relative overflow-hidden rounded-[1.2rem] md:rounded-[1.5rem] bg-gradient-to-r from-amber-400 to-orange-500 p-4 shadow-neon-amber group flex items-center justify-between"
                    >
                        <div className="absolute -left-4 -top-4 w-16 h-16 bg-white opacity-20 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                        <div className="relative z-10">
                            <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-amber-100">Jurnal Pending</p>
                            <p className="text-3xl md:text-4xl font-black text-white leading-none mt-1">{metrics.pending_journals}</p>
                        </div>
                        <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md shadow-glass">
                            <Book className="w-6 h-6 text-white"/>
                        </div>
                    </motion.div>

                    <motion.div 
                        variants={cardVariants} 
                        whileHover={{ x: -5, scale: 1.02 }}
                        className="flex-1 relative overflow-hidden rounded-[1.2rem] md:rounded-[1.5rem] bg-gradient-to-r from-emerald-400 to-teal-500 p-4 shadow-neon-emerald group flex items-center justify-between"
                    >
                        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white opacity-20 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                        <div className="relative z-10">
                            <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-emerald-100">Kelas Hari Ini</p>
                            <p className="text-3xl md:text-4xl font-black text-white leading-none mt-1">{metrics.today_schedules?.length || 0}</p>
                        </div>
                        <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md shadow-glass">
                            <Users className="w-6 h-6 text-white"/>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Jadwal Hari Ini Section */}
            <motion.div variants={cardVariants} className="relative rounded-[1.5rem] md:rounded-[2rem] p-1 bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 shadow-neon-blue">
                <div className="bg-white rounded-[1.4rem] md:rounded-[1.8rem] p-4 md:p-8 h-full">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                        <h3 className="text-base md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 flex items-center gap-2 md:gap-3">
                            <div className="p-1.5 md:p-2.5 bg-indigo-50 rounded-lg md:rounded-xl shadow-inner"><Clock className="w-4 h-4 md:w-6 md:h-6 text-indigo-600"/></div>
                            Jadwal Mengajar ({todayDayName})
                        </h3>
                    </div>
                    <div className="h-auto md:h-[350px] overflow-visible md:overflow-y-auto pr-0 md:pr-4 space-y-3 md:space-y-4 custom-scrollbar">
                        {metrics.today_schedules && metrics.today_schedules.length > 0 ? (
                            metrics.today_schedules.map((sched, idx) => (
                                <motion.div 
                                    whileHover={{ scale: 1.02, x: 10 }}
                                    key={sched.id} 
                                    className="p-3 md:p-5 rounded-xl md:rounded-2xl border border-indigo-50 bg-gradient-to-r from-white to-indigo-50/30 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4"
                                >
                                    <div className="flex-1 w-full">
                                        <div className="flex justify-between items-start mb-2 md:mb-4">
                                            <p className="text-sm md:text-base font-extrabold text-slate-800">{sched.subject?.name || '-'}</p>
                                            <span className="text-[9px] md:text-xs font-black px-2 md:px-4 py-1 md:py-1.5 bg-indigo-100 text-indigo-700 rounded-full border border-indigo-200">
                                                {sched.start_time} - {sched.end_time}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-[10px] md:text-sm font-bold text-slate-600 flex-wrap gap-2">
                                            <span className="flex items-center gap-1 md:gap-2 bg-white px-2 md:px-3 py-1 md:py-1.5 rounded-md md:rounded-lg border border-slate-200 shadow-sm"><GraduationCap className="w-3 h-3 md:w-4 md:h-4 text-pink-500"/> {sched.school_class?.name || sched.class_name || '-'}</span>
                                            <span className="flex items-center gap-1 md:gap-2 bg-white px-2 md:px-3 py-1 md:py-1.5 rounded-md md:rounded-lg border border-slate-200 shadow-sm"><Users className="w-3 h-3 md:w-4 md:h-4 text-blue-500"/> Ruang Teori</span>
                                        </div>
                                    </div>
                                    <div className="flex md:flex-col gap-2 shrink-0 w-full md:w-auto mt-2 md:mt-0">
                                        {sched.is_journal_filled ? (
                                            <span className="flex-1 md:flex-none text-center text-[10px] md:text-xs font-bold bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg flex items-center justify-center gap-1">
                                                <CheckCircle className="w-3 h-3 md:w-4 md:h-4" /> Jurnal Terisi
                                            </span>
                                        ) : (
                                            <Link 
                                                href={route('admin.academic.journals.index')} 
                                                className="flex-1 md:flex-none text-center text-[10px] md:text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg transition-colors shadow-sm"
                                            >
                                                Isi Jurnal
                                            </Link>
                                        )}
                                        
                                        {sched.is_attendance_filled ? (
                                            <span className="flex-1 md:flex-none text-center text-[10px] md:text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-2 rounded-lg flex items-center justify-center gap-1">
                                                <CheckCircle className="w-3 h-3 md:w-4 md:h-4" /> Absen Terisi
                                            </span>
                                        ) : (
                                            <Link 
                                                href={route('admin.academic.attendances.index')} 
                                                className="flex-1 md:flex-none text-center text-[10px] md:text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg transition-colors shadow-sm"
                                            >
                                                Isi Absensi
                                            </Link>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                <CheckCircle className="w-10 h-10 md:w-16 md:h-16 text-emerald-400 mb-2 md:mb-4 opacity-50" />
                                <p className="text-xs md:text-base font-medium">Tidak ada jadwal mengajar untuk hari ini. Waktunya bersantai!</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
