import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const TYPE_COLORS = {
    'ringan': '#4ade80',  // green
    'sedang': '#facc15',  // yellow
    'berat': '#f87171'    // red
};

const CATEGORY_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6', '#f43f5e', '#6366f1'];

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

export default function Index({ violations, students, totalPoints, filters, statistics }) {
    const { auth } = usePage().props;
    const isStudent = auth.user.role === 'student';
    const isTeacher = auth.user.role === 'teacher';
    const isAdmin = auth.user.role === 'admin';
    
    // States for Form Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        student_id: '',
        violation_type: 'ringan',
        category: '',
        description: '',
        action_taken: '',
        points: 0,
    });

    const openCreateModal = () => {
        setIsEditing(false);
        setFormData({
            id: null,
            date: new Date().toISOString().split('T')[0],
            student_id: '',
            violation_type: 'ringan',
            category: '',
            description: '',
            action_taken: '',
            points: 0,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (violation) => {
        setIsEditing(true);
        setFormData({
            id: violation.id,
            date: violation.date,
            student_id: violation.student_id,
            violation_type: violation.violation_type,
            category: violation.category || '',
            description: violation.description || '',
            action_taken: violation.action_taken || '',
            points: violation.points || 0,
        });
        setIsModalOpen(true);
    };

    const handleSearch = (e) => {
        router.get(
            route('discipline.violations.index'),
            { search: e.target.value },
            { preserveState: true, replace: true }
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const action = isEditing 
            ? () => router.put(route('discipline.violations.update', formData.id), formData, {
                onSuccess: () => {
                    setIsModalOpen(false);
                }
            })
            : () => router.post(route('discipline.violations.store'), formData, {
                onSuccess: () => {
                    setIsModalOpen(false);
                }
            });
            
        action();
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus data pelanggaran ini?')) {
            router.delete(route('discipline.violations.destroy', id));
        }
    };

    // Calculate circular progress (Max points threshold example: 100)
    const MAX_POINTS = 100;
    const pointsPercentage = isStudent ? Math.min((totalPoints / MAX_POINTS) * 100, 100) : 0;
    let circleColor = '#10B981'; // Green
    if (totalPoints > 20 && totalPoints <= 50) circleColor = '#F59E0B'; // Yellow
    if (totalPoints > 50) circleColor = '#EF4444'; // Red

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl shadow-neon-violet">
                            <AlertTriangle className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="font-black text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-brand-600 tracking-tight">
                            Kedisiplinan
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Kedisiplinan" />

            <div className="py-6 md:py-12 relative z-10">
                {/* Ambient Background Blobs */}
                <div className="absolute top-0 -left-40 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob pointer-events-none"></div>
                <div className="absolute top-0 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>
                <div className="absolute -bottom-40 left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-0 sm:px-4 md:px-6 lg:px-8 relative z-10 space-y-6">
                    
                    {/* Student Dashboard Summary */}
                    {isStudent && (
                        <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Total Poin Pelanggaran Anda</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Jaga kedisiplinan agar poin tidak melebihi batas (100 Poin).
                                </p>
                            </div>
                            <div className="relative w-24 h-24">
                                <svg className="w-full h-full" viewBox="0 0 36 36">
                                    <path
                                        className="text-gray-200"
                                        strokeWidth="3"
                                        stroke="currentColor"
                                        fill="none"
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <path
                                        stroke={circleColor}
                                        strokeWidth="3"
                                        strokeDasharray={`${pointsPercentage}, 100`}
                                        strokeLinecap="round"
                                        fill="none"
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <text x="18" y="20.35" className="text-3xl font-bold" textAnchor="middle" fill={circleColor}>
                                        {totalPoints}
                                    </text>
                                </svg>
                            </div>
                        </div>
                    )}

                    {/* Statistik Pelanggaran Card (Hanya untuk Admin/Guru) */}
                    {!isStudent && statistics && (
                        <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-6">Statistik Pelanggaran Kedisiplinan</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 mb-4 text-center">Tingkat Pelanggaran</h4>
                                    <div className="h-[300px] w-full flex justify-center">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={statistics.type_distribution}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={renderCustomizedLabel}
                                                    outerRadius="75%"
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {statistics.type_distribution.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={TYPE_COLORS[entry.name.toLowerCase()] || '#cbd5e1'} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip formatter={(value) => [`${value} Kasus`, 'Jumlah']} />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 mb-4 text-center">Top Kategori Pelanggaran</h4>
                                    <div className="h-[300px] w-full flex justify-center">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={statistics.category_distribution} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                                <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                                <Bar dataKey="value" name="Jumlah Kasus" radius={[6, 6, 0, 0]}>
                                                    {statistics.category_distribution.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Table Section */}
                    <div className="bg-white/80 backdrop-blur-xl p-4 md:p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <div className="p-2 md:p-4 text-slate-800">
                            
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                <h3 className="text-lg font-medium">Riwayat Pelanggaran</h3>
                                {!isStudent && (
                                    <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
                                        <input
                                            type="text"
                                            placeholder="Cari nama siswa..."
                                            defaultValue={filters?.search || ''}
                                            onChange={handleSearch}
                                            className="w-full sm:w-64 border-slate-200 focus:border-brand-500 focus:ring-brand-500 rounded-xl shadow-sm text-sm"
                                        />
                                        <button
                                            onClick={openCreateModal}
                                            className="w-full sm:w-auto px-4 py-2 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 transition-colors whitespace-nowrap"
                                        >
                                            Tambah Catatan
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="overflow-x-auto rounded-2xl border border-slate-100">
                                <table className="hidden md:table w-full text-sm text-left text-slate-600">
                                    <thead className="text-xs font-semibold text-slate-500 bg-slate-50/80 uppercase tracking-wider border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-3">Tanggal</th>
                                            {!isStudent && <th className="px-6 py-3">Siswa</th>}
                                            <th className="px-6 py-3">Kategori</th>
                                            <th className="px-6 py-3">Deskripsi</th>
                                            <th className="px-6 py-3">Tindakan</th>
                                            <th className="px-6 py-3">Poin</th>
                                            {!isStudent && <th className="px-6 py-3">Pelapor</th>}
                                            {!isStudent && <th className="px-6 py-3">Aksi</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {violations.data && violations.data.length > 0 ? (
                                            violations.data.map((v) => (
                                                <tr key={v.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                                                    <td className="px-6 py-4">{new Date(v.date).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})}</td>
                                                    {!isStudent && <td className="px-6 py-4 font-medium text-slate-800">{v.student?.user?.name}</td>}
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-widest ${
                                                            v.violation_type === 'berat' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                            v.violation_type === 'sedang' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' :
                                                            'bg-green-50 text-green-600 border border-green-100'
                                                        }`}>
                                                            {v.category || v.violation_type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">{v.description}</td>
                                                    <td className="px-6 py-4">{v.action_taken || '-'}</td>
                                                    <td className="px-6 py-4 text-red-600 font-bold text-base">+{v.points}</td>
                                                    {!isStudent && <td className="px-6 py-4">{v.teacher?.user?.name || 'Sistem'}</td>}
                                                    {!isStudent && (
                                                        <td className="px-6 py-4">
                                                            <div className="flex gap-2">
                                                                <button 
                                                                    onClick={() => openEditModal(v)}
                                                                    className="text-slate-400 hover:text-blue-500 transition-colors p-2 rounded-xl hover:bg-blue-50"
                                                                    title="Edit"
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                                </button>
                                                                {isAdmin && (
                                                                    <button 
                                                                        onClick={() => handleDelete(v.id)}
                                                                        className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50"
                                                                        title="Hapus"
                                                                    >
                                                                        <Trash2 className="w-5 h-5" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={isStudent ? 5 : 8} className="px-6 py-8 text-center text-slate-500">
                                                    Tidak ada data pelanggaran.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                {/* Mobile View */}
                                <div className="md:hidden space-y-4">
                                    {violations.data && violations.data.length > 0 ? (
                                        violations.data.map((v) => (
                                            <div key={v.id} className="bg-white p-4 rounded-[1.5rem] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] border border-slate-50 flex flex-col">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                                            v.violation_type === 'berat' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                            v.violation_type === 'sedang' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' :
                                                            'bg-green-50 text-green-600 border border-green-100'
                                                        }`}>
                                                            {v.category || v.violation_type}
                                                        </span>
                                                        {!isStudent && <h3 className="font-bold text-slate-800 text-base leading-tight mt-2 truncate max-w-[200px]">{v.student?.user?.name}</h3>}
                                                        <p className="text-xs font-medium text-slate-500 mt-1">{new Date(v.date).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})}</p>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-xl font-black text-red-600">+{v.points}</span>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Poin</span>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-50 rounded-xl p-3 mb-3 border border-slate-100">
                                                    <p className="text-sm text-slate-700 font-medium mb-1 line-clamp-2">{v.description}</p>
                                                    {v.action_taken && <p className="text-xs text-slate-500 mt-2"><span className="font-semibold text-slate-600">Tindakan:</span> {v.action_taken}</p>}
                                                </div>
                                                
                                                <div className="flex justify-between items-center mt-1 pt-3 border-t border-slate-50">
                                                    {!isStudent ? (
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                            Pelapor: {v.teacher?.user?.name || 'Sistem'}
                                                        </p>
                                                    ) : <div></div>}
                                                    {!isStudent && (
                                                        <div className="flex gap-2">
                                                            <button 
                                                                onClick={() => openEditModal(v)}
                                                                className="text-blue-500 hover:text-blue-600 p-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                            </button>
                                                            {isAdmin && (
                                                                <button 
                                                                    onClick={() => handleDelete(v.id)}
                                                                    className="text-red-500 hover:text-red-600 p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                            Tidak ada data pelanggaran.
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* Modal Form */}
            {isModalOpen && !isStudent && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-medium mb-4">{isEditing ? 'Edit Catatan Pelanggaran' : 'Catat Pelanggaran Siswa'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tanggal Kejadian</label>
                                <input
                                    type="date"
                                    required
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    value={formData.date}
                                    onChange={e => setFormData({...formData, date: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Siswa</label>
                                <select
                                    required
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    value={formData.student_id}
                                    onChange={e => setFormData({...formData, student_id: e.target.value})}
                                >
                                    <option value="">-- Pilih Siswa --</option>
                                    {students && students.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.nisn})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tipe Pelanggaran</label>
                                    <select
                                        required
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        value={formData.violation_type}
                                        onChange={e => setFormData({...formData, violation_type: e.target.value})}
                                    >
                                        <option value="ringan">Ringan</option>
                                        <option value="sedang">Sedang</option>
                                        <option value="berat">Berat</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Poin Sanksi</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        value={formData.points}
                                        onChange={e => setFormData({...formData, points: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Kategori Khusus (Opsional)</label>
                                <input
                                    type="text"
                                    placeholder="Misal: Keterlambatan, Atribut..."
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    value={formData.category}
                                    onChange={e => setFormData({...formData, category: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Deskripsi Lengkap</label>
                                <textarea
                                    required
                                    rows="2"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tindakan / Penanganan (Opsional)</label>
                                <input
                                    type="text"
                                    placeholder="Misal: Diberi teguran lisan"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    value={formData.action_taken}
                                    onChange={e => setFormData({...formData, action_taken: e.target.value})}
                                />
                            </div>

                            <div className="mt-5 sm:mt-6 flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                >
                                    Simpan Pelanggaran
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
