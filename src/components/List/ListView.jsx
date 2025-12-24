import React from 'react';
import { format, parseISO } from 'date-fns';
import { cn } from '../../lib/utils';
import { Calendar, ChevronRight } from 'lucide-react';

export default function ListView({ events, onEventClick }) {
    // Group events by month
    const eventsByMonth = events.reduce((acc, event) => {
        const date = parseISO(event.startDate);
        const monthKey = format(date, 'MMMM yyyy');
        if (!acc[monthKey]) acc[monthKey] = [];
        acc[monthKey].push(event);
        return acc;
    }, {});

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-12">
            {Object.entries(eventsByMonth).map(([month, monthEvents]) => (
                <div key={month} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur py-3 text-lg font-bold text-slate-800 mb-4 border-b border-slate-200">
                        {month}
                    </h3>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
                        {monthEvents.map(event => (
                            <button
                                key={event.id}
                                onClick={() => onEventClick(event)}
                                className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left group"
                            >
                                <div className={cn("shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center border shadow-sm", event.color)}>
                                    <span className="text-xs font-bold uppercase tracking-wide">{format(parseISO(event.startDate), 'MMM')}</span>
                                    <span className="text-xl font-bold leading-none mt-0.5">{format(parseISO(event.startDate), 'd')}</span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-slate-900 truncate group-hover:text-iub-blue transition-colors">
                                        {event.title}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase", event.color)}>
                                            {event.type}
                                        </span>
                                        <span>•</span>
                                        <span className="text-slate-600">{event.semester}</span>
                                        {event.startDate !== event.endDate && (
                                            <>
                                                <span>•</span>
                                                <span>Until {format(parseISO(event.endDate), 'MMM d')}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
