import { Link, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, BookOpen, MapPin, Mail, Phone, ArrowRight, ShieldCheck, Award, Users } from 'lucide-react';

export default function Welcome({ canLogin, canRegister, schoolProfile }) {
    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <>
            <Head title={`Selamat Datang - ${schoolProfile.school_name}`} />

            <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white font-sans antialiased overflow-x-hidden">
                {/* Glassmorphism Header */}
                <header className="fixed top-0 w-full z-50 transition-all duration-300 bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-20">
                            {/* Logo */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
                                    <BookOpen size={24} />
                                </div>
                                <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700">
                                    {schoolProfile.school_name}
                                </span>
                            </div>

                            {/* Navigation */}
                            <nav className="hidden md:flex items-center gap-6">
                                <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Fitur</a>
                                <a href="#contact" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Kontak</a>
                                
                                <div className="h-6 w-px bg-slate-200"></div>

                                {canLogin && (
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-2"
                                    >
                                        <LogIn size={16} /> Masuk Portal
                                    </Link>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                    {/* Background Blobs */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl overflow-hidden -z-10">
                        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                        <div className="absolute top-20 -left-40 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-40 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <motion.div 
                            initial="hidden" 
                            animate="visible" 
                            variants={staggerContainer}
                            className="max-w-3xl mx-auto"
                        >
                            <motion.span 
                                variants={fadeIn} 
                                className="inline-block py-1 px-3 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold mb-6 shadow-sm"
                            >
                                ✨ {schoolProfile.school_slogan}
                            </motion.span>
                            
                            <motion.h1 
                                variants={fadeIn}
                                className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-8"
                            >
                                {schoolProfile.hero_title.split(' ').map((word, i) => (
                                    word.toLowerCase() === 'edukasi' || word.toLowerCase() === 'nusantara' ? 
                                    <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"> {word} </span> : 
                                    <span key={i}> {word} </span>
                                ))}
                            </motion.h1>
                            
                            <motion.p 
                                variants={fadeIn}
                                className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed"
                            >
                                {schoolProfile.hero_subtitle}
                            </motion.p>
                            
                            <motion.div 
                                variants={fadeIn}
                                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                            >
                                {schoolProfile.ppdb_is_open ? (
                                    <Link 
                                        href={route('ppdb.index')} 
                                        className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 group"
                                    >
                                        <UserPlus size={20} />
                                        Daftar PPDB Sekarang
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                ) : (
                                    <div className="w-full sm:w-auto px-8 py-4 bg-slate-200 text-slate-500 rounded-xl font-bold text-lg flex items-center justify-center gap-2 cursor-not-allowed">
                                        <ShieldCheck size={20} />
                                        PPDB Sedang Ditutup
                                    </div>
                                )}

                                <Link 
                                    href={route('alumni.tracer-study.index')} 
                                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 group"
                                >
                                    <Award size={20} />
                                    Portal Alumni & Tracer Study
                                </Link>

                                <Link 
                                    href={route('login')} 
                                    className="w-full sm:w-auto px-8 py-4 bg-white text-slate-800 border-2 border-slate-200 rounded-xl font-bold text-lg hover:border-indigo-200 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 group"
                                >
                                    <LogIn size={20} className="text-indigo-600" />
                                    Masuk Portal
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 bg-white border-y border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-slate-900">Kenapa Memilih Kami?</h2>
                            <p className="mt-4 text-slate-500 max-w-2xl mx-auto">Kami mengedepankan kualitas pendidikan melalui integrasi teknologi manajemen sekolah yang modern dan transparan.</p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                                    <Award size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-3">Prestasi Akademik</h3>
                                <p className="text-slate-600 leading-relaxed">Sistem penilaian yang terstruktur dan transparan memacu siswa untuk terus meraih prestasi terbaik.</p>
                            </div>
                            
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                                    <ShieldCheck size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-3">Disiplin & Karakter</h3>
                                <p className="text-slate-600 leading-relaxed">Pemantauan kehadiran dan catatan kedisiplinan yang terintegrasi langsung ke portal orang tua.</p>
                            </div>
                            
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                                    <Users size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-3">Komunitas Solid</h3>
                                <p className="text-slate-600 leading-relaxed">Kolaborasi erat antara guru, siswa, dan staf administrasi dalam ekosistem digital yang canggih.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer id="contact" className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-12">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
                                        <BookOpen size={18} />
                                    </div>
                                    <span className="font-bold text-xl text-white">
                                        {schoolProfile.school_name}
                                    </span>
                                </div>
                                <p className="text-slate-400 max-w-md mb-8">
                                    {schoolProfile.school_slogan}
                                </p>
                            </div>
                            
                            <div className="space-y-4">
                                <h4 className="text-white font-semibold text-lg mb-4">Informasi Kontak</h4>
                                <div className="flex items-start gap-3">
                                    <MapPin className="text-indigo-400 mt-1 shrink-0" size={20} />
                                    <span>{schoolProfile.school_address}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="text-indigo-400 shrink-0" size={20} />
                                    <span>{schoolProfile.school_email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="text-indigo-400 shrink-0" size={20} />
                                    <span>{schoolProfile.school_phone}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-sm text-slate-500">
                                &copy; {new Date().getFullYear()} {schoolProfile.school_name}. All rights reserved.
                            </p>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <Link href={route('login')} className="hover:text-white transition-colors">Portal Login</Link>
                                <span>&bull;</span>
                                <Link href={route('ppdb.index')} className="hover:text-white transition-colors">PPDB</Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
            
            <style jsx global>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </>
    );
}
