import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import { ClipboardList, Filter } from 'lucide-react';

export default function AssessmentIndex({ auth, learningObjectives, assessments, semesters, classes, subjects, filters }) {
    const [activeTab, setActiveTab] = useState('cp'); // 'cp' or 'daily'

    const filterForm = useForm({
        semester_id: filters.semester_id || '',
        class_id: filters.class_id || '',
        subject_id: filters.subject_id || '',
    });

    const cpForm = useForm({
        semester_id: filters.semester_id || '',
        class_id: filters.class_id || '',
        subject_id: filters.subject_id || '',
        target: '',
        material_scope: '',
    });

    const dailyForm = useForm({
        date: '',
        class_id: filters.class_id || '',
        subject_id: filters.subject_id || '',
        session_number: '',
        topic: '',
        records: []
    });

    const handleFilter = (e) => {
        e.preventDefault();
        filterForm.get(route('admin.assessment.index'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const submitCP = (e) => {
        e.preventDefault();
        cpForm.post(route('admin.assessment.learning-objectives.store'), {
            onSuccess: () => {
                cpForm.reset('target', 'material_scope');
            }
        });
    };

    const submitDaily = (e) => {
        e.preventDefault();
        dailyForm.post(route('admin.assessment.store'), {
            onSuccess: () => {
                dailyForm.reset('session_number', 'topic', 'records');
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
                            <ClipboardList className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="font-black text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-brand-600 tracking-tight">
                            Penilaian Akademik
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Penilaian Akademik" />

            <div className="py-6 md:py-12 relative z-10">
                {/* Ambient Background Blobs */}
                <div className="absolute top-0 -left-40 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob pointer-events-none"></div>
                <div className="absolute top-0 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>
                <div className="absolute -bottom-40 left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-0 sm:px-4 md:px-6 lg:px-8 relative z-10 space-y-6">
                    {/* Filter Section */}
                    <div className="bg-white/80 backdrop-blur-xl p-4 md:p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <div className="mb-6 md:mb-8">
                            <h3 className="text-lg font-medium mb-4">Filter Penilaian</h3>
                            <form onSubmit={handleFilter} className="flex flex-col sm:flex-row gap-4 flex-wrap items-center">
                                <select 
                                    className="w-full sm:w-auto flex-1 border-slate-200 focus:border-brand-500 focus:ring-brand-500 rounded-xl shadow-sm text-sm"
                                    value={filterForm.data.semester_id}
                                    onChange={e => filterForm.setData('semester_id', e.target.value)}
                                >
                                    <option value="">Pilih Semester</option>
                                    {semesters.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.academic_year})</option>
                                    ))}
                                </select>
                                <select 
                                    className="w-full sm:w-auto flex-1 border-slate-200 focus:border-brand-500 focus:ring-brand-500 rounded-xl shadow-sm text-sm"
                                    value={filterForm.data.class_id}
                                    onChange={e => filterForm.setData('class_id', e.target.value)}
                                >
                                    <option value="">Pilih Kelas</option>
                                    {classes.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <select 
                                    className="w-full sm:w-auto flex-1 border-slate-200 focus:border-brand-500 focus:ring-brand-500 rounded-xl shadow-sm text-sm"
                                    value={filterForm.data.subject_id}
                                    onChange={e => filterForm.setData('subject_id', e.target.value)}
                                >
                                    <option value="">Pilih Mapel</option>
                                    {subjects.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                                <PrimaryButton className="w-full sm:w-auto justify-center" type="submit">Filter</PrimaryButton>
                            </form>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        {activeTab === 'cp' ? (
                            <PrimaryButton onClick={() => setActiveTab('cp')}>Capaian Pembelajaran</PrimaryButton>
                        ) : (
                            <SecondaryButton onClick={() => setActiveTab('cp')}>Capaian Pembelajaran</SecondaryButton>
                        )}

                        {activeTab === 'daily' ? (
                            <PrimaryButton onClick={() => setActiveTab('daily')}>Penilaian Harian</PrimaryButton>
                        ) : (
                            <SecondaryButton onClick={() => setActiveTab('daily')}>Penilaian Harian</SecondaryButton>
                        )}
                    </div>

                    {activeTab === 'cp' && (
                        <div className="bg-white/80 backdrop-blur-xl p-4 md:p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                            <div className="mb-6 md:mb-8">
                                <h3 className="text-lg font-medium mb-4">Data Capaian Pembelajaran</h3>
                                <form onSubmit={submitCP} className="space-y-4 mb-6 p-5 border border-brand-100 rounded-2xl bg-brand-50/30">
                                    <h4 className="font-medium text-sm text-gray-700">Tambah CP Baru</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel>Target CP</InputLabel>
                                            <TextInput 
                                                className="mt-1 block w-full rounded-xl border-slate-200 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                                value={cpForm.data.target}
                                                onChange={e => cpForm.setData('target', e.target.value)}
                                                placeholder="Contoh: Memahami Aljabar"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <InputLabel>Ruang Lingkup Materi</InputLabel>
                                            <TextInput 
                                                className="mt-1 block w-full rounded-xl border-slate-200 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                                value={cpForm.data.material_scope}
                                                onChange={e => cpForm.setData('material_scope', e.target.value)}
                                                placeholder="Contoh: Operasi bilangan dasar"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <PrimaryButton type="submit" disabled={cpForm.processing}>Simpan CP</PrimaryButton>
                                </form>

                                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                                    <table className="hidden md:table min-w-full text-sm text-left text-slate-600">
                                        <thead className="text-xs font-semibold text-slate-500 bg-slate-50/80 uppercase tracking-wider border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-4">Kelas / Mapel</th>
                                                <th className="px-6 py-4">Target CP</th>
                                                <th className="px-6 py-4">Ruang Lingkup Materi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {learningObjectives.map(lo => (
                                                <tr key={lo.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-800">
                                                        {lo.school_class?.name} - {lo.subject?.name}
                                                    </td>
                                                    <td className="px-6 py-4">{lo.target}</td>
                                                    <td className="px-6 py-4">{lo.material_scope}</td>
                                                </tr>
                                            ))}
                                            {learningObjectives.length === 0 && (
                                                <tr>
                                                    <td colSpan="3" className="px-6 py-8 text-center text-slate-500">Belum ada data Capaian Pembelajaran.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>

                                    {/* Mobile Cards */}
                                    <div className="md:hidden flex flex-col gap-3 p-2 bg-slate-50/30">
                                        {learningObjectives.map(lo => (
                                            <div key={lo.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="px-2.5 py-1 bg-brand-50 text-brand-700 text-[10px] font-bold rounded-lg border border-brand-100 uppercase tracking-wider">
                                                        {lo.school_class?.name}
                                                    </span>
                                                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-lg border border-indigo-100 uppercase tracking-wider">
                                                        {lo.subject?.name}
                                                    </span>
                                                </div>
                                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                    <p className="text-xs text-slate-500 mb-1 font-semibold uppercase">Target</p>
                                                    <p className="text-sm font-medium text-slate-800">{lo.target}</p>
                                                </div>
                                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mt-1">
                                                    <p className="text-xs text-slate-500 mb-1 font-semibold uppercase">Materi</p>
                                                    <p className="text-sm text-slate-700">{lo.material_scope}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {learningObjectives.length === 0 && (
                                            <div className="p-6 text-center text-slate-500 text-sm">Belum ada data.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'daily' && (
                        <div className="bg-white/80 backdrop-blur-xl p-4 md:p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                            <div className="mb-6 md:mb-8">
                                <h3 className="text-lg font-medium mb-4">Input Penilaian Harian (Bulk)</h3>
                                <p className="text-sm text-gray-500 mb-4">Pastikan Anda sudah memilih Kelas dan Mapel di filter atas.</p>
                                <form onSubmit={submitDaily} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <InputLabel>Tanggal</InputLabel>
                                            <TextInput type="date" className="mt-1 block w-full rounded-xl border-slate-200 shadow-sm focus:border-brand-500 focus:ring-brand-500" value={dailyForm.data.date} onChange={e => dailyForm.setData('date', e.target.value)} required />
                                        </div>
                                        <div>
                                            <InputLabel>Pertemuan Ke-</InputLabel>
                                            <TextInput type="number" min="1" className="mt-1 block w-full rounded-xl border-slate-200 shadow-sm focus:border-brand-500 focus:ring-brand-500" value={dailyForm.data.session_number} onChange={e => dailyForm.setData('session_number', e.target.value)} required />
                                        </div>
                                        <div>
                                            <InputLabel>Topik</InputLabel>
                                            <TextInput className="mt-1 block w-full rounded-xl border-slate-200 shadow-sm focus:border-brand-500 focus:ring-brand-500" value={dailyForm.data.topic} onChange={e => dailyForm.setData('topic', e.target.value)} required />
                                        </div>
                                    </div>
                                    
                                    <div className="border border-slate-200 rounded-2xl p-5 mt-6 bg-slate-50">
                                        <h4 className="font-medium text-sm text-gray-700 mb-2">Daftar Nilai Siswa (Data Grid Bawaan)</h4>
                                        <p className="text-xs text-gray-500 mb-4">Karena ini simulasi sederhana tanpa dependensi, input nilai harian disimpan per pertemuan kelas. Pastikan data form sudah terisi.</p>
                                        <PrimaryButton type="submit" disabled={dailyForm.processing}>Simpan Nilai Harian Kelas Ini</PrimaryButton>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
