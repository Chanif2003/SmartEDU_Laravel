import React, { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PieChart as PieChartIcon, Search, GraduationCap } from 'lucide-react';
import Pagination from '@/Components/Pagination';

const COLORS = {
    'working': '#10b981', // emerald-500 (Lebih kontras)
    'studying': '#3b82f6', // blue-500
    'entrepreneur': '#f59e0b', // amber-500
    'seeking': '#ef4444', // red-500
    'other': '#8b5cf6', // violet-500
};

const STATUS_LABELS = {
    'working': 'Bekerja',
    'studying': 'Kuliah',
    'entrepreneur': 'Wirausaha',
    'seeking': 'Mencari Kerja',
    'other': 'Lainnya',
};

export default function TracerStudyAdminIndex({ auth, tracerStudies, statistics, yearlyStatistics, filters }) {
    // Detect mobile viewport for per_page
    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        const desiredPerPage = isMobile ? 5 : 10;
        
        if (!filters?.per_page || parseInt(filters.per_page) !== desiredPerPage) {
            router.reload({
                data: { per_page: desiredPerPage },
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['tracerStudies', 'filters'],
                showProgress: false
            });
        }
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        router.get(route('admin.tracer-studies.index'), {
            ...filters,
            [name]: value
        }, { preserveState: true });
    };

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
        const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
      
        return percent > 0 ? (
            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        ) : null;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl shadow-neon-violet">
                            <PieChartIcon className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="font-black text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-brand-600 tracking-tight">
                            Dashboard Tracer Study
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Tracer Study" />

            <div className="py-6 md:py-12 relative z-10">
                {/* Ambient Background Blobs */}
                <div className="absolute top-0 -left-40 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob pointer-events-none"></div>
                <div className="absolute top-0 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>
                <div className="absolute -bottom-40 left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-0 sm:px-4 md:px-6 lg:px-8 relative z-10 space-y-6">
                    
                    {/* Filter and Stats Card */}
                    <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <div className="p-4 sm:p-6 border-b border-gray-200">
                            <div className="mb-6"><h3 className="text-lg font-medium text-gray-900">Statistik Lulusan</h3></div>

                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 mb-4 text-center">Komposisi Status Alumni</h4>
                                    <div className="h-[300px] md:h-[350px] w-full flex justify-center">
                                {statistics && statistics.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={statistics}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={renderCustomizedLabel}
                                                outerRadius="75%"
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {statistics.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[entry.status]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => [`${value} Orang`, 'Jumlah']} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        Tidak ada data statistik untuk filter yang dipilih.
                                    </div>
                                )}
                            </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 mb-4 text-center">Tren Status Lulusan Per Tahun</h4>
                                    <div className="h-[300px] md:h-[350px] w-full mt-2">
                                        {yearlyStatistics && yearlyStatistics.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={yearlyStatistics}
                                                    margin={{ top: 20, right: 10, left: -25, bottom: 5 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                    <XAxis dataKey="year" axisLine={false} tickLine={false} />
                                                    <YAxis axisLine={false} tickLine={false} />
                                                    <Tooltip cursor={{fill: 'transparent'}} />
                                                    <Legend />
                                                    <Bar dataKey="working" stackId="a" name="Bekerja" fill={COLORS.working} radius={[0, 0, 4, 4]} />
                                                    <Bar dataKey="studying" stackId="a" name="Kuliah" fill={COLORS.studying} />
                                                    <Bar dataKey="entrepreneur" stackId="a" name="Wirausaha" fill={COLORS.entrepreneur} />
                                                    <Bar dataKey="seeking" stackId="a" name="Mencari Kerja" fill={COLORS.seeking} />
                                                    <Bar dataKey="other" stackId="a" name="Lainnya" fill={COLORS.other} radius={[4, 4, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-500">
                                                Tidak ada data tahunan tersedia.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Table Card */}
                    <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <div className="p-4 sm:p-6 border-b border-gray-200">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                <h3 className="text-lg font-medium text-gray-900">Detail Data Tracer Study</h3>
                                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                    <input 
                                        type="number" 
                                        name="graduation_year"
                                        placeholder="Tahun Lulus (Contoh: 2026)"
                                        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-sm w-full sm:w-auto"
                                        defaultValue={filters.graduation_year}
                                        onBlur={handleFilterChange}
                                        onKeyDown={e => e.key === 'Enter' && handleFilterChange(e)}
                                    />
                                    <select 
                                        name="status"
                                        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-sm w-full sm:w-auto"
                                        defaultValue={filters.status}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">Semua Status</option>
                                        <option value="working">Bekerja</option>
                                        <option value="studying">Kuliah</option>
                                        <option value="entrepreneur">Wirausaha</option>
                                        <option value="seeking">Mencari Kerja</option>
                                        <option value="other">Lainnya</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="hidden md:table min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Alumni</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun Lulus</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun Update</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instansi/Kampus</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posisi/Jurusan</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penghasilan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {tracerStudies.data.map(item => (
                                            <tr key={item.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {item.student_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.graduation_year || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.entry_year}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-opacity-20`} style={{ 
                                                        color: COLORS[item.status],
                                                        backgroundColor: `${COLORS[item.status]}33`
                                                    }}>
                                                        {STATUS_LABELS[item.status]}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.institution_name || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.position_or_major || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.income_range || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile View */}
                            <div className="md:hidden space-y-4 mt-4">
                                {tracerStudies.data.map(alumni => (
                                    <div key={alumni.id} className="bg-white p-4 rounded-[1.5rem] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] border border-slate-50 flex flex-col">
                                        <div className="flex items-center gap-3.5 ml-1 mb-2">
                                            <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 shrink-0 border-2 border-white shadow-sm">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-slate-800 text-base leading-tight truncate">{alumni.student?.user?.name || alumni.student?.name || '-'}</h3>
                                                <p className="text-xs font-medium text-slate-500 mt-0.5">Lulus {alumni.graduation_year || '-'}</p>
                                            </div>
                                            <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${
                                                alumni.status === 'working' ? 'bg-green-100 text-green-800' : 
                                                alumni.status === 'studying' ? 'bg-blue-100 text-blue-800' : 
                                                alumni.status === 'entrepreneur' ? 'bg-purple-100 text-purple-800' : 
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {alumni.status === 'working' ? 'Bekerja' : alumni.status === 'studying' ? 'Kuliah' : alumni.status === 'entrepreneur' ? 'Wirausaha' : 'Belum Bekerja'}
                                            </span>
                                        </div>
                                        
                                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mt-2 mb-1">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Instansi/Kampus</span>
                                                    <span className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{alumni.institution_name || '-'}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Posisi/Jurusan</span>
                                                    <span className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{alumni.position_or_major || '-'}</span>
                                                </div>
                                                {alumni.income_range && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Penghasilan</span>
                                                    <span className="text-xs font-bold text-slate-700 truncate">{alumni.income_range}</span>
                                                </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            

                            {tracerStudies.data.length === 0 && (
                                    <div className="text-center py-6 text-gray-500">
                                        Tidak ada rekaman data alumni.
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                                <Pagination links={tracerStudies.meta ? tracerStudies.meta.links : tracerStudies.links} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
