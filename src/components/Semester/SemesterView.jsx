import React from 'react';
import { format, parseISO } from 'date-fns';
import { cn } from '../../lib/utils';
import { BookOpen, GraduationCap, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';

const SemesterCard = ({ semester, events, onEventClick }) => {
    const semesterColors = {
        'Spring': 'bg-blue-50 border-blue-200 text-blue-900',
        'Summer': 'bg-emerald-50 border-emerald-200 text-emerald-900',
        'Autumn': 'bg-amber-50 border-amber-200 text-amber-900',
    };

    const headerColors = {
        'Spring': 'from-blue-600 to-blue-500',
        'Summer': 'from-emerald-600 to-emerald-500',
        'Autumn': 'from-amber-600 to-amber-500',
    };

    // Sort events by date
    const sortedEvents = [...events].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    return (
        <div className={cn("rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-lg bg-white", semesterColors[semester]?.replace('bg-', 'border-'))}>
            <div className={cn("px-6 py-8 bg-gradient-to-br", headerColors[semester], "text-white")}>
                <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold uppercase tracking-wider">
                        2026
                    </span>
                    <BookOpen className="w-6 h-6 opacity-80" />
                </div>
                <h3 className="text-3xl font-bold">{semester}</h3>
                <p className="opacity-90 mt-1 font-medium">Academic Semester</p>
            </div>

            <div className="p-4 sm:p-6 space-y-3">
                {sortedEvents.map(event => (
                    <button
                        key={event.id}
                        onClick={() => onEventClick(event)}
                        className="w-full group flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left border border-transparent hover:border-slate-100"
                    >
                        <div className={cn("shrink-0 w-12 h-12 rounded-lg flex flex-col items-center justify-center border", event.color)}>
                            <span className="text-xs font-bold uppercase">{format(parseISO(event.startDate), 'MMM')}</span>
                            <span className="text-lg font-bold leading-none">{format(parseISO(event.startDate), 'd')}</span>
                        </div>

                        <div className="flex-1 min-w-0 py-0.5">
                            <h4 className="font-semibold text-slate-800 truncate group-hover:text-iub-blue transition-colors">
                                {event.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                    <CalendarIcon size={12} />
                                    {event.type}
                                </span>
                                {event.startDate !== event.endDate && (
                                    <>
                                        <span>•</span>
                                        <span>Ends {format(parseISO(event.endDate), 'MMM d')}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                            <ArrowRight size={16} className="text-slate-400" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default function SemesterView({ events, onEventClick }) {
    const semesters = ['Spring', 'Summer', 'Autumn'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 pb-12">
            {semesters.map(displaySemester => {
                const semesterEvents = events.filter(e => e.semester === displaySemester);
                return (
                    <SemesterCard
                        key={displaySemester}
                        semester={displaySemester}
                        events={semesterEvents}
                        onEventClick={onEventClick}
                    />
                );
            })}
        </div>
    );
}
