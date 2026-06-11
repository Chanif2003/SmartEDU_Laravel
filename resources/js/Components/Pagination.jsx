import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex items-center justify-between md:justify-center gap-2 mt-2 md:mt-6 pb-6 w-full">
            {links.map((link, index) => {
                const isPrevious = index === 0;
                const isNext = index === links.length - 1;
                const isNumber = !isPrevious && !isNext;
                
                let content = link.label;
                if (isPrevious) content = <><ChevronLeft className="w-5 h-5" /> <span className="md:hidden ml-1 font-bold">Sebelumnya</span></>;
                else if (isNext) content = <><span className="md:hidden mr-1 font-bold">Selanjutnya</span> <ChevronRight className="w-5 h-5" /></>;
                else content = <span dangerouslySetInnerHTML={{ __html: link.label }} />;

                const baseClasses = "flex items-center justify-center text-sm font-medium transition-all duration-300";
                
                // Mobile classes for Prev/Next
                const mobileClasses = (isPrevious || isNext) ? "flex-1 md:flex-none px-4 py-3 rounded-2xl" : "hidden md:flex px-3 py-2 min-w-[2.5rem] rounded-xl";

                return link.url === null ? (
                    <div
                        key={index}
                        className={`${baseClasses} ${mobileClasses} text-slate-400 bg-slate-50 border border-slate-200 cursor-not-allowed`}
                    >
                        {content}
                    </div>
                ) : (
                    <Link
                        key={index}
                        href={link.url}
                        preserveState
                        preserveScroll
                        className={`${baseClasses} ${mobileClasses} ${
                            link.active
                                ? 'bg-gradient-to-r from-brand-500 to-indigo-600 text-white border-transparent shadow-lg shadow-brand-500/30'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-brand-600 hover:border-brand-300'
                        }`}
                    >
                        {content}
                    </Link>
                );
            })}
        </div>
    );
}
