import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function AdminPPDBShow({ auth, applicant }) {
    const { data } = applicant;
    const approveForm = useForm({});
    const rejectForm = useForm({});

    const handleApprove = () => {
        if(confirm('Apakah Anda yakin ingin menyetujui pendaftar ini? Siswa akan otomatis dibuatkan akun.')) {
            approveForm.post(route('admin.ppdb.approve', data.id), {
                preserveScroll: true
            });
        }
    };

    const handleReject = () => {
        if(confirm('Apakah Anda yakin ingin menolak pendaftar ini?')) {
            rejectForm.post(route('admin.ppdb.reject', data.id), {
                preserveScroll: true
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl shadow-neon-violet">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        </div>
                        <h2 className="font-black text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-brand-600 tracking-tight">
                            Detail Pendaftar: {data.full_name}
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title={`Detail Pendaftar - ${data.registration_number}`} />

            <div className="py-6 md:py-12 relative z-10">
                {/* Ambient Background Blobs */}
                <div className="absolute top-0 -left-40 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob pointer-events-none"></div>
                <div className="absolute top-0 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-0 sm:px-4 md:px-6 lg:px-8">
                    
                    <div className="mb-6 flex flex-wrap gap-4 ml-1">
                        <Link href={route('admin.ppdb.index')}>
                            <SecondaryButton>&larr; Kembali</SecondaryButton>
                        </Link>
                        
                        {data.status !== 'accepted' && data.status !== 'rejected' && (
                            <>
                                <PrimaryButton onClick={handleApprove} disabled={approveForm.processing} className="bg-green-600 hover:bg-green-700">
                                    {approveForm.processing ? 'Memproses...' : 'Approve (Terima)'}
                                </PrimaryButton>
                                <DangerButton onClick={handleReject} disabled={rejectForm.processing}>
                                    {rejectForm.processing ? 'Memproses...' : 'Reject (Tolak)'}
                                </DangerButton>
                            </>
                        )}
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl sm:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden mb-6">
                        <div className="p-4 md:p-8 border-b border-slate-100">
                            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Informasi Biodata</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nomor Registrasi</p>
                                    <p className="font-bold text-slate-800">{data.registration_number}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-black uppercase tracking-widest rounded-lg ${
                                        data.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        data.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                                        data.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {data.status}
                                    </span>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 lg:col-span-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nama Lengkap</p>
                                    <p className="font-bold text-slate-800">{data.full_name}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 lg:col-span-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Jurusan</p>
                                    <p className="font-bold text-slate-800">{data.major?.name || '-'}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">No. WhatsApp</p>
                                    <p className="font-bold text-slate-800">{data.phone}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                                    <p className="font-bold text-slate-800 truncate">{data.email || '-'}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal Lahir</p>
                                    <p className="font-bold text-slate-800">{data.birth_date}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 lg:col-span-3">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Alamat</p>
                                    <p className="font-bold text-slate-800 leading-relaxed">{data.address}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 md:p-8 bg-slate-50/50">
                            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg> Dokumen Terlampir</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                
                                {data.documents_path?.kk && (
                                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-brand-300 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">Kartu Keluarga (KK)</p>
                                                <p className="text-xs font-medium text-slate-500 mt-0.5">PDF Document</p>
                                            </div>
                                        </div>
                                        <a href={`/${data.documents_path.kk}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-all active:scale-95">
                                            Lihat
                                        </a>
                                    </div>
                                )}

                                {data.documents_path?.ijazah && (
                                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-brand-300 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">Ijazah / SKL</p>
                                                <p className="text-xs font-medium text-slate-500 mt-0.5">PDF Document</p>
                                            </div>
                                        </div>
                                        <a href={`/${data.documents_path.ijazah}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-all active:scale-95">
                                            Lihat
                                        </a>
                                    </div>
                                )}

                                {!data.documents_path && (
                                    <p className="text-gray-500">Tidak ada dokumen.</p>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
