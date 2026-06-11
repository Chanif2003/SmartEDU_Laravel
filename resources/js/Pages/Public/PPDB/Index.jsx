import React, { useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function PPDBIndex({ majors }) {
    const { data, setData, post, processing, errors } = useForm({
        full_name: '',
        email: '',
        phone: '',
        birth_date: '',
        address: '',
        major_id: '',
        document_kk: null,
        document_ijazah: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('ppdb.store'), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <GuestLayout>
            <Head title="Pendaftaran Peserta Didik Baru (PPDB)" />

            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Formulir PPDB</h2>
                <p className="text-sm text-gray-600 mt-1">Silakan lengkapi data diri Anda dengan benar.</p>
            </div>

            <form onSubmit={submit} encType="multipart/form-data">
                <div>
                    <InputLabel htmlFor="full_name" value="Nama Lengkap" />
                    <TextInput
                        id="full_name"
                        type="text"
                        name="full_name"
                        value={data.full_name}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e) => setData('full_name', e.target.value)}
                        required
                    />
                    <InputError message={errors.full_name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email (Opsional)" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="phone" value="No. WhatsApp / Telepon" />
                    <TextInput
                        id="phone"
                        type="text"
                        name="phone"
                        value={data.phone}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('phone', e.target.value)}
                        required
                    />
                    <InputError message={errors.phone} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="birth_date" value="Tanggal Lahir" />
                    <TextInput
                        id="birth_date"
                        type="date"
                        name="birth_date"
                        value={data.birth_date}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('birth_date', e.target.value)}
                        required
                    />
                    <InputError message={errors.birth_date} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="address" value="Alamat Lengkap" />
                    <textarea
                        id="address"
                        name="address"
                        value={data.address}
                        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full"
                        onChange={(e) => setData('address', e.target.value)}
                        required
                        rows="3"
                    ></textarea>
                    <InputError message={errors.address} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="major_id" value="Pilihan Jurusan (Opsional)" />
                    <select
                        id="major_id"
                        name="major_id"
                        value={data.major_id}
                        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full"
                        onChange={(e) => setData('major_id', e.target.value)}
                    >
                        <option value="">-- Pilih Jurusan --</option>
                        {majors.map((major) => (
                            <option key={major.id} value={major.id}>{major.name}</option>
                        ))}
                    </select>
                    <InputError message={errors.major_id} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="document_kk" value="Upload Kartu Keluarga (Max 10MB)" />
                    <input
                        id="document_kk"
                        type="file"
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        onChange={(e) => setData('document_kk', e.target.files[0])}
                        required
                        accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <InputError message={errors.document_kk} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="document_ijazah" value="Upload Ijazah / SKL (Max 10MB)" />
                    <input
                        id="document_ijazah"
                        type="file"
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        onChange={(e) => setData('document_ijazah', e.target.files[0])}
                        required
                        accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <InputError message={errors.document_ijazah} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-6">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        {processing ? 'Memproses...' : 'Daftar Sekarang'}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
