import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, Database, BookOpen, Users, Building, Calendar, 
    Layers, Clock, Megaphone, Smartphone, CreditCard, CheckSquare, 
    PenTool, PenLine, FolderOpen, ClipboardList, ShieldAlert, UserPlus, 
    FileText, BarChart, FileSpreadsheet, AlertCircle, QrCode, ListChecks, 
    TrendingUp, LogOut, Menu, Box, Settings, User, X, Sparkles, Home, GraduationCap, PieChart, CalendarRange
} from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { component } = usePage();

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    const NavItem = ({ href, active, label, icon: Icon }) => (
        <Link
            href={href}
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all duration-300 ease-out group relative overflow-hidden ${
                active 
                    ? 'text-white shadow-neon-violet' 
                    : 'text-slate-400 hover:text-white'
            }`}
        >
            {active && (
                <motion.div 
                    layoutId="activeNav" 
                    className="absolute inset-0 bg-gradient-to-r from-brand-600 via-purple-500 to-pink-500 opacity-90 z-0" 
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}
            {!active && <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity z-0 rounded-xl" />}
            <div className="relative z-10 flex items-center gap-3 w-full">
                <div className={`p-1.5 rounded-lg transition-all duration-300 ${active ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white'}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <span className="tracking-wide">{label}</span>
            </div>
        </Link>
    );

    const FullMenuLinks = () => (
        <>
            <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-3 mb-4 mt-4">Menu Utama</div>
            <NavItem href={route('dashboard')} active={route().current('dashboard')} label="Dashboard" icon={LayoutDashboard} />
            
            {user.role === 'admin' && (
                <>
                    <div className="pt-6">
                        <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-3 mb-4">Pendaftaran</div>
                        <NavItem href={route('admin.ppdb.index')} active={route().current('admin.ppdb.*')} label="Manajemen PPDB" icon={UserPlus} />
                    </div>
                    <div className="pt-6">
                        <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-3 mb-4">Inventaris</div>
                        <NavItem href={route('admin.sarpras.inventories.index')} active={route().current('admin.sarpras.*')} label="Inventaris Barang" icon={Box} />
                    </div>
                    <div className="pt-6">
                        <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-3 mb-4">Sistem Server</div>
                        <NavItem href={route('admin.settings.whatsapp.index')} active={route().current('admin.settings.whatsapp.*')} label="Server WhatsApp" icon={Settings} />
                    </div>
                    <div className="pt-6">
                        <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-3 mb-4">Alumni & Kelulusan</div>
                        <NavItem href={route('admin.graduation.index')} active={route().current('admin.graduation.*')} label="Manajemen Kelulusan" icon={GraduationCap} />
                        <NavItem href={route('admin.tracer-studies.index')} active={route().current('admin.tracer-studies.*')} label="Laporan Alumni" icon={Users} />
                    </div>
                </>
            )}

            {(user.role === 'admin' || user.role === 'teacher') && (
                <>
                    <div className="pt-6">
                        <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-3 mb-4">Data Master</div>
                        {user.role === 'admin' && <NavItem href={route('admin.master.students.index')} active={route().current('admin.master.*')} label="Data Master" icon={Layers} />}
                        <NavItem href={route('admin.buku-induk.index')} active={route().current('admin.buku-induk.*')} label="Buku Induk Siswa" icon={FolderOpen} />
                        {user.role === 'admin' && <NavItem href={route('admin.import-export.index')} active={route().current('admin.import-export.*')} label="Import & Export Data" icon={FileSpreadsheet} />}
                    </div>
                </>
            )}

            {user.role === 'admin' && (
                <div className="pt-6">
                    <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-3 mb-4">Pelaporan & Analitik</div>
                    <NavItem href={route('admin.reports.index')} active={route().current('admin.reports.*')} label="Laporan Global" icon={PieChart} />
                </div>
            )}

            {(user.role === 'admin' || user.role === 'teacher') && (
                <>
                    <div className="pt-6">
                        <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-3 mb-4">Akademik</div>
                        {user.role === 'admin' && <NavItem href={route('admin.eskul.extracurriculars.index')} active={route().current('admin.eskul.extracurriculars.*')} label="Ekstrakurikuler" icon={Layers} />}
                        <NavItem href={route('admin.academic.schedules.index')} active={route().current('admin.academic.schedules.*')} label="Jadwal Akademik" icon={Calendar} />
                        <NavItem href={route('admin.academic.journals.index')} active={route().current('admin.academic.journals.*')} label="Jurnal Mengajar" icon={BookOpen} />
                        <NavItem href={route('admin.academic.daily-assessments.index')} active={route().current('admin.academic.daily-assessments.*')} label="Penilaian Harian" icon={CheckSquare} />
                        <NavItem href={route('admin.academic.substitutions.index')} active={route().current('admin.academic.substitutions.*')} label="Guru Pengganti" icon={Users} />
                        <NavItem href={route('admin.academic.administrations.index')} active={route().current('admin.academic.administrations.*')} label="Administrasi Guru" icon={FileText} />
                        <NavItem href={route('discipline.violations.index')} active={route().current('discipline.violations.*')} label="Kedisiplinan" icon={ShieldAlert} />
                    </div>
                    <div className="pt-6">
                        <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-3 mb-4">Kehadiran</div>
                        <NavItem href={route('admin.presence.scanner', { type: 'student' })} active={route().current('admin.presence.scanner') && route().params.type !== 'staff'} label="Scanner Siswa" icon={QrCode} />
                        {user.role === 'admin' && <NavItem href={route('admin.presence.scanner', { type: 'staff' })} active={route().current('admin.presence.scanner') && route().params.type === 'staff'} label="Scanner Guru & Staf" icon={QrCode} />}
                        <NavItem href={route('admin.presence.recap', { type: 'student' })} active={route().current('admin.presence.recap') && route().params.type !== 'staff'} label="Rekap Hadir Siswa" icon={FileSpreadsheet} />
                        {user.role === 'admin' && <NavItem href={route('admin.presence.recap', { type: 'staff' })} active={route().current('admin.presence.recap') && route().params.type === 'staff'} label="Rekap Hadir Staf" icon={FileSpreadsheet} />}
                        <NavItem href={route('admin.academic.attendances.index')} active={route().current('admin.academic.attendances.*')} label="Daftar Hadir Kelas" icon={ListChecks} />
                        <NavItem href={route('admin.academic.daily-attendance-recaps.index')} active={route().current('admin.academic.daily-attendance-recaps.*')} label="Rekap Absensi Harian" icon={CalendarRange} />
                    </div>
                    <div className="pt-6">
                        <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-3 mb-4">E-Raport</div>
                        <NavItem href={route('admin.assessment.index')} active={route().current('admin.assessment.*')} label="Penilaian Akademik" icon={CheckSquare} />
                        <NavItem href={route('admin.report-cards.index')} active={route().current('admin.report-cards.*')} label="E-Raport Siswa" icon={FileText} />
                    </div>
                </>
            )}

            {user.role === 'admin' && (
                <div className="pt-6">
                    <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-3 mb-4">Keuangan</div>
                    <NavItem href={route('admin.finance.spp.index')} active={route().current('admin.finance.spp.*')} label="Pembayaran SPP" icon={CreditCard} />
                </div>
            )}

            {user.role === 'student' && (
                <>
                    <div className="pt-6">
                        <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-3 mb-4">Akademik & Penilaian</div>
                        <NavItem href={route('student.schedules.index')} active={route().current('student.schedules.*')} label="Jadwal Pelajaran" icon={Calendar} />
                        <NavItem href={route('student.attendances.index')} active={route().current('student.attendances.*')} label="Riwayat Absensi" icon={ListChecks} />
                        <NavItem href={route('student.daily-attendance-recaps.index')} active={route().current('student.daily-attendance-recaps.*')} label="Kehadiran Hari Ini" icon={CalendarRange} />
                        <NavItem href={route('student.report-cards.index')} active={route().current('student.report-cards.*')} label="Rapor Nilai" icon={GraduationCap} />
                    </div>
                    <div className="pt-6">
                        <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-3 mb-4">Kedisiplinan & Keuangan</div>
                        <NavItem href={route('student.violations.index')} active={route().current('student.violations.*')} label="Catatan Pelanggaran" icon={ShieldAlert} />
                        <NavItem href={route('student.finance.index')} active={route().current('student.finance.*')} label="Pembayaran SPP" icon={CreditCard} />
                    </div>
                </>
            )}
        </>
    );

    return (
        <div className="h-screen bg-slate-900 flex overflow-hidden font-sans text-slate-800 selection:bg-brand-500 selection:text-white">
            
            {/* Desktop Sidebar - Hidden on Mobile */}
            <aside className="hidden md:flex flex-col w-[280px] bg-gradient-to-br from-indigo-950 via-[#31186b] to-indigo-950 border-r border-indigo-500/20 z-50 shadow-[4px_0_24px_rgba(49,24,107,0.4)] relative overflow-hidden">
                <div className="p-6 flex items-center justify-between relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 blur-3xl rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/20 blur-3xl rounded-full"></div>
                    <h1 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3 relative z-10">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="w-12 h-12 bg-gradient-to-br from-brand-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-neon-violet">
                            <Sparkles className="w-6 h-6" />
                        </motion.div>
                        <span>EDU<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-pink-400">MAPPER</span></span>
                    </h1>
                </div>
                <nav className="flex-1 px-4 pb-4 space-y-1.5 overflow-y-auto custom-scrollbar-dark relative z-10">
                    <FullMenuLinks />
                </nav>
                <div className="p-4 m-4 mt-0 shrink-0 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="flex flex-col gap-4 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-500 to-pink-500 flex items-center justify-center text-white text-lg font-black uppercase shadow-neon-violet">
                                {user.name.charAt(0)}
                            </div>
                            <div className="text-sm flex-1 truncate">
                                <p className="text-white font-bold truncate text-base">{user.name}</p>
                                <p className="text-brand-300 text-xs font-bold uppercase tracking-wider">{user.role} Portal</p>
                            </div>
                        </div>
                        <form onSubmit={handleLogout} className="w-full">
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full flex items-center justify-center gap-2 py-3 text-xs font-black text-white bg-slate-700/50 hover:bg-rose-500 hover:shadow-neon-orange border border-slate-600 hover:border-rose-400 rounded-xl transition-all duration-300 uppercase tracking-widest">
                                <LogOut className="w-4 h-4" /> Sistem Keluar
                            </motion.button>
                        </form>
                    </div>
                </div>
            </aside>

            {/* Main Workspace */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#F8FAFC] relative">
                
                {/* Mobile Top Header */}
                <header className="md:hidden h-20 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-30 flex items-center px-6 shrink-0 justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-neon-violet">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-black text-slate-800 tracking-tight leading-tight">EDU<span className="text-brand-500">MAPPER</span></span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role} Portal</span>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold overflow-hidden border-2 border-white shadow-sm">
                        {user.name.charAt(0)}
                    </div>
                </header>

                {/* Desktop Top Header */}
                <header className="hidden md:flex h-24 bg-white/80 backdrop-blur-2xl border-b border-slate-200/50 sticky top-0 z-30 items-center px-10 shrink-0 justify-between shadow-sm">
                    <div className="text-2xl font-black text-slate-800 tracking-tight">
                        {header}
                    </div>
                    <div className="flex items-center gap-4">
                        <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></motion.div>
                        <span className="px-5 py-2.5 bg-slate-900 text-white text-xs font-black rounded-full uppercase tracking-widest shadow-xl">
                            {user.role} • Ganjil 2026
                        </span>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto relative custom-scrollbar pb-28 md:pb-0"> {/* Extra pb on mobile for bottom nav */}
                    {/* Mobile Page Header (Since TopBar hides it on mobile) */}
                    <div className="md:hidden px-6 pt-6 pb-2">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">{header}</h2>
                    </div>
                    
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={component}
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.02, y: -10 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="p-6 md:p-10 min-h-full"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Mobile Bottom Navigation Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-xl border-t border-slate-200/50 z-40 flex items-center justify-around px-2 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-safe">
                
                {/* Home */}
                <Link href={route('dashboard')} className="flex flex-col items-center justify-center w-16 h-full gap-1 group">
                    <div className={`p-2 rounded-xl transition-all duration-300 ${route().current('dashboard') ? 'bg-brand-50 text-brand-600 scale-110' : 'text-slate-400 group-hover:bg-slate-50'}`}>
                        <Home className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-bold ${route().current('dashboard') ? 'text-brand-600' : 'text-slate-400'}`}>Beranda</span>
                </Link>

                {/* Academics */}
                <Link href={(user.role === 'admin' || user.role === 'teacher') ? route('admin.academic.schedules.index') : (user.role === 'student' ? route('student.schedules.index') : '#')} className="flex flex-col items-center justify-center w-16 h-full gap-1 group">
                    <div className={`p-2 rounded-xl transition-all duration-300 ${(route().current('admin.academic.schedules.*') || route().current('student.schedules.*')) ? 'bg-pink-50 text-pink-600 scale-110' : 'text-slate-400 group-hover:bg-slate-50'}`}>
                        <Calendar className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-bold ${(route().current('admin.academic.schedules.*') || route().current('student.schedules.*')) ? 'text-pink-600' : 'text-slate-400'}`}>Jadwal</span>
                </Link>

                {/* Main Action (Scanner/Profile) */}
                <div className="relative -top-6 flex items-center justify-center">
                    <Link href={(user.role === 'admin' || user.role === 'teacher') ? route('admin.presence.scanner', { type: 'student' }) : (user.role === 'student' ? route('student.report-cards.index') : '#')} className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-pink-500 text-white shadow-neon-violet transform transition-transform hover:scale-110 active:scale-95">
                        {(user.role === 'admin' || user.role === 'teacher') ? <QrCode className="w-7 h-7" /> : <FileText className="w-7 h-7" />}
                    </Link>
                </div>

                {/* Presence / Attendances */}
                <Link href={(user.role === 'admin' || user.role === 'teacher') ? route('admin.academic.attendances.index') : (user.role === 'student' ? route('student.attendances.index') : '#')} className="flex flex-col items-center justify-center w-16 h-full gap-1 group">
                    <div className={`p-2 rounded-xl transition-all duration-300 ${(route().current('admin.academic.attendances.*') || route().current('student.attendances.*')) ? 'bg-blue-50 text-blue-600 scale-110' : 'text-slate-400 group-hover:bg-slate-50'}`}>
                        <ListChecks className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-bold ${(route().current('admin.academic.attendances.*') || route().current('student.attendances.*')) ? 'text-blue-600' : 'text-slate-400'}`}>Presensi</span>
                </Link>

                {/* More / Menu */}
                <button onClick={() => setMobileMenuOpen(true)} className="flex flex-col items-center justify-center w-16 h-full gap-1 group">
                    <div className={`p-2 rounded-xl transition-all duration-300 ${mobileMenuOpen ? 'bg-emerald-50 text-emerald-600 scale-110' : 'text-slate-400 group-hover:bg-slate-50'}`}>
                        <Menu className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-bold ${mobileMenuOpen ? 'text-emerald-600' : 'text-slate-400'}`}>Lainnya</span>
                </button>

            </nav>

            {/* Mobile Full Screen Menu Modal */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 md:hidden" 
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.div 
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 h-[85vh] bg-gradient-to-br from-indigo-950 via-[#31186b] to-indigo-950 rounded-t-[2.5rem] z-50 flex flex-col overflow-hidden md:hidden shadow-[0_-20px_60px_rgba(49,24,107,0.5)] border-t border-indigo-500/20"
                        >
                            <div className="flex justify-center pt-4 pb-2 shrink-0">
                                <div className="w-12 h-1.5 bg-slate-700 rounded-full"></div>
                            </div>
                            <div className="px-6 py-4 flex items-center justify-between shrink-0">
                                <h3 className="text-xl font-black text-white">Menu Utama</h3>
                                <button onClick={() => setMobileMenuOpen(false)} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto px-6 pb-24 custom-scrollbar-dark">
                                <FullMenuLinks />
                                <div className="mt-8 pt-6 border-t border-slate-800">
                                    <form onSubmit={handleLogout} className="w-full">
                                        <motion.button whileTap={{ scale: 0.98 }} type="submit" className="w-full flex items-center justify-center gap-2 py-4 text-sm font-black text-white bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 rounded-2xl transition-all uppercase tracking-widest shadow-neon-orange">
                                            <LogOut className="w-5 h-5" /> Keluar Aplikasi
                                        </motion.button>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </div>
    );
}
