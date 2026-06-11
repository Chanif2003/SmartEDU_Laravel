import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { Wallet } from 'lucide-react';
import PaymentModal from './PaymentModal';
import Pagination from '@/Components/Pagination';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const STATUS_COLORS = {
    'Lunas': '#10b981',
    'Belum Lunas': '#f43f5e',
    'Dibebaskan': '#3b82f6'
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

export default function Index({ payments, classes, filters, totalPaidThisMonth, statistics }) {
    const { flash = {} } = usePage().props;
    const isTunggakanMode = filters.search && filters.status === 'unpaid';
    const [selectedPayment, setSelectedPayment] = useState(null);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        router.get(
            route('admin.finance.spp.index'),
            { ...filters, [name]: value },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleGenerate = () => {
        const monthToGenerate = filters.billing_month || new Date().toISOString().slice(0, 7);
        if (confirm(`Apakah Anda yakin ingin meng-generate tagihan SPP untuk bulan ${monthToGenerate}? Tagihan yang sudah ada tidak akan di-duplikat.`)) {
            router.post(route('admin.finance.spp.generate'), { billing_month: monthToGenerate }, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl shadow-neon-violet">
                            <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="font-black text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-brand-600 tracking-tight">
                            Keuangan - SPP
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Keuangan - SPP" />

            <div className="py-6 md:py-12 relative z-10">
                {/* Ambient Background Blobs */}
                <div className="absolute top-0 -left-40 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob pointer-events-none"></div>
                <div className="absolute top-0 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>
                <div className="absolute -bottom-40 left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-0 sm:px-4 md:px-6 lg:px-8 relative z-10 space-y-6">

                    {/* Statistik SPP Card */}
                    {!isTunggakanMode && statistics && (
                        <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-6">Statistik Pembayaran SPP</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 mb-4 text-center">Distribusi Status Pembayaran</h4>
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
                                                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#cbd5e1'} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip formatter={(value) => [`${value} Siswa`, 'Jumlah']} />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 mb-4 text-center">Pendapatan SPP Per Bulan</h4>
                                    <div className="h-[300px] w-full flex justify-center">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={statistics.monthly_revenue} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                                <YAxis 
                                                    axisLine={false} 
                                                    tickLine={false} 
                                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                                    tickFormatter={(value) => `Rp${(value / 1000000).toFixed(1)}Jt`}
                                                />
                                                <RechartsTooltip 
                                                    cursor={{ fill: 'transparent' }} 
                                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                    formatter={(value) => [new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value), 'Total']}
                                                />
                                                <Bar dataKey="value" name="Pemasukan" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Summary Card & Actions */}
                    {!isTunggakanMode && (
                        
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-emerald-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-emerald-100 p-3 rounded-full">
                                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Pemasukan Bulan {filters.billing_month}</p>
                                <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalPaidThisMonth)}</p>
                            </div>
                        </div>
                        <div className="w-full md:w-auto">
<button onClick={handleGenerate}
                                className="w-full md:w-auto justify-center inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                Generate Tagihan Bulan {filters.billing_month || 'Ini'}
                            </button>
                        </div>
                    </div>
                    )}
                    {/* Tunggakan Header */}
                    {isTunggakanMode && (
                        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-rose-600">Rincian Tunggakan Siswa</h3>
                                <p className="text-sm text-slate-500 mt-1">Menampilkan tagihan yang belum lunas untuk pencarian: <strong className="text-slate-800">{filters.search}</strong></p>
                            </div>
                            <button 
                                onClick={() => router.get(route('admin.finance.spp.index'))}
                                className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                Kembali ke Daftar SPP
                            </button>
                        </div>
                    )}
                    {/* Flash Messages */}
                    {flash.success && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                            <p>{flash.success}</p>
                        </div>
                    )}
                    {flash.error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                            <p>{flash.error}</p>
                        </div>
                    )}

                    {/* Filter Bar */}
                    {!isTunggakanMode && (
                    <div className="bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] border border-slate-100 p-6">

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Bulan Tagihan</label>
                                <div className="mt-1">
                                    <input
                                        type="month"
                                        name="billing_month"
                                        value={filters.billing_month || ''}
                                        onChange={handleFilterChange}
                                        className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    name="status"
                                    value={filters.status || ''}
                                    onChange={handleFilterChange}
                                    className="mt-1 block w-full rounded-xl border-slate-200 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="unpaid">Belum Lunas (Unpaid)</option>
                                    <option value="paid">Lunas (Paid)</option>
                                    <option value="waived">Beasiswa (Waived)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Kelas</label>
                                <select
                                    name="class_id"
                                    value={filters.class_id || ''}
                                    onChange={handleFilterChange}
                                    className="mt-1 block w-full rounded-xl border-slate-200 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                                >
                                    <option value="">Semua Kelas</option>
                                    {classes.map((cls) => (
                                        <option key={cls.id} value={cls.id}>{cls.nama_kelas}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Cari Siswa</label>
                                <input
                                    type="text"
                                    name="search"
                                    value={filters.search || ''}
                                    onChange={handleFilterChange}
                                    placeholder="Nama atau NISN..."
                                    className="mt-1 block w-full rounded-xl border-slate-200 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                                />
                            </div>
                        </div>
                    </div>
                    )}
                    {/* Data Table */}
                    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <div className="overflow-x-auto rounded-2xl border border-slate-100">
                            <table className="hidden md:table min-w-full text-sm text-left text-slate-600">
                                <thead className="text-xs font-semibold text-slate-500 bg-slate-50/80 uppercase tracking-wider border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4">Siswa</th>
                                        <th className="px-6 py-4">Kelas</th>
                                        <th className="px-6 py-4">Tagihan</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.data.length > 0 ? (
                                        payments.data.map((payment) => (
                                            <tr key={payment.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-slate-800">{payment.student?.nama_lengkap}</div>
                                                    <div className="text-xs text-slate-500 flex items-center space-x-2 mt-1">
                                                        <span>NISN: {payment.student?.nisn}</span>
                                                        {payment.student?.unpaid_months > 0 && (
                                                            <a 
                                                                href={route('admin.finance.spp.index', { search: payment.student.nisn, status: 'unpaid', billing_month: '' })}
                                                                className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 transition-colors"
                                                                title="Lihat semua tunggakan siswa ini"
                                                            >
                                                                Tunggakan ({payment.student.unpaid_months})
                                                            </a>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                                                    {payment.student?.school_class?.nama_kelas || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-bold text-slate-800">{formatCurrency(payment.amount)}</div>
                                                    {payment.payment_date && (
                                                        <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Tgl: {payment.payment_date}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-1 inline-flex text-[10px] uppercase font-bold rounded-lg border ${
                                                        payment.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                        payment.status === 'waived' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                        'bg-rose-50 text-rose-700 border-rose-200'
                                                    }`}>
                                                        {payment.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    {payment.status === 'unpaid' && (
                                                        <button
                                                            onClick={() => setSelectedPayment(payment)}
                                                            className="text-brand-600 hover:text-brand-700 font-bold bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-xl transition-colors text-xs"
                                                        >
                                                            Bayar
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                                                Tidak ada data tagihan SPP ditemukan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Mobile Cards */}
                            <div className="md:hidden flex flex-col gap-3 p-2 bg-slate-50/30">
                                {payments.data.length > 0 ? (
                                    payments.data.map((payment) => (
                                        <div key={payment.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-bold text-slate-800">{payment.student?.nama_lengkap}</p>
                                                    <p className="text-xs text-slate-500">NISN: {payment.student?.nisn}</p>
                                                    {payment.student?.unpaid_months > 0 && (
                                                        <a 
                                                            href={route('admin.finance.spp.index', { search: payment.student.nisn, status: 'unpaid', billing_month: '' })}
                                                            className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 border border-red-100 text-red-600 mt-1"
                                                        >
                                                            Tunggakan ({payment.student.unpaid_months})
                                                        </a>
                                                    )}
                                                </div>
                                                <span className="px-2.5 py-1 bg-brand-50 text-brand-700 text-[10px] font-bold rounded-lg border border-brand-100 uppercase tracking-wider text-right">
                                                    {payment.student?.school_class?.nama_kelas || '-'}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <div>
                                                    <p className="text-[10px] text-slate-500 font-semibold uppercase">Tagihan</p>
                                                    <p className="font-bold text-slate-800">{formatCurrency(payment.amount)}</p>
                                                    {payment.payment_date && (
                                                        <p className="text-[10px] text-slate-500 mt-0.5">Tgl: {payment.payment_date}</p>
                                                    )}
                                                </div>
                                                <span className={`px-2.5 py-1 inline-flex text-[10px] uppercase font-bold rounded-lg border ${
                                                    payment.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                    payment.status === 'waived' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    'bg-rose-50 text-rose-700 border-rose-200'
                                                }`}>
                                                    {payment.status}
                                                </span>
                                            </div>

                                            {payment.status === 'unpaid' && (
                                                <button
                                                    onClick={() => setSelectedPayment(payment)}
                                                    className="w-full text-brand-600 hover:text-brand-700 font-bold bg-brand-50 hover:bg-brand-100 px-4 py-2.5 rounded-xl transition-colors text-xs flex justify-center"
                                                >
                                                    Bayar SPP
                                                </button>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-slate-500 text-sm">Tidak ada data tagihan SPP ditemukan.</div>
                                )}
                            </div>
                        </div>
                        
                        {/* Pagination */}
                        <div className="mt-4">
                            <Pagination links={payments.links} />
                        </div>
                    </div>
                </div>
            </div>

            <PaymentModal
                show={selectedPayment !== null}
                onClose={() => setSelectedPayment(null)}
                payment={selectedPayment}
            />
        </AuthenticatedLayout>
    );
}
