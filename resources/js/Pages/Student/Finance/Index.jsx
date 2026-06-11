import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { CreditCard, Calendar, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Index({ auth, payments }) {
    const formatRp = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Pembayaran SPP" />
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-neon-amber">
                        <CreditCard className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-amber-600">
                            Pembayaran SPP
                        </h1>
                        <p className="text-slate-500 font-medium">Pantau tagihan dan riwayat pembayaran SPP Anda.</p>
                    </div>
                </div>

                {/* Desktop View: Table */}
                <div className="hidden md:block bg-white rounded-3xl shadow-glass border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-4 text-sm font-black text-slate-600 uppercase tracking-wider">Periode</th>
                                    <th className="p-4 text-sm font-black text-slate-600 uppercase tracking-wider">Jumlah Tagihan</th>
                                    <th className="p-4 text-sm font-black text-slate-600 uppercase tracking-wider">Tanggal Bayar</th>
                                    <th className="p-4 text-sm font-black text-slate-600 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments && payments.data && payments.data.length > 0 ? (
                                    payments.data.map((payment) => (
                                        <tr key={payment.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-bold text-slate-800">{payment.month} {payment.year}</td>
                                            <td className="p-4 font-bold text-slate-600">{formatRp(payment.amount)}</td>
                                            <td className="p-4 text-slate-500 font-medium">
                                                {payment.payment_date ? (
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4"/> {payment.payment_date}
                                                    </div>
                                                ) : '-'}
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                                    payment.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {payment.status === 'Paid' ? <CheckCircle className="w-3.5 h-3.5"/> : <Clock className="w-3.5 h-3.5"/>}
                                                    {payment.status === 'Paid' ? 'Lunas' : 'Belum Lunas'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-slate-400">Belum ada data tagihan SPP.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile View: Cards */}
                <div className="md:hidden space-y-4">
                    {payments && payments.data && payments.data.length > 0 ? (
                        payments.data.map((payment) => (
                            <div key={payment.id} className="bg-white rounded-2xl shadow-glass border border-slate-200 p-5 flex flex-col gap-3">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <div className="font-black text-slate-800 text-lg">
                                        {payment.month} {payment.year}
                                    </div>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                        payment.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                        {payment.status === 'Paid' ? <CheckCircle className="w-3.5 h-3.5"/> : <Clock className="w-3.5 h-3.5"/>}
                                        {payment.status === 'Paid' ? 'Lunas' : 'Belum Lunas'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    <div className="text-sm font-bold text-slate-500">Jumlah Tagihan</div>
                                    <div className="text-base font-black text-slate-800">{formatRp(payment.amount)}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="text-sm font-bold text-slate-500">Tanggal Bayar</div>
                                    <div className="text-sm font-medium text-slate-600 flex items-center gap-1">
                                        {payment.payment_date ? (
                                            <><Calendar className="w-3.5 h-3.5 text-slate-400"/> {payment.payment_date}</>
                                        ) : '-'}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-2xl shadow-glass border border-slate-200 p-8 text-center text-slate-400">
                            Belum ada data tagihan SPP.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
