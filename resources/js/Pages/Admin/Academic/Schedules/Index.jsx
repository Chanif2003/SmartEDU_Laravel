import React, { useState, useMemo, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2, Plus, X, Calendar as CalendarIcon, Filter } from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

export default function Index({ schedules, filters, semesters, classes, teachers, subjects, timeSlots, flash, errors: serverErrors }) {
    const { auth } = usePage().props;
    const isTeacher = auth.user.role === 'teacher';
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Client-side filter for Calendar
    const [selectedClassId, setSelectedClassId] = useState(filters.class_id || (isTeacher ? '' : (classes.length > 0 ? classes[0].id : '')));

    const calendarRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            if (calendarRef.current) {
                const api = calendarRef.current.getApi();
                if (window.innerWidth < 768) {
                    if (api.view.type !== 'listWeek') {
                        api.changeView('listWeek');
                    }
                } else {
                    if (api.view.type !== 'timeGridWeek') {
                        api.changeView('timeGridWeek');
                    }
                }
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const { data, setData, post, processing, errors: formErrors, reset, clearErrors } = useForm({
        semester_id: semesters.length > 0 ? semesters[0].id : '',
        class_id: selectedClassId,
        teacher_id: '',
        subject_id: '',
        time_slot_id: '',
        day: 'Senin',
    });

    const openModal = () => {
        setData('class_id', selectedClassId); // Sync the modal's class_id with current filter
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        clearErrors();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.academic.schedules.store'), {
            onSuccess: () => closeModal(),
        });
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus Jadwal ini?')) {
            router.delete(route('admin.academic.schedules.destroy', id));
        }
    };

    // Prepare events for FullCalendar
    const calendarEvents = useMemo(() => {
        // Map day string to FullCalendar daysOfWeek (0=Sunday, 1=Monday... 6=Saturday)
        const dayMap = {
            'Minggu': 0,
            'Senin': 1,
            'Selasa': 2,
            'Rabu': 3,
            'Kamis': 4,
            'Jumat': 5,
            'Sabtu': 6
        };

        return schedules
            .filter(s => selectedClassId ? s.class_id === selectedClassId : true)
            .map(s => ({
                id: s.id,
                title: `${s.subject_name}\n${isTeacher ? s.class_name : s.teacher_name}`,
                daysOfWeek: [dayMap[s.day]], // Recurring day
                startTime: s.start_time,
                endTime: s.end_time,
                backgroundColor: s.color || '#3788d8',
                borderColor: s.color || '#3788d8',
                extendedProps: {
                    ...s
                }
            }));
    }, [schedules, selectedClassId]);

    const handleEventClick = (info) => {
        const eventObj = info.event.extendedProps;
        if (confirm(`Hapus jadwal ${info.event.title} pada hari ${eventObj.day}?`)) {
            handleDelete(eventObj.id);
        }
    };

    return (
        <AuthenticatedLayout
            
            header={
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl shadow-neon-violet">
                            <CalendarIcon className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="font-black text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-brand-600 tracking-tight">
                            Jadwal Akademik
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Jadwal Akademik" />

            <div className="py-6 md:py-12 relative z-10">
                {/* Ambient Background Blobs */}
                <div className="absolute top-0 -left-40 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob pointer-events-none"></div>
                <div className="absolute top-0 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>
                <div className="absolute -bottom-40 left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-0 sm:px-4 md:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Left Panel: Filter & Action */}
                        <div className="w-full md:w-64 shrink-0 space-y-4">
                            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                                <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
                                    <Filter className="w-4 h-4 text-slate-500" />
                                    Filter Jadwal
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Kelas</label>
                                        <select 
                                            value={selectedClassId} 
                                            onChange={(e) => setSelectedClassId(e.target.value)}
                                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                                        >
                                            <option value="">Semua Kelas</option>
                                            {classes.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                            {classes.length === 0 && <option value="">Belum ada kelas</option>}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {!isTeacher && (
                                <button 
                                    onClick={openModal} 
                                    className="group relative w-full flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 ease-in-out bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl hover:from-brand-600 hover:to-indigo-700 shadow-neon-violet hover:shadow-neon-violet-hover hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                                    Tambah Jadwal
                                    <div className="absolute inset-0 rounded-2xl ring-1 ring-white/20 pointer-events-none"></div>
                                </button>
                            )}
                            
                            {flash?.success && <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm border border-green-200 shadow-sm">{flash.success}</div>}
                            {Object.keys(serverErrors).length > 0 && (
                                <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200 shadow-sm">
                                    <p className="font-semibold">Terjadi Kesalahan:</p>
                                    <ul className="list-disc pl-4 mt-1">
                                        {Object.values(serverErrors).map((err, idx) => <li key={idx}>{err}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Right Panel: Calendar */}
                        <div className="flex-1 bg-white/80 backdrop-blur-xl p-4 md:p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 min-h-[600px] overflow-hidden">
                            
                                    <style>{`
                                        .fc .fc-timegrid-slot { height: 2.5em; }
                                        .fc-event-main { padding: 2px 4px; font-size: 0.85em; white-space: pre-wrap; line-height: 1.2; }
                                        .fc-theme-standard .fc-scrollgrid { border-color: #e2e8f0; }
                                        .fc-theme-standard td, .fc-theme-standard th { border-color: #e2e8f0; }
                                        .fc-col-header-cell { padding: 8px 0; background-color: #f8fafc; }
                                        .fc-list-event-title { font-weight: 500; }
                                        .fc-list-day-cushion { background-color: #f1f5f9 !important; }
                                    `}</style>
                                    <FullCalendar
                                        ref={calendarRef}
                                        plugins={[timeGridPlugin, interactionPlugin, listPlugin]}
                                        initialView="timeGridWeek"
                                        headerToolbar={false} // Hide header, we only need the week grid
                                        allDaySlot={false}
                                        slotMinTime="06:00:00"
                                        slotMaxTime="18:00:00"
                                        hiddenDays={[0]} // Hide sunday by default
                                        firstDay={1} // Monday first
                                        dayHeaderFormat={{ weekday: 'long' }}
                                        events={calendarEvents}
                                        eventClick={handleEventClick}
                                        height="auto"
                                        locale="id"
                                        slotLabelFormat={{
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            omitZeroMinute: false,
                                            meridiem: false,
                                            hour12: false
                                        }}
                                    />
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-lg w-full max-w-lg overflow-hidden shadow-xl">
                        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5 text-blue-600" />
                                Tambah Jadwal Akademik
                            </h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="col-span-full">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Semester Aktif</label>
                                    <select value={data.semester_id} onChange={e => setData('semester_id', e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm bg-slate-50" required>
                                        {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                    {formErrors.semester_id && <p className="mt-1 text-sm text-red-600">{formErrors.semester_id}</p>}
                                </div>
                                <div className="col-span-full">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Kelas</label>
                                    <select value={data.class_id} onChange={e => setData('class_id', e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" required>
                                        <option value="">-- Pilih Kelas --</option>
                                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    {formErrors.class_id && <p className="mt-1 text-sm text-red-600">{formErrors.class_id}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Hari</label>
                                    <select value={data.day} onChange={e => setData('day', e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" required>
                                        {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    {formErrors.day && <p className="mt-1 text-sm text-red-600">{formErrors.day}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Slot Waktu (Jam Ke-)</label>
                                    <select value={data.time_slot_id} onChange={e => setData('time_slot_id', e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" required>
                                        <option value="">-- Pilih Slot --</option>
                                        {timeSlots.map(ts => <option key={ts.id} value={ts.id}>{ts.name} ({ts.start_time.substring(0,5)} - {ts.end_time.substring(0,5)})</option>)}
                                    </select>
                                    {formErrors.time_slot_id && <p className="mt-1 text-sm text-red-600">{formErrors.time_slot_id}</p>}
                                </div>
                                <div className="col-span-full">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Mata Pelajaran</label>
                                    <select value={data.subject_id} onChange={e => setData('subject_id', e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" required>
                                        <option value="">-- Pilih Mapel --</option>
                                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                    {formErrors.subject_id && <p className="mt-1 text-sm text-red-600">{formErrors.subject_id}</p>}
                                </div>
                                <div className="col-span-full">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Guru Pengajar</label>
                                    <select value={data.teacher_id} onChange={e => setData('teacher_id', e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" required>
                                        <option value="">-- Pilih Guru --</option>
                                        {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                    {formErrors.teacher_id && <p className="mt-1 text-sm text-red-600">{formErrors.teacher_id}</p>}
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Batal</button>
                                <button type="submit" disabled={processing} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">
                                    {processing ? 'Menyimpan...' : 'Simpan Jadwal'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
