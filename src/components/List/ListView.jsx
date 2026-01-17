import React from 'react';
import { format, parseISO } from 'date-fns';
import { cn, getDarkColorClasses } from '../../lib/utils';
import { Calendar, ChevronRight } from 'lucide-react';

export default function ListView({ events, onEventClick }) {
    // Group events by month
    const eventsByMonth = events.reduce((acc, event) => {
        const date = parseISO(event.startDate);
        const monthKey = format(date, 'yyyy-MM'); // Sortable consistent key
        if (!acc[monthKey]) acc[monthKey] = [];
        acc[monthKey].push(event);
        return acc;
    }, {});

    return (
        <div className="space-y-8 relative max-w-3xl mx-auto">
            {Object.entries(eventsByMonth).map(([monthKey, monthEvents]) => {
                const monthDate = parseISO(monthKey + '-01');
                return (
                    <div key={monthKey} className="relative">
                        <h3 className="sticky top-[73px] z-30 bg-white/95 dark:bg-black/95 backdrop-blur-md py-3 px-4 border-b border-slate-100 dark:border-neutral-800 text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3 shadow-sm transition-colors mb-2 rounded-xl border border-transparent">
                            <Calendar size={20} className="text-iub-blue dark:text-sky-400" />
                            {format(monthDate, 'MMMM yyyy')}
                            <span className="text-xs font-normal text-slate-400 dark:text-neutral-500 bg-slate-100 dark:bg-neutral-900 px-2 py-0.5 rounded-full">
                                {monthEvents.length}
                            </span>
                        </h3>

                        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-slate-200 dark:border-neutral-800 divide-y divide-slate-100 dark:divide-neutral-800 overflow-hidden shadow-sm transition-colors">
                            {monthEvents.map(event => (
                                <button
                                    key={event.id}
                                    onClick={() => onEventClick(event)}
                                    className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-black/50 transition-colors group text-left"
                                >
                                    <div className="shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-slate-50 dark:bg-black border border-slate-100 dark:border-neutral-800 text-slate-900 dark:text-slate-100">
                                        <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-neutral-400">
                                            {format(parseISO(event.startDate), 'MMM')}
                                        </span>
                                        <span className="text-xl font-bold leading-none">
                                            {format(parseISO(event.startDate), 'd')}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate text-base group-hover:text-iub-blue dark:group-hover:text-sky-400 transition-colors">
                                            {event.title}
                                        </h4>
                                        <div className="flex flex-wrap gap-2 mt-1.5">
                                            <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium border", event.color, getDarkColorClasses(event.color, event.type))}>
                                                {event.type}
                                            </span>
                                            <span className="text-[10px] bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 px-1.5 py-0.5 rounded font-medium">
                                                {event.semester}
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-slate-300 dark:text-neutral-600 group-hover:text-slate-400 dark:group-hover:text-neutral-400 transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
