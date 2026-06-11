import React from 'react';
import { Book, Users, GraduationCap, Calendar as CalendarIcon, User, TrendingUp, Sparkles, Activity } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, Legend, LineChart, Line 
} from 'recharts';
import { motion } from 'framer-motion';

const ATTENDANCE_COLORS = { 'Hadir': '#10b981', 'Sakit': '#f59e0b', 'Izin': '#3b82f6', 'Alpa': '#ef4444' };

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 20 } 
  }
};

export default function AdminDashboard({ metrics }) {
    const todayDayName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][new Date().getDay()];

    const todayAttendanceData = [
        { name: 'Hadir', value: metrics.attendance_percentage },
        { name: 'Sakit', value: 2 },
        { name: 'Izin', value: 1 },
        { name: 'Alpa', value: Math.max(0, 100 - metrics.attendance_percentage - 3) }
    ].filter(s => s.value > 0);

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-8 relative z-10"
        >
            {/* Ambient Background Blobs */}
            <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob pointer-events-none"></div>
            <div className="absolute top-0 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>
            <div className="absolute -bottom-40 left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000 pointer-events-none"></div>

            {/* Header Title Section with Glow */}
            <motion.div variants={cardVariants} className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-gradient-to-r from-brand-500 to-pink-500 rounded-2xl shadow-neon-violet">
                    <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-brand-600">
                        Admin Command Center
                    </h1>
                    <p className="text-slate-500 font-medium">Sistem Monitoring Terpadu EduMapper</p>
                </div>
            </motion.div>

            {/* Top Stat Cards - Native App Style Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 mb-6">
                
                {/* Semester Card - Full Width on Mobile (col-span-2) */}
                <motion.div 
                    variants={cardVariants} 
                    whileHover={{ y: -5, scale: 1.02 }} 
                    className="col-span-2 md:col-span-1 relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 p-5 md:p-8 text-white shadow-neon-violet group"
                >
                    <div className="absolute top-0 right-0 w-24 h-24 md:w-48 md:h-48 bg-white opacity-10 rounded-full blur-xl md:blur-3xl transform group-hover:scale-150 transition-transform duration-700 ease-out"></div>
                    
                    <div className="relative z-10 flex flex-row md:flex-col justify-between items-center md:items-start h-full gap-4 md:gap-6">
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="bg-white/20 p-3 md:p-4 rounded-xl md:rounded-2xl backdrop-blur-md shadow-glass">
                                <CalendarIcon className="w-6 h-6 md:w-8 md:h-8 text-white"/>
                            </div>
                            <span className="inline-flex px-3 md:px-4 py-1 md:py-1.5 bg-white/20 rounded-full text-[10px] md:text-xs font-bold backdrop-blur-sm border border-white/30 uppercase tracking-widest shadow-lg">Saat Ini</span>
                        </div>
                        <div className="text-right md:text-left flex flex-col justify-center">
                            <p className="text-[11px] md:text-sm font-bold uppercase tracking-widest text-pink-100 mb-1 md:mb-2">Tahun Ajaran</p>
                            <p className="text-2xl md:text-5xl font-black tracking-tighter drop-shadow-lg leading-none">{metrics.active_semester}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Subjects Card - Half Width on Mobile (col-span-1) */}
                <motion.div 
                    variants={cardVariants} 
                    whileHover={{ y: -5, scale: 1.02 }} 
                    className="col-span-1 relative overflow-hidden rounded-3xl md:rounded-[2rem] bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-800 p-4 md:p-8 text-white shadow-neon-blue group"
                >
                    <div className="absolute bottom-0 right-0 w-16 h-16 md:w-32 md:h-32 bg-cyan-300 opacity-20 rounded-full blur-lg md:blur-2xl transform group-hover:-translate-y-10 transition-transform duration-700"></div>
                    
                    <div className="relative z-10 flex flex-col justify-between h-full gap-3 md:gap-6">
                        <div className="bg-white/20 p-2.5 md:p-4 rounded-xl md:rounded-2xl backdrop-blur-md shadow-glass w-max">
                            <Book className="w-6 h-6 md:w-8 md:h-8 text-white"/>
                        </div>
                        <div className="text-left flex flex-col justify-end mt-2 md:mt-0">
                            <p className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-blue-100 mb-1 md:mb-2 line-clamp-1">Mapel</p>
                            <p className="text-2xl md:text-5xl font-black tracking-tighter drop-shadow-lg leading-none">{metrics.total_subjects}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Teachers Card - Half Width on Mobile (col-span-1) */}
                <motion.div 
                    variants={cardVariants} 
                    whileHover={{ y: -5, scale: 1.02 }} 
                    className="col-span-1 md:col-span-2 lg:col-span-1 relative overflow-hidden rounded-3xl md:rounded-[2rem] bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-700 p-4 md:p-8 text-white shadow-neon-emerald group"
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-48 md:h-48 bg-white opacity-10 rounded-full blur-xl md:blur-2xl transform group-hover:scale-125 transition-transform duration-700"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row justify-between h-full gap-3 md:gap-6">
                        <div className="flex flex-col justify-between w-full h-full">
                            <div className="bg-white/20 p-2.5 md:p-4 rounded-xl md:rounded-2xl backdrop-blur-md shadow-glass w-max">
                                <Users className="w-6 h-6 md:w-8 md:h-8 text-white"/>
                            </div>
                            <div className="text-left flex flex-col justify-end mt-2 md:mt-0">
                                <p className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-teal-100 mb-1 md:mb-2 line-clamp-1">Guru</p>
                                <p className="text-2xl md:text-5xl font-black tracking-tighter drop-shadow-lg leading-none">{metrics.total_teachers}</p>
                            </div>
                        </div>

                        {/* Pie Chart (Hidden on Mobile squares) */}
                        <div className="hidden md:flex items-end justify-end h-full">
                            <div className="w-24 h-24 drop-shadow-2xl shrink-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={metrics.teacher_gender_data} innerRadius="55%" outerRadius="100%" paddingAngle={5} dataKey="value" stroke="rgba(255,255,255,0.2)" strokeWidth={2}>
                                            {metrics.teacher_gender_data?.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.name === 'Laki-laki' ? '#38bdf8' : '#f472b6'} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip contentStyle={{ fontSize: '11px', borderRadius: '12px', border: 'none', backgroundColor: 'rgba(255,255,255,0.95)', color: '#0f172a', fontWeight: 'bold' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Middle Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
                {/* Jadwal with Gradient Borders */}
                <motion.div variants={cardVariants} className="relative rounded-[1.5rem] md:rounded-[2rem] p-1 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-neon-violet">
                    <div className="bg-white rounded-[1.4rem] md:rounded-[1.8rem] p-4 md:p-8 h-full">
                        <div className="flex items-center justify-between mb-4 md:mb-8">
                            <h3 className="text-base md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500 flex items-center gap-2 md:gap-3">
                                <div className="p-1.5 md:p-2.5 bg-indigo-50 rounded-lg md:rounded-xl shadow-inner"><Book className="w-4 h-4 md:w-6 md:h-6 text-indigo-600"/></div>
                                Jadwal ({todayDayName})
                            </h3>
                        </div>
                        <div className="h-[200px] md:h-[320px] overflow-y-auto pr-2 md:pr-4 space-y-3 md:space-y-4 custom-scrollbar">
                            {!metrics.todays_schedules || metrics.todays_schedules.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                    <CalendarIcon className="w-10 h-10 md:w-16 md:h-16 mb-2 md:mb-4 opacity-20"/>
                                    <p className="text-xs md:text-base font-bold">Tidak ada jadwal hari ini</p>
                                </div>
                            ) : (
                                metrics.todays_schedules.map((sched, idx) => (
                                    <motion.div 
                                        whileHover={{ scale: 1.02, x: 10 }}
                                        key={sched.id} 
                                        className="p-3 md:p-5 rounded-xl md:rounded-2xl border border-indigo-50 bg-gradient-to-r from-white to-indigo-50/30 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300"
                                    >
                                        <div className="flex justify-between items-start mb-2 md:mb-4">
                                            <p className="text-xs md:text-base font-extrabold text-slate-800">{sched.subjectName}</p>
                                            <span className="text-[9px] md:text-xs font-black px-2 md:px-4 py-1 md:py-1.5 bg-indigo-100 text-indigo-700 rounded-full border border-indigo-200">{sched.startTime} - {sched.endTime}</span>
                                        </div>
                                        <div className="flex gap-2 md:gap-4 text-[10px] md:text-sm font-bold text-slate-600 flex-wrap">
                                            <span className="flex items-center gap-1 md:gap-2 bg-white px-2 md:px-3 py-1 md:py-1.5 rounded-md md:rounded-lg border border-slate-200 shadow-sm"><GraduationCap className="w-3 h-3 md:w-4 md:h-4 text-pink-500"/> {sched.className}</span>
                                            <span className="flex items-center gap-1 md:gap-2 bg-white px-2 md:px-3 py-1 md:py-1.5 rounded-md md:rounded-lg border border-slate-200 shadow-sm"><User className="w-3 h-3 md:w-4 md:h-4 text-blue-500"/> {sched.teacherName}</span>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Kehadiran Guru with intense colors */}
                <motion.div variants={cardVariants} className="relative rounded-[1.5rem] md:rounded-[2rem] p-1 bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-neon-emerald">
                    <div className="bg-white rounded-[1.4rem] md:rounded-[1.8rem] p-4 md:p-8 h-full">
                        <div className="flex items-center justify-between mb-4 md:mb-8">
                            <h3 className="text-base md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 flex items-center gap-2 md:gap-3">
                                <div className="p-1.5 md:p-2.5 bg-emerald-50 rounded-lg md:rounded-xl shadow-inner"><Users className="w-4 h-4 md:w-6 md:h-6 text-emerald-600"/></div>
                                Kehadiran Guru
                            </h3>
                        </div>
                        <div className="h-[200px] md:h-[320px] overflow-y-auto pr-2 md:pr-4 custom-scrollbar flex flex-col gap-3 md:gap-6">
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-emerald-100 shadow-sm">
                                <h4 className="text-[11px] md:text-sm font-black text-emerald-800 mb-2 md:mb-4 flex items-center gap-2 md:gap-3">
                                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                                    HADIR ({metrics.teacher_presence_today?.presentTeachers?.length || 0})
                                </h4>
                                <div className="flex flex-wrap gap-1.5 md:gap-2.5">
                                    {!metrics.teacher_presence_today?.presentTeachers || metrics.teacher_presence_today.presentTeachers.length === 0 ? (
                                        <p className="text-[10px] md:text-sm text-emerald-600/60 font-bold">Menunggu data hadir...</p>
                                    ) : (
                                        metrics.teacher_presence_today.presentTeachers.map(t => (
                                            <motion.span whileHover={{ scale: 1.1 }} key={t.id} className="text-[9px] md:text-xs font-bold text-emerald-700 bg-white px-2 md:px-3 py-1 md:py-1.5 rounded-md md:rounded-xl border border-emerald-200 shadow-sm cursor-default">
                                                {t.nama_lengkap || t.name || '-'}
                                            </motion.span>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-rose-100 shadow-sm">
                                <h4 className="text-[11px] md:text-sm font-black text-rose-800 mb-2 md:mb-4 flex items-center gap-2 md:gap-3">
                                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]"></div>
                                    ABSEN ({metrics.teacher_presence_today?.absentTeachers?.length || 0})
                                </h4>
                                <div className="flex flex-wrap gap-1.5 md:gap-2.5">
                                    {!metrics.teacher_presence_today?.absentTeachers || metrics.teacher_presence_today.absentTeachers.length === 0 ? (
                                        <p className="text-[10px] md:text-sm text-rose-600/60 font-bold">Semua guru hadir</p>
                                    ) : (
                                        metrics.teacher_presence_today.absentTeachers.map(t => (
                                            <motion.span whileHover={{ scale: 1.1 }} key={t.id} className="text-[9px] md:text-xs font-bold text-rose-700 bg-white px-2 md:px-3 py-1 md:py-1.5 rounded-md md:rounded-xl border border-rose-200 shadow-sm cursor-default">
                                                {t.nama_lengkap || t.name || '-'}
                                            </motion.span>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
                <motion.div variants={cardVariants} className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    <h3 className="text-base md:text-xl font-black text-slate-800 mb-4 md:mb-8 flex items-center gap-2 md:gap-3">
                        <div className="p-1.5 md:p-2.5 bg-blue-50 text-blue-600 rounded-lg md:rounded-xl"><TrendingUp className="w-4 h-4 md:w-6 md:h-6"/></div>
                        Jumlah Siswa Kelas
                    </h3>
                    <div className="h-[200px] md:h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics.students_per_class_data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 800 }} dy={5} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 800 }} />
                                <RechartsTooltip cursor={{ fill: 'rgba(248, 250, 252, 0.5)' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', fontSize: '10px', fontWeight: '900', padding: '8px 12px' }} />
                                <Legend wrapperStyle={{ fontSize: '9px', fontWeight: '800', paddingTop: '10px' }} iconType="circle" iconSize={8} />
                                <Bar dataKey="laki_laki" name="Laki-laki" stackId="a" fill="#3b82f6" maxBarSize={30} />
                                <Bar dataKey="perempuan" name="Perempuan" stackId="a" fill="#ec4899" radius={[4, 4, 0, 0]} maxBarSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div variants={cardVariants} className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    <h3 className="text-base md:text-xl font-black text-slate-800 mb-4 md:mb-8 flex items-center gap-2 md:gap-3">
                        <div className="p-1.5 md:p-2.5 bg-emerald-50 text-emerald-600 rounded-lg md:rounded-xl"><Activity className="w-4 h-4 md:w-6 md:h-6"/></div>
                        Tren Absensi Mingguan
                    </h3>
                    <div className="h-[200px] md:h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics.weekly_attendance_data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 800 }} dy={5} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 800 }} />
                                <RechartsTooltip cursor={{ fill: 'rgba(248, 250, 252, 0.5)' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', fontSize: '10px', fontWeight: '900', padding: '8px 12px' }} />
                                <Legend wrapperStyle={{ fontSize: '9px', fontWeight: '800', paddingTop: '10px' }} iconType="circle" iconSize={8} />
                                <Bar dataKey="Hadir" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="Belum Hadir" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Additional Charts for Majors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mt-4 md:mt-8">
                <motion.div variants={cardVariants} className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    <h3 className="text-base md:text-xl font-black text-slate-800 mb-4 md:mb-8 flex items-center gap-2 md:gap-3">
                        <div className="p-1.5 md:p-2.5 bg-purple-50 text-purple-600 rounded-lg md:rounded-xl"><Book className="w-4 h-4 md:w-6 md:h-6"/></div>
                        Distribusi Siswa per Jurusan
                    </h3>
                    <div className="h-[200px] md:h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={metrics.major_distribution_data || []} 
                                    cx="50%" 
                                    cy="50%" 
                                    innerRadius="50%" 
                                    outerRadius="80%" 
                                    paddingAngle={5} 
                                    dataKey="value"
                                >
                                    {(metrics.major_distribution_data || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'][index % 5]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', fontSize: '10px', fontWeight: '900', padding: '8px 12px' }} />
                                <Legend wrapperStyle={{ fontSize: '9px', fontWeight: '800', paddingTop: '10px' }} iconType="circle" iconSize={8} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div variants={cardVariants} className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    <h3 className="text-base md:text-xl font-black text-slate-800 mb-4 md:mb-8 flex items-center gap-2 md:gap-3">
                        <div className="p-1.5 md:p-2.5 bg-pink-50 text-pink-600 rounded-lg md:rounded-xl"><TrendingUp className="w-4 h-4 md:w-6 md:h-6"/></div>
                        Perkembangan Siswa per Jurusan
                    </h3>
                    <div className="h-[200px] md:h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={metrics.major_growth_data || []} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 800 }} dy={5} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 800 }} />
                                <RechartsTooltip cursor={{ stroke: 'rgba(248, 250, 252, 0.5)', strokeWidth: 2 }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', fontSize: '10px', fontWeight: '900', padding: '8px 12px' }} />
                                <Legend wrapperStyle={{ fontSize: '9px', fontWeight: '800', paddingTop: '10px' }} iconType="circle" iconSize={8} />
                                {metrics.major_distribution_data?.map((m, idx) => (
                                    <Line 
                                        key={m.name} 
                                        type="monotone" 
                                        dataKey={m.name} 
                                        stroke={['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'][idx % 5]} 
                                        strokeWidth={3} 
                                        dot={{ strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
