import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function TracerStudyPublic() {
    const { flash, errors: pageErrors } = usePage().props;
    const [step, setStep] = useState(1);
    
    // Step 1: Verification
    const { data: verifyData, setData: setVerifyData, post: verifyPost, processing: verifying, errors: verifyErrors } = useForm({
        identity_number: '',
        birth_date: '',
    });

    // Step 2: Questionnaire
    const { data: tracerData, setData: setTracerData, post: tracerPost, processing: saving, errors: tracerErrors, reset: resetTracer } = useForm({
        student_id: '',
        status: 'working',
        institution_name: '',
        position_or_major: '',
        income_range: '',
        contact_number: '',
        notes: '',
    });

    // Handle verification response
    useEffect(() => {
        if (flash?.verified_student) {
            const student = flash.verified_student;
            const existing = student.existing_data;
            
            setTracerData({
                student_id: student.id,
                status: existing?.status || 'working',
                institution_name: existing?.institution_name || '',
                position_or_major: existing?.position_or_major || '',
                income_range: existing?.income_range || '',
                contact_number: existing?.contact_number || '',
                notes: existing?.notes || '',
            });
            setStep(2);
        }
    }, [flash?.verified_student]);

    const handleVerify = (e) => {
        e.preventDefault();
        verifyPost(route('alumni.tracer-study.verify'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        tracerPost(route('alumni.tracer-study.store'), {
            onSuccess: () => {
                setStep(3); // Success step
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center pt-6 sm:pt-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-fixed">
            <div className="absolute inset-0 bg-blue-900/70 backdrop-blur-sm"></div>
            
            <Head title="Tracer Study Alumni" />

            <div className="w-full sm:max-w-xl mt-6 px-6 py-8 bg-white shadow-2xl overflow-hidden sm:rounded-xl relative z-10 mx-4">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Tracer Study Alumni</h2>
                    <p className="text-gray-600 text-sm">
                        Bantu kami melacak jejak langkah Anda setelah lulus.
                    </p>
                </div>

                {/* Step 1: Verification */}
                {step === 1 && (
                    <form onSubmit={handleVerify}>
                        <div className="mb-4 text-sm text-gray-600 bg-blue-50 p-4 rounded-lg border border-blue-100">
                            Silakan masukkan NISN dan Tanggal Lahir Anda untuk memvalidasi data alumni.
                        </div>

                        {pageErrors.verification && (
                            <div className="mb-4 text-sm text-red-600 bg-red-50 p-4 rounded-lg">
                                {pageErrors.verification}
                            </div>
                        )}

                        <div className="mb-4">
                            <InputLabel htmlFor="identity_number" value="Nomor Identitas (NIS/NISN/No. SKL/No. Ijazah)" />
                            <TextInput
                                id="identity_number"
                                type="text"
                                className="mt-1 block w-full"
                                value={verifyData.identity_number}
                                onChange={(e) => setVerifyData('identity_number', e.target.value)}
                                required
                                placeholder="Contoh: 0012345678"
                            />
                            <InputError message={verifyErrors.identity_number} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="birth_date" value="Tanggal Lahir" />
                            <TextInput
                                id="birth_date"
                                type="date"
                                className="mt-1 block w-full"
                                value={verifyData.birth_date}
                                onChange={e => setVerifyData('birth_date', e.target.value)}
                                required
                            />
                            <InputError message={verifyErrors.birth_date} className="mt-2" />
                        </div>

                        <div className="mt-6 flex items-center justify-end">
                            <PrimaryButton className="w-full justify-center py-3" disabled={verifying}>
                                {verifying ? 'Memvalidasi...' : 'Lanjutkan Pengisian'}
                            </PrimaryButton>
                        </div>
                    </form>
                )}

                {/* Step 2: Questionnaire */}
                {step === 2 && (
                    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up">
                        <div className="bg-green-50 text-green-800 p-4 rounded-lg text-sm mb-6 border border-green-200">
                            <strong>Selamat Datang, {flash.verified_student?.full_name}!</strong>
                            <br />
                            Alumni Angkatan: {flash.verified_student?.graduation_year || '-'}
                            {flash.verified_student?.existing_data && (
                                <span className="block mt-1 text-xs">Anda sudah pernah mengisi untuk tahun ini. Menyimpan form akan memperbarui data Anda.</span>
                            )}
                        </div>

                        <div>
                            <InputLabel htmlFor="status" value="Status Saat Ini" />
                            <select
                                id="status"
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                value={tracerData.status}
                                onChange={e => setTracerData('status', e.target.value)}
                                required
                            >
                                <option value="working">Bekerja</option>
                                <option value="studying">Kuliah / Studi Lanjut</option>
                                <option value="entrepreneur">Wirausaha</option>
                                <option value="seeking">Mencari Kerja</option>
                                <option value="other">Lainnya</option>
                            </select>
                            <InputError message={tracerErrors.status} className="mt-2" />
                        </div>

                        {/* Conditional Fields based on status */}
                        {['working', 'studying', 'entrepreneur'].includes(tracerData.status) && (
                            <>
                                <div>
                                    <InputLabel 
                                        htmlFor="institution_name" 
                                        value={
                                            tracerData.status === 'working' ? 'Nama Perusahaan' : 
                                            (tracerData.status === 'studying' ? 'Nama Kampus/Universitas' : 'Nama Usaha')
                                        } 
                                    />
                                    <TextInput
                                        id="institution_name"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={tracerData.institution_name}
                                        onChange={e => setTracerData('institution_name', e.target.value)}
                                        required
                                    />
                                    <InputError message={tracerErrors.institution_name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel 
                                        htmlFor="position_or_major" 
                                        value={
                                            tracerData.status === 'working' ? 'Posisi / Jabatan' : 
                                            (tracerData.status === 'studying' ? 'Program Studi / Jurusan' : 'Bidang Usaha')
                                        } 
                                    />
                                    <TextInput
                                        id="position_or_major"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={tracerData.position_or_major}
                                        onChange={e => setTracerData('position_or_major', e.target.value)}
                                        required={tracerData.status !== 'entrepreneur'}
                                    />
                                    <InputError message={tracerErrors.position_or_major} className="mt-2" />
                                </div>
                            </>
                        )}

                        {['working', 'entrepreneur'].includes(tracerData.status) && (
                            <div>
                                <InputLabel htmlFor="income_range" value="Rentang Penghasilan per Bulan" />
                                <select
                                    id="income_range"
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    value={tracerData.income_range}
                                    onChange={e => setTracerData('income_range', e.target.value)}
                                >
                                    <option value="">-- Pilih --</option>
                                    <option value="< 3 Juta">Kurang dari Rp 3.000.000</option>
                                    <option value="3 - 5 Juta">Rp 3.000.000 - Rp 5.000.000</option>
                                    <option value="5 - 10 Juta">Rp 5.000.000 - Rp 10.000.000</option>
                                    <option value="> 10 Juta">Lebih dari Rp 10.000.000</option>
                                </select>
                                <InputError message={tracerErrors.income_range} className="mt-2" />
                            </div>
                        )}

                        <div>
                            <InputLabel htmlFor="contact_number" value="Nomor HP/WA Aktif (Opsional)" />
                            <TextInput
                                id="contact_number"
                                type="text"
                                className="mt-1 block w-full"
                                value={tracerData.contact_number}
                                onChange={e => setTracerData('contact_number', e.target.value)}
                            />
                            <InputError message={tracerErrors.contact_number} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="notes" value="Pesan Kesan / Catatan (Opsional)" />
                            <textarea
                                id="notes"
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                rows="3"
                                value={tracerData.notes}
                                onChange={e => setTracerData('notes', e.target.value)}
                            />
                            <InputError message={tracerErrors.notes} className="mt-2" />
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <button 
                                type="button" 
                                onClick={() => setStep(1)}
                                className="text-sm text-gray-600 hover:text-gray-900 underline"
                            >
                                Kembali
                            </button>
                            <PrimaryButton disabled={saving}>
                                {saving ? 'Menyimpan...' : 'Simpan Kuesioner'}
                            </PrimaryButton>
                        </div>
                    </form>
                )}

                {/* Step 3: Success */}
                {step === 3 && (
                    <div className="text-center py-8 animate-fade-in-up">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Terima Kasih!</h3>
                        <p className="text-gray-600 mb-8">
                            {flash.success || 'Data tracer study Anda telah berhasil disimpan. Semoga sukses selalu untuk perjalanan karir Anda!'}
                        </p>
                        <button 
                            onClick={() => {
                                setStep(1);
                                setVerifyData('nisn', '');
                                setVerifyData('birth_date', '');
                            }}
                            className="text-indigo-600 font-semibold hover:text-indigo-800"
                        >
                            Selesai & Kembali
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
