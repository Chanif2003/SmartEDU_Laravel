import React from 'react';
import { useForm } from '@inertiajs/react';

export default function Form({ schedule, students, existingRecords, presenceRecords = [], onSuccess }) {
    // Generate initial records: merge existing or default based on QR
    const initialRecords = students.map(student => {
        const existing = existingRecords?.find(r => r.student_id === student.id);
        const presence = presenceRecords?.find(pr => pr.person_id === student.id);
        
        let defaultStatus = 'Alpa';
        if (presence && presence.check_in) {
            defaultStatus = 'Hadir';
        }
        
        return {
            student_id: student.id,
            status: existing ? existing.status : defaultStatus
        };
    });

    const { data, setData, post, processing, errors } = useForm({
        schedule_id: schedule.id,
        date: new Date().toISOString().split('T')[0],
        records: initialRecords,
    });

    const handleStatusChange = (studentId, status) => {
        const newRecords = data.records.map(r => 
            r.student_id === studentId ? { ...r, status } : r
        );
        setData('records', newRecords);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.academic.attendances.store'), {
            preserveScroll: true,
            onSuccess: () => {
                if (onSuccess) onSuccess();
            }
        });
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-black text-slate-800">Input Absensi Kelas</h3>
                <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full border border-slate-200">{data.date}</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <table className="hidden md:table w-full text-sm text-left text-slate-600">
                    <thead className="text-xs font-semibold text-slate-500 bg-slate-50/80 uppercase tracking-wider border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4">Siswa</th>
                            <th className="px-6 py-4 text-center">Status Absensi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => {
                            const record = data.records.find(r => r.student_id === student.id);
                            return (
                                <tr key={student.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-slate-800">{student.nama_lengkap}</p>
                                        <p className="text-xs text-slate-500 font-medium">NISN: {student.nisn}</p>
                                        {(() => {
                                            const presence = presenceRecords?.find(pr => pr.person_id === student.id);
                                            return presence && presence.check_in ? (
                                                <p className="text-[10px] text-emerald-600 mt-1 font-bold">QR Datang: {presence.check_in} ({presence.status_in})</p>
                                            ) : (
                                                <p className="text-[10px] text-rose-500 mt-1 font-bold">QR: Belum Datang</p>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            {['Hadir', 'Sakit', 'Izin', 'Alpa'].map(status => (
                                                <button
                                                    key={status}
                                                    type="button"
                                                    onClick={() => handleStatusChange(student.id, status)}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                                        record?.status === status
                                                            ? (status === 'Hadir' ? 'bg-green-500 text-white shadow-md shadow-green-500/20' : 
                                                               status === 'Sakit' ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20' :
                                                               status === 'Izin' ? 'bg-yellow-500 text-white shadow-md shadow-yellow-500/20' : 'bg-red-500 text-white shadow-md shadow-red-500/20')
                                                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                    }`}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Mobile View Cards */}
                <div className="md:hidden space-y-3 p-2 bg-slate-50/30">
                    {students.map((student) => {
                        const record = data.records.find(r => r.student_id === student.id);
                        return (
                            <div key={student.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">{student.nama_lengkap}</p>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">NISN: {student.nisn}</p>
                                    {(() => {
                                        const presence = presenceRecords?.find(pr => pr.person_id === student.id);
                                        return presence && presence.check_in ? (
                                            <p className="text-[10px] text-emerald-600 mt-1 font-bold">QR Datang: {presence.check_in} ({presence.status_in})</p>
                                        ) : (
                                            <p className="text-[10px] text-rose-500 mt-1 font-bold">QR: Belum Datang</p>
                                        );
                                    })()}
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {['Hadir', 'Sakit', 'Izin', 'Alpa'].map(status => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => handleStatusChange(student.id, status)}
                                            className={`py-2.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all ${
                                                record?.status === status
                                                    ? (status === 'Hadir' ? 'bg-green-500 text-white shadow-md shadow-green-500/20 scale-105' : 
                                                       status === 'Sakit' ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20 scale-105' :
                                                       status === 'Izin' ? 'bg-yellow-500 text-white shadow-md shadow-yellow-500/20 scale-105' : 'bg-red-500 text-white shadow-md shadow-red-500/20 scale-105')
                                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                            }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {errors.records && <p className="text-red-500 text-sm mt-2">{errors.records}</p>}

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full md:w-auto bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-brand-500/20"
                >
                    {processing ? 'Menyimpan...' : 'Simpan Absensi'}
                </button>
            </div>
        </form>
    );
}
