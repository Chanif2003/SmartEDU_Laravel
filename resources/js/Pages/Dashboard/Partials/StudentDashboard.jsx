import React from 'react';
import { Book, CheckCircle, Clock, GraduationCap, AlertCircle, CreditCard, Users, Sparkles, User, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } }
};

export default function StudentDashboard({ metrics }) {
    const todayDayName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][new Date().getDay()];

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-8 relative z-10"
        >
            {/* Ambient Background Blobs */}
            <div className="absolute top-0 -left-40 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob pointer-events-none"></div>
            <div className="absolute top-0 -right-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>
            <div className="absolute -bottom-40 left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000 pointer-events-none"></div>

            {/* Header Title Section */}
            <motion.div variants={cardVariants} className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl shadow-neon-emerald">
                    <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-emerald-600">
                        Student Portal
                    </h1>
                    <p className="text-slate-500 font-medium">Tetap semangat belajar hari ini!</p>
                </div>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-4">
                <motion.div 
                    variants={cardVariants} 
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 shadow-neon-emerald flex flex-col justify-between relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10 flex items-center justify-between mb-4">
                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md shadow-glass">
                            <UserCheck className="w-6 h-6 text-white"/>
                        </div>
                        <h2 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-emerald-100">Status Kehadiran</h2>
                    </div>
                    <div className="relative z-10 text-right">
                        <p className="text-3xl md:text-4xl font-black text-white capitalize">{metrics.latest_attendance === 'none' ? 'Belum Ada' : metrics.latest_attendance}</p>
                        <p className="text-[10px] uppercase mt-1 text-emerald-100 font-bold">Hari Ini</p>
                    </div>
                </motion.div>

                <motion.div 
                    variants={cardVariants} 
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-gradient-to-br from-rose-500 via-pink-500 to-red-600 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 shadow-neon-violet flex flex-col justify-between relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10 flex items-center justify-between mb-4">
                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md shadow-glass">
                            <AlertCircle className="w-6 h-6 text-white"/>
                        </div>
                        <h2 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-rose-100">Poin Pelanggaran</h2>
                    </div>
                    <div className="relative z-10 text-right">
                        <p className="text-3xl md:text-4xl font-black text-white">{metrics.violation_points}</p>
                        <p className="text-[10px] uppercase mt-1 text-rose-100 font-bold">Akumulasi Poin</p>
                    </div>
                </motion.div>

                <motion.div 
                    variants={cardVariants} 
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 shadow-neon-blue flex flex-col justify-between relative overflow-hidden group md:col-span-2 lg:col-span-1"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10 flex items-center justify-between mb-4">
                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md shadow-glass">
                            <CreditCard className="w-6 h-6 text-white"/>
                        </div>
                        <h2 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-blue-100">Status SPP</h2>
                    </div>
                    <div className="relative z-10 text-right">
                        <p className="text-3xl md:text-4xl font-black text-white uppercase">{metrics.spp_status}</p>
                        <p className="text-[10px] uppercase mt-1 text-blue-100 font-bold">Bulan Ini</p>
                    </div>
                </motion.div>
            </div>

            <motion.div variants={cardVariants} className="relative rounded-[1.5rem] md:rounded-[2rem] p-1 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 shadow-neon-emerald">
                <div className="bg-white rounded-[1.4rem] md:rounded-[1.8rem] p-4 md:p-8 h-full">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                        <h3 className="text-base md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-500 flex items-center gap-2 md:gap-3">
                            <div className="p-1.5 md:p-2.5 bg-emerald-50 rounded-lg md:rounded-xl shadow-inner"><Clock className="w-4 h-4 md:w-6 md:h-6 text-emerald-600"/></div>
                            Jadwal Pelajaran ({todayDayName})
                        </h3>
                    </div>
                    <div className="h-[250px] md:h-[350px] overflow-y-auto pr-2 md:pr-4 space-y-3 md:space-y-4 custom-scrollbar">
                        {metrics.today_schedules && metrics.today_schedules.length > 0 ? (
                            metrics.today_schedules.map((sched, idx) => (
                                <motion.div 
                                    whileHover={{ scale: 1.02, x: 10 }}
                                    key={sched.id} 
                                    className="p-3 md:p-5 rounded-xl md:rounded-2xl border border-emerald-50 bg-gradient-to-r from-white to-emerald-50/30 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300"
                                >
                                    <div className="flex justify-between items-start mb-2 md:mb-4">
                                        <p className="text-sm md:text-base font-extrabold text-slate-800">{sched.subject?.name || '-'}</p>
                                        <span className="text-[9px] md:text-xs font-black px-2 md:px-4 py-1 md:py-1.5 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
                                            {sched.start_time} - {sched.end_time}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] md:text-sm font-bold text-slate-600 flex-wrap gap-2">
                                        <span className="flex items-center gap-1 md:gap-2 bg-white px-2 md:px-3 py-1 md:py-1.5 rounded-md md:rounded-lg border border-slate-200 shadow-sm"><GraduationCap className="w-3 h-3 md:w-4 md:h-4 text-pink-500"/> {sched.school_class?.name || sched.class_name || '-'}</span>
                                        <span className="flex items-center gap-1 md:gap-2 bg-white px-2 md:px-3 py-1 md:py-1.5 rounded-md md:rounded-lg border border-slate-200 shadow-sm"><User className="w-3 h-3 md:w-4 md:h-4 text-blue-500"/> {sched.teacher?.user?.name || '-'}</span>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                <CheckCircle className="w-10 h-10 md:w-16 md:h-16 text-emerald-400 mb-2 md:mb-4 opacity-50" />
                                <p className="text-xs md:text-base font-medium">Tidak ada jadwal pelajaran untuk hari ini.</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
