import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line } from 'recharts';
import { Calendar, Download, RefreshCw, FileText, CheckCircle, AlertCircle, Wallet, ShieldAlert, Star } from 'lucide-react';
import axios from 'axios';

export default function ReportIndex() {
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({ attendance: [], finance: [], violations: { byType: [], trend: [] }, evaluations: { trend: [], distribution: [], topTeachers: [] } });
    const [error, setError] = useState('');

    const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#6b7280', '#3b82f6'];

    const fetchData = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await axios.get(route('admin.reports.summary'), {
                params: { start_date: startDate, end_date: endDate }
            });
            setData(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memuat data laporan');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleExport = (type) => {
        window.open(route('admin.reports.export-pdf', { start_date: startDate, end_date: endDate, type }), '_blank');
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Pelaporan Global</h2>}>
            <Head title="Pelaporan Global" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Filter Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-end justify-between">
                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Mulai</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="border-slate-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Akhir</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="border-slate-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 w-full"
                                />
                            </div>
                            <button
                                onClick={fetchData}
                                disabled={isLoading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
                            >
                                {isLoading ? <RefreshCw className="animate-spin" size={18} /> : <Calendar size={18} />}
                                Terapkan Filter
                            </button>
                        </div>
                        <button
                            onClick={() => handleExport('all')}
                            className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 flex items-center justify-center gap-2 font-medium shrink-0 w-full md:w-auto"
                        >
                            <Download size={18} /> Export Semua (PDF)
                        </button>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-center gap-3">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Reports Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Attendance Report */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-0"></div>
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <CheckCircle className="text-blue-500" size={20} /> Kehadiran Siswa
                                    </h3>
                                    <p className="text-sm text-slate-500">Statistik presensi harian</p>
                                </div>
                                <button onClick={() => handleExport('attendance')} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                                    <Download size={18} />
                                </button>
                            </div>

                            {data.attendance.length > 0 ? (
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsPieChart>
                                            <Pie
                                                data={data.attendance}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {data.attendance.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-[300px] flex items-center justify-center text-slate-400">Belum ada data kehadiran</div>
                            )}
                        </div>

                        {/* Finance Report */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0"></div>
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <Wallet className="text-emerald-500" size={20} /> Keuangan (SPP)
                                    </h3>
                                    <p className="text-sm text-slate-500">Pemasukan SPP per Bulan Tagihan</p>
                                </div>
                                <button onClick={() => handleExport('finance')} className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg transition-colors">
                                    <Download size={18} />
                                </button>
                            </div>

                            {data.finance.length > 0 ? (
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={data.finance} margin={{ top: 10, right: 10, left: 20, bottom: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="billing_month" axisLine={false} tickLine={false} />
                                            <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `Rp${val/1000000}M`} />
                                            <Tooltip formatter={(val) => formatRupiah(val)} />
                                            <Bar dataKey="total_income" fill="#10b981" radius={[4, 4, 0, 0]} name="Total Pemasukan" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-[300px] flex items-center justify-center text-slate-400">Belum ada data pembayaran</div>
                            )}
                        </div>

                        {/* Violations Stats */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden lg:col-span-2">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -z-0"></div>
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <ShieldAlert className="text-red-500" size={20} /> Kedisiplinan
                                    </h3>
                                    <p className="text-sm text-slate-500">Tren pelanggaran siswa</p>
                                </div>
                                <button onClick={() => handleExport('violations')} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors">
                                    <Download size={18} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-1">
                                    <h4 className="text-sm font-semibold text-slate-600 mb-4">Sebaran Berdasarkan Tingkat</h4>
                                    {data.violations.byType.length > 0 ? (
                                        <div className="space-y-4">
                                            {data.violations.byType.map((v, i) => (
                                                <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                                    <span className="capitalize font-medium text-slate-700">{v.violation_type}</span>
                                                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">{v.total} Kasus</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-slate-400 text-sm">Tidak ada catatan pelanggaran</div>
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <h4 className="text-sm font-semibold text-slate-600 mb-4">Tren Pelanggaran</h4>
                                    {data.violations.trend.length > 0 ? (
                                        <div className="h-[250px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={data.violations.trend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                    <XAxis dataKey="date" axisLine={false} tickLine={false} />
                                                    <YAxis axisLine={false} tickLine={false} />
                                                    <Tooltip />
                                                    <Line type="monotone" dataKey="total" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Total Kasus" />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <div className="h-[250px] flex items-center justify-center text-slate-400">Tidak ada tren pelanggaran</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* KPI Stats */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden lg:col-span-2 mt-6">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-0"></div>
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <Star className="text-amber-500" size={20} /> Evaluasi & KPI Guru
                                    </h3>
                                    <p className="text-sm text-slate-500">Statistik performa dan penilaian guru</p>
                                </div>
                                <button onClick={() => handleExport('evaluations')} className="text-amber-600 hover:bg-amber-50 p-2 rounded-lg transition-colors">
                                    <Download size={18} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-1">
                                    <h4 className="text-sm font-semibold text-slate-600 mb-4">Distribusi Nilai KPI</h4>
                                    {data.evaluations.distribution.length > 0 ? (
                                        <div className="h-[250px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RechartsPieChart>
                                                    <Pie
                                                        data={data.evaluations.distribution}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={40}
                                                        outerRadius={80}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                        label={({ name, percent }) => percent > 0 ? `${(percent * 100).toFixed(0)}%` : ''}
                                                    >
                                                        {data.evaluations.distribution.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#f59e0b', '#ef4444'][index % 4]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                    <Legend />
                                                </RechartsPieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <div className="text-slate-400 text-sm h-[250px] flex items-center justify-center">Belum ada data evaluasi</div>
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <h4 className="text-sm font-semibold text-slate-600 mb-4">Tren Rata-rata Nilai KPI</h4>
                                    {data.evaluations.trend.length > 0 ? (
                                        <div className="h-[250px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={data.evaluations.trend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                                                    <Tooltip />
                                                    <Line type="monotone" dataKey="average_score" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Rata-rata Nilai" />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <div className="h-[250px] flex items-center justify-center text-slate-400">Tidak ada tren evaluasi</div>
                                    )}
                                </div>
                            </div>
                            
                            {data.evaluations.topTeachers?.length > 0 && (
                                <div className="mt-8 border-t border-slate-100 pt-6 relative z-10">
                                    <h4 className="text-sm font-semibold text-slate-600 mb-4">Top 5 Guru dengan KPI Tertinggi</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                        {data.evaluations.topTeachers.map((t, i) => (
                                            <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                                                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-2 font-bold shadow-sm">
                                                    #{i+1}
                                                </div>
                                                <div className="font-semibold text-slate-800 text-sm truncate" title={t.teacher?.nama_lengkap}>{t.teacher?.nama_lengkap}</div>
                                                <div className="text-xs font-bold text-amber-600 mt-1">Skor: {Number(t.average_score).toFixed(1)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
