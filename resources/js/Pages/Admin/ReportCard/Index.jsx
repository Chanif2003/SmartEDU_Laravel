import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Award } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';

export default function ReportCardIndex({ auth, students, semesters, filters }) {
    const filterForm = useForm({
        search: filters.search || '',
        class_id: filters.class_id || '',
    });

    const handleFilter = (e) => {
        e.preventDefault();
        filterForm.get(route('admin.report-cards.index'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const activeSemester = semesters.find(s => s.is_active);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl shadow-neon-violet">
                            <Award className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="font-black text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-brand-600 tracking-tight">
                            E-Raport
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="E-Raport" />

            <div className="py-6 md:py-12 relative z-10">
                {/* Ambient Background Blobs */}
                <div className="absolute top-0 -left-40 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob pointer-events-none"></div>
                <div className="absolute top-0 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>
                <div className="absolute -bottom-40 left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-0 sm:px-4 md:px-6 lg:px-8 relative z-10 space-y-6">
                    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <div className="mb-6 md:mb-8">
                            <h3 className="text-lg font-medium mb-4">Data Siswa</h3>
                            <form onSubmit={handleFilter} className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
                                <TextInput 
                                    className="w-full sm:max-w-xs block rounded-xl border-slate-200 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                    placeholder="Cari siswa..."
                                    value={filterForm.data.search}
                                    onChange={e => filterForm.setData('search', e.target.value)}
                                />
                                <PrimaryButton type="submit" className="w-full sm:w-auto justify-center">Cari</PrimaryButton>
                            </form>

                            <div className="overflow-x-auto rounded-2xl border border-slate-100">
                                <table className="hidden md:table min-w-full text-sm text-left text-slate-600">
                                    <thead className="text-xs font-semibold text-slate-500 bg-slate-50/80 uppercase tracking-wider border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4">NISN</th>
                                            <th className="px-6 py-4">Nama Lengkap</th>
                                            <th className="px-6 py-4">Kelas</th>
                                            <th className="px-6 py-4 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.data.map(student => (
                                            <tr key={student.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-800">{student.nisn}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{student.nama_lengkap}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{student.school_class?.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    {activeSemester ? (
                                                        <Link href={route('admin.report-cards.show', [student.id, activeSemester.id])}>
                                                            <SecondaryButton>Buka Raport</SecondaryButton>
                                                        </Link>
                                                    ) : (
                                                        <span className="text-red-500 text-xs px-2 py-1 bg-red-50 rounded-lg">Tidak ada semester aktif</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {students.data.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-8 text-center text-slate-500">Belum ada data siswa.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                {/* Mobile Cards */}
                                <div className="md:hidden flex flex-col gap-3 p-2 bg-slate-50/30">
                                    {students.data.map(student => (
                                        <div key={student.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-bold text-slate-800">{student.nama_lengkap}</p>
                                                    <p className="text-xs text-slate-500">NISN: {student.nisn}</p>
                                                </div>
                                                <span className="px-2.5 py-1 bg-brand-50 text-brand-700 text-[10px] font-bold rounded-lg border border-brand-100 uppercase tracking-wider">
                                                    {student.school_class?.name}
                                                </span>
                                            </div>
                                            <div className="pt-3 mt-1 border-t border-slate-100">
                                                {activeSemester ? (
                                                    <Link href={route('admin.report-cards.show', [student.id, activeSemester.id])} className="w-full">
                                                        <SecondaryButton className="w-full justify-center">Buka Raport</SecondaryButton>
                                                    </Link>
                                                ) : (
                                                    <span className="text-red-500 text-xs block text-center px-2 py-2 bg-red-50 rounded-lg">Tidak ada semester aktif</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {students.data.length === 0 && (
                                        <div className="p-6 text-center text-slate-500 text-sm">Belum ada data siswa.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
