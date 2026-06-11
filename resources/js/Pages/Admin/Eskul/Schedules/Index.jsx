import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { Pencil, Trash2, Plus, X, Calendar as CalendarIcon } from 'lucide-react';

export default function Index({ schedules, semesters, extracurriculars, flash }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        semester_id: '',
        extracurricular_id: '',
        day: 'Senin',
        start_time: '',
        end_time: '',
        location: '',
    });

    const openModal = (schedule = null) => {
        if (schedule) {
            setEditingId(schedule.id);
            setData({
                semester_id: schedule.semester_id,
                extracurricular_id: schedule.extracurricular_id,
                day: schedule.day,
                start_time: schedule.start_time || '',
                end_time: schedule.end_time || '',
                location: schedule.location || '',
            });
        } else {
            setEditingId(null);
            reset();
            // set defaults if lists are not empty
            if (semesters.length > 0) setData('semester_id', semesters[0].id);
            if (extracurriculars.length > 0) setData('extracurricular_id', extracurriculars[0].id);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            put(route('admin.eskul.eskul-schedules.update', editingId), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.eskul.eskul-schedules.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus Jadwal Ekskul ini?')) {
            router.delete(route('admin.eskul.eskul-schedules.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl shadow-neon-violet">
                            <CalendarIcon className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="font-black text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-brand-600 tracking-tight">
                            Jadwal Eskul
                        </h2>
                    </div>
                    <button onClick={() => openModal()} className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 ease-in-out bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl hover:from-brand-600 hover:to-indigo-700 shadow-neon-violet hover:shadow-neon-violet-hover hover:-translate-y-0.5 active:translate-y-0">
                        <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                        Tambah Jadwal
                        <div className="absolute inset-0 rounded-2xl ring-1 ring-white/20"></div>
                    </button>
                </div>
            }
        >
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
                                        placeholder="Cari jadwal eskul..." 
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all outline-none placeholder:text-slate-400"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto rounded-2xl border border-slate-100">
                    <table className="w-full text-sm text-left text-slate-600">
                        <thead className="text-xs font-semibold text-slate-500 bg-slate-50/80 uppercase tracking-wider border-b border-slate-100">
                            <tr>
                                <th className="px-4 py-3">Ekstrakurikuler</th>
                                <th className="px-4 py-3">Semester</th>
                                <th className="px-4 py-3">Hari</th>
                                <th className="px-4 py-3">Waktu</th>
                                <th className="px-4 py-3">Lokasi</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules.length > 0 ? schedules.map((item) => (
                                <tr key={item.id} className="hidden md:table-row border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-4 py-3 font-medium text-slate-900 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center text-blue-600"><CalendarIcon className="w-4 h-4" /></div>
                                        {item.extracurricular_name}
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">{item.semester_name}</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                                            {item.day}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">
                                        {item.start_time && item.end_time ? `${item.start_time} - ${item.end_time}` : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">{item.location || '-'}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openModal(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md" title="Edit Jadwal">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md" title="Hapus Jadwal">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-4 py-8 text-center text-slate-500">Belum ada jadwal ekstrakurikuler</td>
                                </tr>
                            )}
                        
                                </tbody>
                            </table>

                            {/* Mobile View */}
                            <div className="md:hidden space-y-4 mt-4">
                                {schedules.length > 0 ? schedules.map((item) => (
                                    <div key={item.id} className="bg-white p-4 rounded-[1.5rem] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] border border-slate-50 flex flex-col">
                                        <div className="flex items-center gap-3.5 ml-1">
                                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-brand-600 shrink-0 border-2 border-white shadow-sm">
                                                <CalendarIcon className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-slate-800 text-base leading-tight truncate">{item.extracurricular_name}</h3>
                                                <p className="text-xs font-medium text-slate-500 mt-0.5 truncate">{item.day} • {item.start_time && item.end_time ? `${item.start_time} - ${item.end_time}` : '-'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-50 ml-1">
                                            <span className="mr-auto px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg bg-indigo-50 text-indigo-600">
                                                {item.semester_name}
                                            </span>
                                            <span className="text-xs font-bold text-slate-600 px-2.5 py-1 bg-slate-50 rounded-lg">{item.location || '-'}</span>
                                            <button onClick={() => openModal(item)} className="p-2 text-slate-400 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl active:scale-95 transition-all" title="Edit">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 bg-slate-50 hover:bg-red-50 hover:text-red-600 rounded-xl active:scale-95 transition-all" title="Hapus">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-center text-slate-500 py-4">Belum ada data jadwal.</p>
                                )}
                            </div>

                    </div>
                </div>
            </div>
        </div>

            {/* Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-lg w-full max-w-lg overflow-hidden shadow-xl">
                        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-slate-800">{editingId ? 'Edit Jadwal Ekskul' : 'Tambah Jadwal Ekskul'}</h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="col-span-full">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Ekstrakurikuler</label>
                                    <select value={data.extracurricular_id} onChange={e => setData('extracurricular_id', e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                                        <option value="">-- Pilih Ekskul --</option>
                                        {extracurriculars.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                    </select>
                                    {errors.extracurricular_id && <p className="mt-1 text-sm text-red-600">{errors.extracurricular_id}</p>}
                                </div>
                                <div className="col-span-full">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
                                    <select value={data.semester_id} onChange={e => setData('semester_id', e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                                        <option value="">-- Pilih Semester --</option>
                                        {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                    {errors.semester_id && <p className="mt-1 text-sm text-red-600">{errors.semester_id}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Hari Pelaksanaan</label>
                                    <select value={data.day} onChange={e => setData('day', e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                                        {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    {errors.day && <p className="mt-1 text-sm text-red-600">{errors.day}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Lokasi Kegiatan</label>
                                    <input type="text" value={data.location} onChange={e => setData('location', e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Cth: Lapangan Basket" />
                                    {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Waktu Mulai (Opsional)</label>
                                    <input type="time" value={data.start_time} onChange={e => setData('start_time', e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    {errors.start_time && <p className="mt-1 text-sm text-red-600">{errors.start_time}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Waktu Selesai (Opsional)</label>
                                    <input type="time" value={data.end_time} onChange={e => setData('end_time', e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    {errors.end_time && <p className="mt-1 text-sm text-red-600">{errors.end_time}</p>}
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Batal</button>
                                <button type="submit" disabled={processing} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
