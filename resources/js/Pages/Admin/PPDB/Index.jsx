import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Users, Search, CheckCircle, XCircle, Clock, GraduationCap } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const STATUS_COLORS = {
    'Pending': '#facc15',   // yellow-400
    'Direview': '#60a5fa',  // blue-400
    'Diterima': '#4ade80',  // green-400
    'Ditolak': '#f87171'    // red-400
};

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

export default function AdminPPDBIndex({ auth, applicants, filters, statistics }) {
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        router.get(route('admin.ppdb.index'), {
            ...filters,
            [name]: value
        }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl shadow-neon-violet">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="font-black text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-brand-600 tracking-tight">
                            Manajemen PPDB
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Manajemen PPDB" />

            <div className="py-6 md:py-12 relative z-10">
                {/* Ambient Background Blobs */}
                <div className="absolute top-0 -left-40 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob pointer-events-none"></div>
                <div className="absolute top-0 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>
                <div className="absolute -bottom-40 left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-0 sm:px-4 md:px-6 lg:px-8 relative z-10 space-y-6">
                    
                    {/* Statistik PPDB Card */}
                    {statistics && (
                        <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-6">Statistik Pendaftar</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 mb-4 text-center">Status Pendaftaran</h4>
                                    <div className="h-[300px] w-full flex justify-center">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={statistics.status_distribution}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={renderCustomizedLabel}
                                                    outerRadius="75%"
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {statistics.status_distribution.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name]} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip formatter={(value) => [`${value} Calon Siswa`, 'Jumlah']} />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 mb-4 text-center">Sebaran Pilihan Jurusan</h4>
                                    <div className="h-[300px] w-full flex justify-center">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={statistics.major_distribution}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={renderCustomizedLabel}
                                                    outerRadius="75%"
                                                    fill="#8b5cf6"
                                                    dataKey="value"
                                                >
                                                    {statistics.major_distribution.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={Object.values(STATUS_COLORS)[index % 4]} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip formatter={(value) => [`${value} Pendaftar`, 'Jumlah']} />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                            
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                    <input 
                                        type="text" 
                                        name="search"
                                        placeholder="Cari Nama / No Registrasi"
                                        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-full sm:w-auto"
                                        defaultValue={filters.search}
                                        onBlur={handleFilterChange}
                                        onKeyDown={e => e.key === 'Enter' && handleFilterChange(e)}
                                    />
                                    <select 
                                        name="status"
                                        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-full sm:w-auto"
                                        defaultValue={filters.status}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">Semua Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="reviewed">Reviewed</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-2xl border border-slate-100">
                                <table className="hidden md:table w-full text-sm text-left text-slate-600">
                                    <thead className="text-xs font-semibold text-slate-500 bg-slate-50/80 uppercase tracking-wider border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4">No. Reg</th>
                                            <th className="px-6 py-4">Nama Lengkap</th>
                                            <th className="px-6 py-4">Jurusan</th>
                                            <th className="px-6 py-4">Tanggal Daftar</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applicants.data.map(applicant => (
                                            <tr key={applicant.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-900">
                                                    {applicant.registration_number}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {applicant.full_name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {applicant.major?.name || '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {new Date(applicant.created_at).toLocaleDateString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 inline-flex text-[11px] leading-5 font-black uppercase tracking-widest rounded-lg ${
                                                        applicant.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        applicant.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                                                        applicant.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {applicant.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link href={route('admin.ppdb.show', applicant.id)}>
                                                        <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/20">Detail</button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    
                                </tbody>
                            </table>
                            </div>

                            {/* Mobile View */}
                            <div className="md:hidden space-y-4 mt-4">
                                {applicants.data.map(applicant => (
                                    <div key={applicant.id} className="bg-white p-4 rounded-[1.5rem] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] border border-slate-50 flex flex-col">
                                        <div className="flex items-center gap-3.5 ml-1">
                                            <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 shrink-0 border-2 border-white shadow-sm">
                                                <GraduationCap className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-slate-800 text-base leading-tight truncate">{applicant.full_name}</h3>
                                                <p className="text-xs font-medium text-slate-500 mt-0.5">{applicant.registration_number}</p>
                                            </div>
                                            <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${
                                                applicant.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                                applicant.status === 'reviewed' ? 'bg-blue-100 text-blue-800' : 
                                                applicant.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {applicant.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-50 ml-1">
                                            <span className="mr-auto px-2.5 py-1 text-xs font-bold bg-slate-50 text-slate-600 rounded-lg">
                                                {applicant.major?.name || '-'}
                                            </span>
                                            <Link href={route('admin.ppdb.show', applicant.id)}>
                                                <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/20">
                                                    Detail
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            {applicants.data.length === 0 && (
                                    <div className="text-center py-6 text-gray-500">
                                        Belum ada data pendaftar.
                                    </div>
                                )}
                                                        </div>
                        </div>
                    </div>
                </div>
        </AuthenticatedLayout>
    );
}
