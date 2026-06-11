import React, { useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserSquare2, BookOpen, Clock, CalendarDays, GraduationCap, Layers } from 'lucide-react';

import StudentsTab from './Tabs/StudentsTab';
import TeachersTab from './Tabs/TeachersTab';
import StaffsTab from './Tabs/StaffsTab';
import SubjectsTab from './Tabs/SubjectsTab';
import TimeSlotsTab from './Tabs/TimeSlotsTab';
import SemestersTab from './Tabs/SemestersTab';
import SchoolClassesTab from './Tabs/SchoolClassesTab';
import MajorsTab from './Tabs/MajorsTab';

export default function UnifiedIndex({ auth, activeTab, tabData, filters, majors }) {
    
    const tabs = useMemo(() => [
        { id: 'students', label: 'Siswa', icon: Users, route: 'admin.master.students.index' },
        { id: 'teachers', label: 'Guru', icon: UserSquare2, route: 'admin.master.teachers.index' },
        { id: 'staffs', label: 'Staf', icon: UserSquare2, route: 'admin.master.staffs.index' },
        { id: 'subjects', label: 'Mata Pelajaran', icon: BookOpen, route: 'admin.master.subjects.index' },
        { id: 'timeslots', label: 'Jam Pelajaran', icon: Clock, route: 'admin.master.time-slots.index' },
        { id: 'semesters', label: 'Semester', icon: CalendarDays, route: 'admin.master.semesters.index' },
        { id: 'classes', label: 'Kelas', icon: GraduationCap, route: 'admin.master.school-classes.index' },
        { id: 'majors', label: 'Jurusan', icon: BookOpen, route: 'admin.master.majors.index' },
    ], []);

    const activeTabObj = tabs.find(t => t.id === activeTab) || tabs[0];
    const ActiveIcon = activeTabObj.icon;

    // Render Component Map
    const renderActiveTab = () => {
        switch (activeTab) {
            case 'students': return <StudentsTab auth={auth} tabData={tabData} filters={filters} majors={majors} />;
            case 'teachers': return <TeachersTab auth={auth} tabData={tabData} filters={filters} />;
            case 'staffs': return <StaffsTab auth={auth} tabData={tabData} filters={filters} />;
            case 'subjects': return <SubjectsTab auth={auth} tabData={tabData} filters={filters} />;
            case 'timeslots': return <TimeSlotsTab auth={auth} tabData={tabData} filters={filters} />;
            case 'semesters': return <SemestersTab auth={auth} tabData={tabData} filters={filters} />;
            case 'classes': return <SchoolClassesTab auth={auth} tabData={tabData} filters={filters} />;
            case 'majors': return <MajorsTab auth={auth} tabData={tabData} filters={filters} />;
            default: return null;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl shadow-neon-violet">
                        <Layers className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="font-black text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-brand-600 tracking-tight">
                            Data Master
                        </h2>
                        <p className="text-sm font-medium text-slate-500 mt-1 hidden md:block">
                            Manajemen terpusat untuk seluruh entitas master data sekolah
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={`Data Master - ${activeTabObj.label}`} />

            <div className="py-6 relative z-10">
                {/* Ambient Background Blobs */}
                <div className="absolute top-0 -left-40 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob pointer-events-none"></div>
                <div className="absolute top-0 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-0 sm:px-4 md:px-6 lg:px-8 relative z-10">
                    
                    {/* Tab Navigation (Scrollable horizontally for Mobile) */}
                    <div className="mb-6 md:mb-8">
                        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none scroll-smooth snap-x">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.id;
                                const TabIcon = tab.icon;
                                
                                return (
                                    <Link
                                        key={tab.id}
                                        href={route(tab.route)}
                                        preserveState
                                        preserveScroll
                                        className={`
                                            snap-start shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl transition-all duration-300 font-bold text-sm
                                            ${isActive 
                                                ? 'bg-gradient-to-r from-brand-500 to-indigo-600 text-white shadow-lg shadow-brand-500/30' 
                                                : 'bg-white/80 backdrop-blur-xl text-slate-500 hover:bg-white hover:text-brand-600 hover:shadow-md'
                                            }
                                        `}
                                    >
                                        <TabIcon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-500'}`} />
                                        {tab.label}
                                        
                                        {isActive && (
                                            <motion.div 
                                                layoutId="activeTabIndicator"
                                                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-white rounded-full opacity-50"
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Active Tab Content with Framer Motion Transition */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {renderActiveTab()}
                        </motion.div>
                    </AnimatePresence>
                    
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
