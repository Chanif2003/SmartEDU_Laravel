import React, { useState, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, ChevronDown, ChevronUp, User, BookOpen, ShieldAlert, ChevronLeft, Calendar, Save, FileText, BarChart2, Activity } from 'lucide-react';
import { generateBiodataPDF } from './printHelper';
import { generateFullTranscriptPDF } from './printHelper';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const AccordionItem = ({ title, icon: Icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-slate-200 rounded-2xl mb-4 overflow-hidden bg-white shadow-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-brand-600">
                        <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-800 text-lg">{title}</span>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 border-t border-slate-100">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function Show({ auth, student }) {
    const handlePrint = () => {
        generateBiodataPDF(student);
    };

    const { data, setData, put, processing, recentlySuccessful } = useForm({
        registration_type: student.registration_type || 'baru',
        origin_school: student.origin_school || '',
        entry_date: student.entry_date || '',
        exit_date: student.exit_date || '',
        exit_reason: student.exit_reason || '',
        notes_buku_induk: student.notes_buku_induk || '',
    });

    const submitMetadata = (e) => {
        e.preventDefault();
        put(route('admin.buku-induk.update', student.id), { preserveScroll: true });
    };

    const handlePrintTranscript = () => {
        // Group scores by semester manually to format like Next.js academicRecords
        const report_cards = [];
        const semestersMap = new Map();
        (student.report_card_scores || []).forEach(score => {
            if (!score.semester) return;
            const semName = score.semester.name;
            if (!semestersMap.has(semName)) {
                semestersMap.set(semName, { semester: score.semester, scores: [] });
            }
            semestersMap.get(semName).scores.push(score);
        });
        student.report_cards = Array.from(semestersMap.values());
        
        generateFullTranscriptPDF(student);
    };

    // Calculate Academic Progress Chart Data
    const semestersMap = new Map();
    (student.report_card_scores || []).forEach(score => {
        if (!score.semester) return;
        const semName = score.semester.name;
        if (!semestersMap.has(semName)) {
            semestersMap.set(semName, { 
                name: semName, 
                total: 0, 
                count: 0, 
                id: score.semester.id 
            });
        }
        semestersMap.get(semName).total += parseFloat(score.pas_score || 0);
        semestersMap.get(semName).count += 1;
    });

    const chartData = Array.from(semestersMap.values())
        .sort((a, b) => a.name.localeCompare(b.name)) // Simple sort
        .map(s => ({
            name: s.name,
            RataRata: s.count > 0 ? (s.total / s.count).toFixed(2) : 0
        }));

    // Calculate Attendance Recap
    const attendanceStats = { Hadir: 0, Sakit: 0, Izin: 0, Alfa: 0 };
    (student.student_attendances || []).forEach(att => {
        const record = (att.records || []).find(r => r.student_id === student.id);
        if (record && record.status) {
            attendanceStats[record.status] = (attendanceStats[record.status] || 0) + 1;
        }
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('admin.buku-induk.index')} className="p-2 bg-white rounded-xl shadow-sm text-slate-500 hover:text-brand-600 transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-neon-orange">
                        <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="font-black text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-amber-600 tracking-tight">
                        Lembar Buku Induk
                    </h2>
                </div>
            }
        >
            <Head title={`Buku Induk - ${student.nama_lengkap}`} />

            <div className="py-6 md:py-12 px-4 md:px-8 relative z-10 max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-end gap-3 mb-6">
                    <button onClick={handlePrintTranscript} className="w-full sm:w-auto justify-center flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95">
                        <FileText className="w-5 h-5" /> Cetak Transkrip 6 Semester
                    </button>
                    <button onClick={handlePrint} className="w-full sm:w-auto justify-center flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95">
                        <Printer className="w-5 h-5" /> Cetak Biodata
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Metadata Update Form */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-amber-500" /> Kelengkapan Data Buku Induk
                        </h3>
                        <form onSubmit={submitMetadata} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status Masuk</label>
                                <select value={data.registration_type} onChange={e => setData('registration_type', e.target.value)} className="w-full rounded-xl border-slate-200 focus:ring-amber-500 focus:border-amber-500">
                                    <option value="baru">Siswa Baru</option>
                                    <option value="pindahan">Pindahan</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Sekolah Asal</label>
                                <input type="text" value={data.origin_school} onChange={e => setData('origin_school', e.target.value)} className="w-full rounded-xl border-slate-200 focus:ring-amber-500 focus:border-amber-500" placeholder="SMP/MTs Asal..." />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tanggal Diterima</label>
                                <input type="date" value={data.entry_date} onChange={e => setData('entry_date', e.target.value)} className="w-full rounded-xl border-slate-200 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tanggal Keluar/Lulus</label>
                                <input type="date" value={data.exit_date} onChange={e => setData('exit_date', e.target.value)} className="w-full rounded-xl border-slate-200 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Alasan Keluar</label>
                                <input type="text" value={data.exit_reason} onChange={e => setData('exit_reason', e.target.value)} className="w-full rounded-xl border-slate-200 focus:ring-amber-500 focus:border-amber-500" placeholder="Lulus / Pindah / Lainnya..." />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Catatan Khusus Buku Induk</label>
                                <textarea value={data.notes_buku_induk} onChange={e => setData('notes_buku_induk', e.target.value)} rows="3" className="w-full rounded-xl border-slate-200 focus:ring-amber-500 focus:border-amber-500"></textarea>
                            </div>
                            <div className="md:col-span-2 flex justify-end items-center gap-4">
                                {recentlySuccessful && <span className="text-emerald-600 font-bold text-sm">Berhasil disimpan.</span>}
                                <button type="submit" disabled={processing} className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-colors">
                                    <Save className="w-4 h-4" /> Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Accordion Container */}
                    <div className="space-y-4">
                        <AccordionItem title="Data Pribadi & Orang Tua" icon={User} defaultOpen={true}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">Informasi Siswa</h4>
                                    <div className="space-y-3">
                                        <div><span className="text-slate-500 text-sm">Nama Lengkap:</span> <div className="font-bold text-slate-800">{student.nama_lengkap}</div></div>
                                        <div><span className="text-slate-500 text-sm">NIS / NISN:</span> <div className="font-bold text-slate-800">{student.nis} / {student.nisn || '-'}</div></div>
                                        <div><span className="text-slate-500 text-sm">Tempat, Tanggal Lahir:</span> <div className="font-bold text-slate-800">{student.tempat_lahir || '-'}, {student.tanggal_lahir || '-'}</div></div>
                                        <div><span className="text-slate-500 text-sm">Jenis Kelamin:</span> <div className="font-bold text-slate-800">{student.gender}</div></div>
                                        <div><span className="text-slate-500 text-sm">Alamat:</span> <div className="font-bold text-slate-800">{student.alamat || '-'}</div></div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">Informasi Sekolah Asal</h4>
                                    <div className="space-y-3">
                                        <div><span className="text-slate-500 text-sm">Status Masuk:</span> <div className="font-bold text-slate-800 uppercase">{student.registration_type || 'Baru'}</div></div>
                                        <div><span className="text-slate-500 text-sm">Sekolah Asal:</span> <div className="font-bold text-slate-800">{student.origin_school || '-'}</div></div>
                                        <div><span className="text-slate-500 text-sm">Tanggal Diterima:</span> <div className="font-bold text-slate-800">{student.entry_date || student.admission_date || '-'}</div></div>
                                    </div>
                                </div>
                            </div>
                        </AccordionItem>

                        <AccordionItem title="Riwayat Akademik (6 Semester)" icon={BookOpen} defaultOpen={true}>
                            {Array.from(semestersMap.values()).length > 0 ? (
                                <div className="space-y-6">
                                    {Array.from(semestersMap.values()).sort((a,b) => a.name.localeCompare(b.name)).map(sem => (
                                        <div key={sem.id} className="border border-slate-100 rounded-xl p-4 shadow-sm bg-white">
                                            <h4 className="font-black text-slate-800 mb-3 text-lg border-b border-slate-100 pb-2">{sem.name}</h4>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm text-left text-slate-500">
                                                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                                        <tr>
                                                            <th className="px-2 md:px-4 py-2 md:py-3">Mata Pelajaran</th>
                                                            <th className="px-2 md:px-4 py-2 md:py-3 text-center whitespace-nowrap">Nilai PTS</th>
                                                            <th className="px-2 md:px-4 py-2 md:py-3 text-center whitespace-nowrap">Nilai PAS</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {student.report_card_scores.filter(s => s.semester_id === sem.id).map(score => (
                                                            <tr key={score.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                                                <td className="px-2 md:px-4 py-2 md:py-3 font-medium text-slate-900">{score.subject?.name || '-'}</td>
                                                                <td className="px-2 md:px-4 py-2 md:py-3 text-center font-semibold">{score.pts_score}</td>
                                                                <td className="px-2 md:px-4 py-2 md:py-3 text-center font-bold text-indigo-600">{score.pas_score}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl">Belum ada data nilai semester.</div>
                            )}
                        </AccordionItem>

                        <AccordionItem title="Analisis Perkembangan Akademik" icon={BarChart2}>
                            {chartData.length > 0 ? (
                                <div className="h-72 md:h-80 w-full mt-4">
                                    <div className="w-full h-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} angle={-25} textAnchor="end" height={40} />
                                                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                                                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                                <Line type="monotone" dataKey="RataRata" name="Rata-rata Nilai" stroke="#4f46e5" strokeWidth={3} dot={{ r: 6, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl">Data tidak cukup untuk analisis grafik.</div>
                            )}
                        </AccordionItem>

                        <AccordionItem title="Rekap Kehadiran" icon={Activity}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center">
                                    <div className="text-3xl font-black text-emerald-600 mb-1">{attendanceStats.Hadir}</div>
                                    <div className="text-emerald-800 font-medium text-sm">Hadir</div>
                                </div>
                                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 text-center">
                                    <div className="text-3xl font-black text-amber-600 mb-1">{attendanceStats.Sakit}</div>
                                    <div className="text-amber-800 font-medium text-sm">Sakit</div>
                                </div>
                                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
                                    <div className="text-3xl font-black text-blue-600 mb-1">{attendanceStats.Izin}</div>
                                    <div className="text-blue-800 font-medium text-sm">Izin</div>
                                </div>
                                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-center">
                                    <div className="text-3xl font-black text-rose-600 mb-1">{attendanceStats.Alfa}</div>
                                    <div className="text-rose-800 font-medium text-sm">Alfa</div>
                                </div>
                            </div>
                        </AccordionItem>

                        <AccordionItem title="Rekam Jejak Kedisiplinan" icon={ShieldAlert}>
                            {student.violations && student.violations.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-slate-500">
                                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                            <tr>
                                                <th className="px-4 py-3">Tanggal</th>
                                                <th className="px-4 py-3">Jenis</th>
                                                <th className="px-4 py-3">Keterangan</th>
                                                <th className="px-4 py-3">Poin</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {student.violations.map(v => (
                                                <tr key={v.id} className="border-b border-slate-50">
                                                    <td className="px-4 py-3">{v.date}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${v.violation_type === 'berat' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>{v.violation_type}</span>
                                                    </td>
                                                    <td className="px-4 py-3">{v.description}</td>
                                                    <td className="px-4 py-3 font-bold text-red-600">+{v.points}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-500">Siswa tidak memiliki rekam jejak pelanggaran.</div>
                            )}
                        </AccordionItem>
                    </div>
                </div>
            </div>



        </AuthenticatedLayout>
    );
}
