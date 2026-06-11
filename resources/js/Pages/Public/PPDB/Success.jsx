import React from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function PPDBSucceess({ applicant }) {
    return (
        <GuestLayout>
            <Head title="Pendaftaran Berhasil" />

            <div className="text-center">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil!</h2>
                <p className="text-gray-600 mb-6">
                    Terima kasih, {applicant.full_name}. Data pendaftaran Anda telah kami terima dan sedang dalam proses verifikasi.
                </p>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-left">
                    <p className="text-sm text-gray-500 mb-1">Nomor Registrasi Anda:</p>
                    <p className="text-lg font-mono font-bold text-indigo-600 tracking-wider">
                        {applicant.registration_number}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                        *Simpan nomor ini untuk keperluan pengecekan status pendaftaran nantinya.
                    </p>
                </div>

                <div className="flex justify-center">
                    <Link href="/">
                        <PrimaryButton>Kembali ke Beranda</PrimaryButton>
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
