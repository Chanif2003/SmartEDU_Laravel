import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { FileText, Plus, Search } from 'lucide-react';

export default function Index({ auth, administrations, semesters, subjects, teachers, filters }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        teacher_id: '',
        semester_id: '',
        subject_id: '',
        prota_file: null,
        promes_file: null,
        cp_file: null,
        atp_file: null,
        modul_file: null,
        kktp_file: null,
        lkpd_file: null,
        rubrik_file: null
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.academic.administrations.store'), {
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
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="font-black text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-brand-600 tracking-tight">
                            Administrasi Guru
                        </h2>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 ease-in-out bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl hover:from-brand-600 hover:to-indigo-700 shadow-neon-violet hover:shadow-neon-violet-hover hover:-translate-y-0.5 active:translate-y-0">
                        <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                        Upload Dokumen
                        <div className="absolute inset-0 rounded-2xl ring-1 ring-white/20"></div>
                    </button>
                </div>
            }
        >
            <Head title="Administrasi Guru" />
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
                                        placeholder="Cari administrasi..." 
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all outline-none placeholder:text-slate-400"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto rounded-2xl border border-slate-100">
                            <table className="hidden md:table w-full text-sm text-left text-slate-600">
                                <thead className="text-xs font-semibold text-slate-500 bg-slate-50/80 uppercase tracking-wider border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-3">Guru</th>
                                        <th className="px-6 py-3">Semester</th>
                                        <th className="px-6 py-3">Mata Pelajaran</th>
                                        <th className="px-6 py-3">Prota</th>
                                        <th className="px-6 py-3">Promes</th>
                                        <th className="px-6 py-3">CP</th>
                                        <th className="px-6 py-3">ATP</th>
                                        <th className="px-6 py-3">Modul</th>
                                        <th className="px-6 py-3">KKTP</th>
                                        <th className="px-6 py-3">LKPD</th>
                                        <th className="px-6 py-3">Rubrik</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {administrations.data && administrations.data.map((a) => (
                                        <tr key={a.id} className="hidden md:table-row border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-6 py-4">{a.teacher?.user?.name}</td>
                                            <td className="px-6 py-4">{a.semester?.name}</td>
                                            <td className="px-6 py-4">{a.subject?.name}</td>
                                            <td className="px-6 py-4">
                                                {a.prota_path ? <a href={`/storage/${a.prota_path}`} target="_blank" rel="noreferrer" className="text-blue-600">Unduh</a> : '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {a.promes_path ? <a href={`/storage/${a.promes_path}`} target="_blank" rel="noreferrer" className="text-blue-600">Unduh</a> : '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {a.cp_path ? <a href={`/storage/${a.cp_path}`} target="_blank" rel="noreferrer" className="text-blue-600">Unduh</a> : '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {a.atp_path ? <a href={`/storage/${a.atp_path}`} target="_blank" rel="noreferrer" className="text-blue-600">Unduh</a> : '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {a.modul_path ? <a href={`/storage/${a.modul_path}`} target="_blank" rel="noreferrer" className="text-blue-600">Unduh</a> : '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {a.kktp_path ? <a href={`/storage/${a.kktp_path}`} target="_blank" rel="noreferrer" className="text-blue-600">Unduh</a> : '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {a.lkpd_path ? <a href={`/storage/${a.lkpd_path}`} target="_blank" rel="noreferrer" className="text-blue-600">Unduh</a> : '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {a.rubrik_path ? <a href={`/storage/${a.rubrik_path}`} target="_blank" rel="noreferrer" className="text-blue-600">Unduh</a> : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                
                                </tbody>
                            </table>

                            {/* Mobile View */}
                            <div className="md:hidden space-y-4 mt-4">
                                {administrations.data && administrations.data.map((a) => (
                                    <div key={a.id} className="bg-white p-4 rounded-[1.5rem] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] border border-slate-50 flex flex-col">
                                        <div className="flex items-center gap-3.5 ml-1">
                                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-brand-600 shrink-0 border-2 border-white shadow-sm">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-slate-800 text-base leading-tight truncate">{a.subject?.name}</h3>
                                                <p className="text-xs font-medium text-slate-500 mt-0.5 truncate">Guru: <span className="text-slate-700 font-semibold">{a.teacher?.user?.name}</span></p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3 mt-4 pt-3 border-t border-slate-50 ml-1">
                                            <span className="self-start px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg bg-indigo-50 text-indigo-600">
                                                {a.semester?.name}
                                            </span>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {a.prota_path && <a href={"/storage/" + a.prota_path} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-brand-600 px-2.5 py-1.5 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors border border-brand-100/50 shadow-sm">Prota</a>}
                                                {a.promes_path && <a href={"/storage/" + a.promes_path} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-brand-600 px-2.5 py-1.5 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors border border-brand-100/50 shadow-sm">Promes</a>}
                                                {a.cp_path && <a href={"/storage/" + a.cp_path} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-brand-600 px-2.5 py-1.5 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors border border-brand-100/50 shadow-sm">CP</a>}
                                                {a.atp_path && <a href={"/storage/" + a.atp_path} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-brand-600 px-2.5 py-1.5 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors border border-brand-100/50 shadow-sm">ATP</a>}
                                                {a.modul_path && <a href={"/storage/" + a.modul_path} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-brand-600 px-2.5 py-1.5 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors border border-brand-100/50 shadow-sm">Modul</a>}
                                                {a.kktp_path && <a href={"/storage/" + a.kktp_path} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-brand-600 px-2.5 py-1.5 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors border border-brand-100/50 shadow-sm">KKTP</a>}
                                                {a.lkpd_path && <a href={"/storage/" + a.lkpd_path} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-brand-600 px-2.5 py-1.5 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors border border-brand-100/50 shadow-sm">LKPD</a>}
                                                {a.rubrik_path && <a href={"/storage/" + a.rubrik_path} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-brand-600 px-2.5 py-1.5 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors border border-brand-100/50 shadow-sm">Rubrik</a>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-screen overflow-y-auto">
                        <h3 className="text-lg font-medium mb-4">Upload Administrasi</h3>
                        {errors.error && <div className="mb-4 text-red-600 text-sm">{errors.error}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {auth.user.role !== 'teacher' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Guru</label>
                                    <select className="mt-1 block w-full border-gray-300 rounded-md" value={data.teacher_id} onChange={e => setData('teacher_id', e.target.value)} required>
                                        <option value="">-- Pilih Guru --</option>
                                        {teachers && teachers.map(t => <option key={t.id} value={t.id}>{t.user?.name}</option>)}
                                    </select>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Semester</label>
                                <select className="mt-1 block w-full border-gray-300 rounded-md" value={data.semester_id} onChange={e => setData('semester_id', e.target.value)} required>
                                    <option value="">-- Pilih Semester --</option>
                                    {semesters.map(s => <option key={s.id} value={s.id}>{s.name} ({s.year})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mata Pelajaran</label>
                                <select className="mt-1 block w-full border-gray-300 rounded-md" value={data.subject_id} onChange={e => setData('subject_id', e.target.value)} required>
                                    <option value="">-- Pilih Mata Pelajaran --</option>
                                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">File Prota</label>
                                    <input type="file" onChange={e => setData('prota_file', e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">File Promes</label>
                                    <input type="file" onChange={e => setData('promes_file', e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">File CP</label>
                                    <input type="file" onChange={e => setData('cp_file', e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">File ATP</label>
                                    <input type="file" onChange={e => setData('atp_file', e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">File Modul</label>
                                    <input type="file" onChange={e => setData('modul_file', e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">File KKTP</label>
                                    <input type="file" onChange={e => setData('kktp_file', e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">File LKPD</label>
                                    <input type="file" onChange={e => setData('lkpd_file', e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">File Rubrik</label>
                                    <input type="file" onChange={e => setData('rubrik_file', e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500" />
                                </div>
                            </div>
                            <div className="flex space-x-3 mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded">Batal</button>
                                <button type="submit" disabled={processing} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded">Upload</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
