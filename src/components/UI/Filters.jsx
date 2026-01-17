import React from 'react';
import { Filter, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Filters({ filters, isOpen, toggleFilters }) {
    const { semester, setSemester, type, setType, options } = filters;

    return (
        <div className={cn(
            "bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-slate-200 dark:border-neutral-800 overflow-hidden transition-all duration-300 ease-in-out",
            isOpen ? "max-h-[500px] opacity-100 mb-6" : "max-h-0 opacity-0 mb-0"
        )}>
            <div className="p-4 sm:p-6 space-y-6">
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-widest">Select Semester</label>
                    <div className="flex flex-wrap gap-2">
                        {options.semesters.map(opt => (
                            <button
                                key={opt}
                                onClick={() => setSemester(opt)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                                    semester === opt
                                        ? "bg-iub-blue dark:bg-sky-600 text-white border-iub-blue dark:border-sky-600 shadow-md transform scale-105"
                                        : "bg-slate-50 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 border-slate-200 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-700"
                                )}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-widest">Event Type</label>
                    <div className="flex flex-wrap gap-2">
                        {options.types.map(opt => (
                            <button
                                key={opt}
                                onClick={() => setType(opt)}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border",
                                    type === opt
                                        ? "bg-slate-800 dark:bg-white text-white dark:text-black border-slate-800 dark:border-white"
                                        : "bg-white dark:bg-neutral-900 text-slate-600 dark:text-neutral-300 border-slate-200 dark:border-neutral-700 hover:border-slate-300 dark:hover:border-neutral-500"
                                )}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                {(semester !== 'All' || type !== 'All') && (
                    <div className="pt-4 border-t border-slate-100 dark:border-neutral-800">
                        <button
                            onClick={() => { setSemester('All'); setType('All'); }}
                            className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium flex items-center gap-1"
                        >
                            <X size={14} /> Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
