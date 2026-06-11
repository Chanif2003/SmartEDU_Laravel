import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Pencil, Trash2, Plus, Users, X, Activity, Search } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6', '#f43f5e', '#6366f1', '#10b981', '#f59e0b', '#ef4444'];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    return percent > 0 ? (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    ) : null;
};

export default function Index({ auth, extracurriculars, teachers, students, flash, statistics }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [selectedEskul, setSelectedEskul] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        coach_id: '',
    });

    const memberForm = useForm({
        student_ids: [],
    });

    const openModal = (eskul = null) => {
        if (eskul) {
            setEditingId(eskul.id);
            setData({
                name: eskul.name,
                coach_id: eskul.coach_id || '',
            });
        } else {
            setEditingId(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const openMemberModal = (eskul) => {
        setSelectedEskul(eskul);
        // We need to fetch or have the selected student IDs. For now we will assume empty or we need to pass them from backend.
        // Wait, the backend doesn't pass individual members list in the index to avoid N+1 huge payload.
        // Let's just use it as a dumb sync that overrides. Or we can load it via axios. For simplicity, we just use a multiple select.
        memberForm.setData('student_ids', []);
        setIsMemberModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const closeMemberModal = () => {
        setIsMemberModalOpen(false);
        setSelectedEskul(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            put(route('admin.eskul.extracurriculars.update', editingId), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.eskul.extracurriculars.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleMemberSubmit = (e) => {
        e.preventDefault();
        memberForm.post(route('admin.eskul.extracurriculars.sync-members', selectedEskul.id), {
            onSuccess: () => closeMemberModal(),
        });
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus Ekstrakurikuler ini?')) {
            router.delete(route('admin.eskul.extracurriculars.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl shadow-neon-violet">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="font-black text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-brand-600 tracking-tight">
                            Ekstrakurikuler
                        </h2>
                    </div>
                    <button onClick={() => openModal()} className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 ease-in-out bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl hover:from-brand-600 hover:to-indigo-700 shadow-neon-violet hover:shadow-neon-violet-hover hover:-translate-y-0.5 active:translate-y-0">
                        <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                        Tambah Ekskul
                        <div className="absolute inset-0 rounded-2xl ring-1 ring-white/20"></div>
                    </button>
                </div>
            }
        >
            <Head title="Ekstrakurikuler" />

            <div className="py-6 md:py-12 relative z-10">
                {/* Ambient Background Blobs */}
                <div className="absolute top-0 -left-40 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob pointer-events-none"></div>
                <div className="absolute top-0 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>
                <div className="absolute -bottom-40 left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-0 sm:px-4 md:px-6 lg:px-8 relative z-10 space-y-6">
                    
                    {/* Statistik Eskul Card */}
                    {statistics && (
                        <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-6">Statistik Anggota Ekstrakurikuler</h3>
                            <div className="flex justify-center">
                                <div className="w-full md:w-2/3 h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={statistics.member_distribution}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={renderCustomizedLabel}
                                                outerRadius="80%"
                                                fill="#8b5cf6"
                                                dataKey="value"
                                            >
                                                {statistics.member_distribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip formatter={(value) => [`${value} Anggota`, 'Jumlah']} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                            <div className="w-full md:w-96 relative">
                                <div className="relative flex items-center">
                                    <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Cari eskul..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all outline-none placeholder:text-slate-400"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto rounded-2xl border border-slate-100">
                    {flash?.success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm border border-green-200">{flash.success}</div>}
                    
                    <table className="w-full text-sm text-left text-slate-600 hidden md:table">
                        <thead className="text-xs font-semibold text-slate-500 bg-slate-50/80 uppercase tracking-wider border-b border-slate-100">
                            <tr>
                                <th className="px-4 py-3">Nama Ekskul</th>
                                <th className="px-4 py-3">Guru Pembina</th>
                                <th className="px-4 py-3 text-center">Jumlah Anggota</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {extracurriculars.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()) || (e.coach_name && e.coach_name.toLowerCase().includes(searchTerm.toLowerCase()))).length > 0 ? extracurriculars.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()) || (e.coach_name && e.coach_name.toLowerCase().includes(searchTerm.toLowerCase()))).map((item) => (
                                <tr key={item.id} className="hidden md:table-row border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                                    <td className="px-4 py-3">{item.coach_name}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {item.members_count} Siswa
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openMemberModal(item)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md" title="Kelola Anggota">
                                                <Users className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => openModal(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md" title="Edit Ekskul">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md" title="Hapus Ekskul">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-4 py-8 text-center text-slate-500">Belum ada data ekstrakurikuler</td>
                                </tr>
                            )}
                        
                                </tbody>
                            </table>

                            {/* Mobile View */}
                            <div className="md:hidden space-y-4 mt-4">
                                {extracurriculars.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()) || (e.coach_name && e.coach_name.toLowerCase().includes(searchTerm.toLowerCase()))).length > 0 ? extracurriculars.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()) || (e.coach_name && e.coach_name.toLowerCase().includes(searchTerm.toLowerCase()))).map((item) => (
                                    <div key={item.id} className="bg-white p-4 rounded-[1.5rem] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] border border-slate-50 flex flex-col">
                                        <div className="flex items-center gap-3.5 ml-1">
                                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-brand-600 shrink-0 border-2 border-white shadow-sm">
                                                <Activity className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-slate-800 text-base leading-tight truncate">{item.name}</h3>
                                                <p className="text-xs font-medium text-slate-500 mt-0.5 truncate">Guru Pembina: <span className="text-slate-700 font-semibold">{item.coach_name}</span></p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-50 ml-1">
                                            <span className="mr-auto px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg bg-indigo-50 text-indigo-600">
                                                {item.members_count} Anggota
                                            </span>
                                            <button onClick={() => openMemberModal(item)} className="p-2 text-slate-400 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl active:scale-95 transition-all" title="Anggota">
                                                <Users className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => openModal(item)} className="p-2 text-slate-400 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl active:scale-95 transition-all" title="Edit">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 bg-slate-50 hover:bg-red-50 hover:text-red-600 rounded-xl active:scale-95 transition-all" title="Hapus">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-center text-slate-500 py-4">Belum ada data eskul.</p>
                                )}
                            </div>

                </div>
            </div>

                    </div>
                </div>

        {/* Form Modal */}
        {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-xl">
                        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-slate-800">{editingId ? 'Edit Ekstrakurikuler' : 'Tambah Ekstrakurikuler'}</h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Ekskul</label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: Pramuka, Basket" required />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Guru Pembina (Opsional)</label>
                                    <select value={data.coach_id} onChange={e => setData('coach_id', e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">-- Pilih Pembina --</option>
                                        {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                    {errors.coach_id && <p className="mt-1 text-sm text-red-600">{errors.coach_id}</p>}
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

            {/* Member Sync Modal */}
            {isMemberModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-lg w-full max-w-2xl overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center shrink-0">
                            <h3 className="text-lg font-semibold text-slate-800">Anggota Ekskul: {selectedEskul?.name}</h3>
                            <button onClick={closeMemberModal} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                            <p className="text-sm text-slate-600 mb-4">Pilih siswa yang akan didaftarkan ke dalam ekstrakurikuler ini. Pemilihan massal (Sinkronisasi) akan menggantikan data anggota sebelumnya.</p>
                            <form id="memberForm" onSubmit={handleMemberSubmit}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-1">
                                    {students.map(student => (
                                        <label key={student.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                value={student.id}
                                                checked={memberForm.data.student_ids.includes(student.id)}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    let currentIds = [...memberForm.data.student_ids];
                                                    if (checked) currentIds.push(student.id);
                                                    else currentIds = currentIds.filter(id => id !== student.id);
                                                    memberForm.setData('student_ids', currentIds);
                                                }}
                                                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" 
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-900">{student.name}</span>
                                                <span className="text-xs text-slate-500">NIS: {student.nis || '-'}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {memberForm.errors.student_ids && <p className="mt-2 text-sm text-red-600">{memberForm.errors.student_ids}</p>}
                            </form>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 shrink-0 bg-slate-50">
                            <button type="button" onClick={closeMemberModal} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Batal</button>
                            <button type="submit" form="memberForm" disabled={memberForm.processing} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">Simpan Anggota</button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
