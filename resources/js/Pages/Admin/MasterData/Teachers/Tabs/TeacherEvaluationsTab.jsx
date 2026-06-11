import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Save, Calendar, MessageSquare, Award, Clock, Star, Trash2, Cpu, CheckCircle } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

export default function TeacherEvaluationsTab({ teacher, evaluations }) {
    const [isFormOpen, setIsFormOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        teacher_id: teacher.id,
        month: dayjs().format('YYYY-MM'),
        score: 85,
        feedback: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.academic.evaluations.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsFormOpen(false);
            }
        });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus evaluasi ini?')) {
            router.delete(route('admin.academic.evaluations.destroy', id), {
                preserveScroll: true
            });
        }
    };

    // Calculate average score
    const avgScore = evaluations.length > 0 
        ? Math.round(evaluations.reduce((acc, curr) => acc + (curr.score || 0), 0) / evaluations.length)
        : 0;

    return (
        <div className="space-y-8">
            {/* Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-brand-500 to-indigo-600 rounded-[2rem] p-6 text-white shadow-lg shadow-brand-500/30 flex items-center justify-between">
                    <div>
                        <p className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-1">Rata-rata Nilai (KPI)</p>
                        <h3 className="text-5xl font-black">{avgScore}</h3>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Award className="w-8 h-8 text-white" />
                    </div>
                </div>

                <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 flex items-center justify-between col-span-1 md:col-span-2">
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg mb-1">Evaluasi Kinerja & KPI</h3>
                        <p className="text-slate-500 text-sm">Kelola penilaian kinerja bulanan dan berikan feedback konstruktif untuk guru.</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsFormOpen(!isFormOpen)}
                            className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
                                isFormOpen 
                                    ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                    : 'bg-brand-50 text-brand-600 hover:bg-brand-100'
                            }`}
                        >
                            <Plus className={`w-5 h-5 transition-transform ${isFormOpen ? 'rotate-45' : ''}`} />
                            {isFormOpen ? 'Batal' : 'Manual'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <AnimatePresence>
                {isFormOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-200 shadow-lg shadow-slate-200/50 relative">
                            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                                Form Evaluasi Baru
                            </h3>
                            
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            Bulan Evaluasi
                                        </label>
                                        <input
                                            type="month"
                                            value={data.month}
                                            onChange={e => setData('month', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-slate-50/50 font-medium"
                                        />
                                        {errors.month && <p className="text-red-500 text-xs mt-1">{errors.month}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                            <Award className="w-4 h-4 text-slate-400" />
                                            Nilai / Skor (0-100)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={data.score}
                                            onChange={e => setData('score', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-slate-50/50 font-bold text-brand-600"
                                        />
                                        {errors.score && <p className="text-red-500 text-xs mt-1">{errors.score}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-slate-400" />
                                        Catatan / Feedback
                                    </label>
                                    <textarea
                                        rows="4"
                                        value={data.feedback}
                                        onChange={e => setData('feedback', e.target.value)}
                                        placeholder="Berikan feedback spesifik dan konstruktif..."
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-slate-50/50 resize-none"
                                    ></textarea>
                                    {errors.feedback && <p className="text-red-500 text-xs mt-1">{errors.feedback}</p>}
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsFormOpen(false)}
                                        className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-8 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 flex items-center gap-2 transition-colors disabled:opacity-50"
                                    >
                                        <Save className="w-5 h-5" />
                                        {processing ? 'Menyimpan...' : 'Simpan Evaluasi'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Timeline Section */}
            <div className="mt-12 relative">
                <div className="absolute top-0 bottom-0 left-8 w-px bg-slate-200 hidden md:block"></div>
                
                {evaluations.length === 0 ? (
                    <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h4 className="text-slate-600 font-bold">Belum Ada Evaluasi</h4>
                        <p className="text-slate-400 text-sm mt-1">Tambahkan evaluasi kinerja pertama untuk guru ini.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {evaluations.map((evalItem, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={evalItem.id} 
                                className="relative flex flex-col md:flex-row gap-4 md:gap-8 group"
                            >
                                {/* Timeline Dot */}
                                <div className="hidden md:flex absolute left-8 -translate-x-1/2 w-4 h-4 rounded-full bg-brand-500 ring-4 ring-white z-10 top-6"></div>
                                
                                {/* Date Column */}
                                <div className="md:w-32 pt-5 shrink-0 pl-4 md:pl-0">
                                    <div className="text-sm font-bold text-slate-800">{dayjs(evalItem.month).format('MMMM YYYY')}</div>
                                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {dayjs(evalItem.created_at).format('DD MMM, HH:mm')}
                                    </div>
                                </div>

                                {/* Content Card */}
                                <div className="flex-1 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group-hover:border-brand-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-50 to-indigo-50 flex items-center justify-center border border-brand-100/50">
                                                <span className="font-black text-brand-600 text-lg">{evalItem.score}</span>
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800">Skor Evaluasi</div>
                                                <div className="text-xs text-slate-500">Oleh: {evalItem.evaluator?.name || 'Administrator'}</div>
                                            </div>
                                        </div>
                                        
                                        <button 
                                            onClick={() => handleDelete(evalItem.id)}
                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            title="Hapus Evaluasi"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {evalItem.metrics && (
                                        <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase font-bold text-slate-400">Kehadiran</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                        <div className="h-full bg-emerald-500" style={{ width: `${evalItem.metrics.attendance_score}%` }}></div>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-700">{evalItem.metrics.attendance_score}%</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase font-bold text-slate-400">Jurnal</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-500" style={{ width: `${evalItem.metrics.journal_score}%` }}></div>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-700">{evalItem.metrics.journal_score}%</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase font-bold text-slate-400">Penilaian</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                        <div className="h-full bg-purple-500" style={{ width: `${evalItem.metrics.assessment_score}%` }}></div>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-700">{evalItem.metrics.assessment_score}%</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase font-bold text-slate-400">Admin</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                        <div className="h-full bg-brand-500" style={{ width: `${evalItem.metrics.administration_score}%` }}></div>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-700">{evalItem.metrics.administration_score}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="bg-slate-50 p-4 rounded-xl text-slate-600 text-sm leading-relaxed border border-slate-100 flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                        <span>{evalItem.feedback}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
