import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import { BookOpen, Plus, Search } from 'lucide-react';

export default function Index({ auth, journals, schedules, classes, subjects, filters }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        date: new Date().toISOString().split('T')[0],
        schedule_id: '',
        class_id: '',
        subject_id: '',
        session_number: 1,
        topic: '',
        time_context: '',
        notes: ''
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        const desiredPerPage = isMobile ? 5 : 10;
        
        if (!filters.per_page || parseInt(filters.per_page) !== desiredPerPage) {
            router.reload({
                data: { search, per_page: desiredPerPage },
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['journals', 'filters'],
                showProgress: false
            });
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            router.reload({ 
                data: { search, per_page: filters.per_page },
                preserveState: true, 
                preserveScroll: true,
                replace: true,
                only: ['journals'],
                showProgress: false
            });
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.reload({ 
            data: { search, per_page: filters.per_page },
            preserveState: true, 
            preserveScroll: true, 
            replace: true,
            only: ['journals'],
            showProgress: false
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.academic.journals.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl shadow-neon-violet">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="font-black text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-brand-600 tracking-tight">
                            Jurnal Mengajar
                        </h2>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 ease-in-out bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl hover:from-brand-600 hover:to-indigo-700 shadow-neon-violet hover:shadow-neon-violet-hover hover:-translate-y-0.5 active:translate-y-0">
                        <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                        Isi Jurnal Baru
                        <div className="absolute inset-0 rounded-2xl ring-1 ring-white/20"></div>
                    </button>
                </div>
            }
        >
            <Head title="Jurnal Mengajar" />
            <div className="py-6 md:py-12 relative z-10">
                {/* Ambient Background Blobs */}
                <div className="absolute top-0 -left-40 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob pointer-events-none"></div>
                <div className="absolute top-0 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>
                <div className="absolute -bottom-40 left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-0 sm:px-4 md:px-6 lg:px-8 relative z-10 space-y-6">
                    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                            <div className="w-full md:w-96 relative">
                                <div className="relative flex items-center">
                                    <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Cari jurnal..." 
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all outline-none placeholder:text-slate-400"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Table */}
                        <div className="overflow-x-auto rounded-2xl border border-slate-100">
                            <table className="hidden md:table w-full text-sm text-left text-slate-600">
                                <thead className="text-xs font-semibold text-slate-500 bg-slate-50/80 uppercase tracking-wider border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-3">Tanggal</th>
                                        <th className="px-6 py-3">Topik</th>
                                        <th className="px-6 py-3">Pertemuan</th>
                                        <th className="px-6 py-3">Waktu</th>
                                        <th className="px-6 py-3">Guru</th>
                                        <th className="px-6 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                
                                <tbody>
                                    {journals.data && journals.data.map((j) => (
                                        <tr key={j.id} className="hidden md:table-row border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-6 py-4">{j.date}</td>
                                            <td className="px-6 py-4">{j.topic}</td>
                                            <td className="px-6 py-4">Ke-{j.session_number}</td>
                                            <td className="px-6 py-4">{j.time_context}</td>
                                            <td className="px-6 py-4">{j.teacher?.user?.name}</td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={route('admin.academic.journals.show', j.id)}
                                                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors border border-brand-100"
                                                >
                                                    Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Mobile View */}
                            <div className="md:hidden space-y-4 mt-4">
                                {journals.data && journals.data.map((j) => (
                                    <div key={j.id} className="bg-white p-4 rounded-[1.5rem] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] border border-slate-50 flex flex-col">
                                        <div className="flex items-center gap-3.5 ml-1">
                                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-brand-600 shrink-0 border-2 border-white shadow-sm">
                                                <BookOpen className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-slate-800 text-base leading-tight truncate">{j.topic}</h3>
                                                <p className="text-xs font-medium text-slate-500 mt-0.5 truncate">Guru: <span className="text-slate-700 font-semibold">{j.teacher?.user?.name}</span></p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-50 ml-1">
                                            <span className="mr-auto px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg bg-indigo-50 text-indigo-600">
                                                {j.date} (Pertemuan {j.session_number})
                                            </span>
                                            <Link
                                                href={route('admin.academic.journals.show', j.id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors"
                                            >
                                                Detail
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-screen overflow-y-auto">
                        <h3 className="text-lg font-medium mb-4">Isi Jurnal</h3>
                        {errors.error && <div className="mb-4 text-red-600 text-sm">{errors.error}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                                <input type="date" className="mt-1 block w-full border-gray-300 rounded-md" value={data.date} max={new Date().toISOString().split('T')[0]} onChange={e => setData('date', e.target.value)} required />
                                {errors.date && <div className="text-red-500 text-xs mt-1">{errors.date}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Jadwal</label>
                                <select 
                                    className="mt-1 block w-full border-gray-300 rounded-md" 
                                    value={data.schedule_id} 
                                    onChange={e => {
                                        const val = e.target.value;
                                        const selected = schedules.find(s => s.id == val);
                                        if (selected) {
                                            setData({
                                                ...data,
                                                schedule_id: val,
                                                class_id: selected.class_id,
                                                subject_id: selected.subject_id,
                                                time_context: selected.time_slot ? `${selected.time_slot.start_time.substring(0, 5)} - ${selected.time_slot.end_time.substring(0, 5)}` : data.time_context
                                            });
                                        } else {
                                            setData('schedule_id', val);
                                        }
                                    }} 
                                    required
                                >
                                    <option value="">Pilih Jadwal</option>
                                    {schedules.filter(s => {
                                        const d = new Date(data.date);
                                        const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
                                        return s.day === days[d.getDay()];
                                    }).map(s => (
                                        <option key={s.id} value={s.id}>{s.day} - {s.subject?.name} - {s.school_class?.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Pertemuan Ke-</label>
                                <input type="number" min="1" className="mt-1 block w-full border-gray-300 rounded-md" value={data.session_number} onChange={e => setData('session_number', e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Topik / Materi</label>
                                <input type="text" className="mt-1 block w-full border-gray-300 rounded-md" value={data.topic} onChange={e => setData('topic', e.target.value)} required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Catatan Khusus (Opsional)</label>
                                <textarea className="mt-1 block w-full border-gray-300 rounded-md" value={data.notes} onChange={e => setData('notes', e.target.value)}></textarea>
                            </div>
                            <div className="flex space-x-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded">Batal</button>
                                <button type="submit" disabled={processing} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
