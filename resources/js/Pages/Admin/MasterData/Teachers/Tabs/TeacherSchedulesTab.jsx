import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, BookOpen, MapPin, Inbox } from 'lucide-react';

export default function TeacherSchedulesTab({ schedules }) {
    // Group schedules by day
    const groupedSchedules = useMemo(() => {
        const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
        const grouped = {};
        
        days.forEach(day => {
            grouped[day] = [];
        });

        if (schedules && schedules.length > 0) {
            schedules.forEach(schedule => {
                if (grouped[schedule.day]) {
                    grouped[schedule.day].push(schedule);
                }
            });
            
            // Sort by time_slot start_time
            days.forEach(day => {
                grouped[day].sort((a, b) => {
                    const timeA = a.time_slot?.start_time || '00:00';
                    const timeB = b.time_slot?.start_time || '00:00';
                    return timeA.localeCompare(timeB);
                });
            });
        }
        
        return grouped;
    }, [schedules]);

    const activeDays = Object.keys(groupedSchedules).filter(day => groupedSchedules[day].length > 0);

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        const parts = timeStr.split(':');
        return `${parts[0]}:${parts[1]}`;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Jadwal Mengajar</h3>
                    <p className="text-slate-500 text-sm">Daftar jadwal pelajaran yang diampu oleh guru ini.</p>
                </div>
            </div>

            {!schedules || schedules.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h4 className="text-slate-600 font-bold">Belum Ada Jadwal</h4>
                    <p className="text-slate-400 text-sm mt-1">Guru ini belum memiliki jadwal mengajar yang terdaftar.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeDays.map((day, dayIndex) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: dayIndex * 0.1 }}
                            key={day} 
                            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
                        >
                            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
                                <h4 className="font-black text-slate-800 uppercase tracking-wide">{day}</h4>
                                <span className="bg-brand-100 text-brand-700 text-xs font-bold px-2 py-1 rounded-lg">
                                    {groupedSchedules[day].length} Kelas
                                </span>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {groupedSchedules[day].map((schedule, idx) => (
                                    <div key={idx} className="p-4 hover:bg-slate-50 transition-colors group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="font-bold text-slate-800 flex items-center gap-2">
                                                <BookOpen className="w-4 h-4 text-brand-500" />
                                                {schedule.subject?.name || '-'}
                                            </div>
                                            <div className="text-xs font-semibold text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
                                                <Clock className="w-3 h-3" />
                                                {formatTime(schedule.time_slot?.start_time)} - {formatTime(schedule.time_slot?.end_time)}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-slate-600 mt-3">
                                            <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md font-medium text-xs">
                                                <MapPin className="w-3 h-3" />
                                                Kelas {schedule.school_class?.name || '-'}
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                Semester: {schedule.semester?.name || '-'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
