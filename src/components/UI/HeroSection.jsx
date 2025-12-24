import React, { useMemo } from 'react';
import { format, parseISO, isAfter, startOfDay } from 'date-fns';
import { Calendar, ArrowRight, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function HeroSection({ events, onEventClick }) {
    // Find the next 3 upcoming events
    const upcomingEvents = useMemo(() => {
        const today = startOfDay(new Date());
        // In a real app, 'today' would be new Date(). 
        // For this 2026 calendar, let's simulate 'today' as Jan 1, 2026 if real date is before 2026,
        // or just use 2026 date. 
        // Since this is a 2026 calendar, let's assume valid relative to 2026.
        // If we are actually in 2026, we use actual date. 
        // If not, let's show the *first* events of 2026 as "upcoming" if we are before 2026.

        // For demo purposes, if current date is not 2026, let's fake "today" as Jan 1, 2026 
        // OR just show the first events of the year.
        // Let's stick to standard logic: check against actual today. 
        // If today < 2026, all 2026 events are upcoming.

        // Filter events that have an endDate >= today
        const futureEvents = events.filter(e => {
            const end = parseISO(e.endDate);
            return isAfter(end, today) || end.getTime() === today.getTime();
        });

        // Sort by startDate
        return futureEvents.sort((a, b) => new Date(a.startDate) - new Date(b.startDate)).slice(0, 3);
    }, [events]);

    if (upcomingEvents.length === 0) return null;

    const primaryEvent = upcomingEvents[0];
    const nextEvents = upcomingEvents.slice(1);

    return (
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-red-100 text-red-600 rounded-full animate-pulse">
                    <AlertCircle size={16} />
                </div>
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Happening Next</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Primary Hero Card */}
                <button
                    onClick={() => onEventClick(primaryEvent)}
                    className="col-span-1 md:col-span-2 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-iub-blue to-blue-600 p-1 text-left text-white shadow-xl transition-transform hover:scale-[1.01]"
                >
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                    <div className="relative h-full bg-white/10 backdrop-blur-sm rounded-[20px] p-6 sm:p-8 flex flex-col justify-between border border-white/10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
                                {primaryEvent.semester} • {primaryEvent.type}
                            </div>
                            <h3 className="text-2xl sm:text-4xl font-bold leading-tight max-w-lg">
                                {primaryEvent.title}
                            </h3>
                        </div>

                        <div className="mt-8 flex items-end justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-center min-w-[70px]">
                                    <span className="block text-xs font-bold uppercase opacity-80">{format(parseISO(primaryEvent.startDate), 'MMM')}</span>
                                    <span className="block text-2xl font-bold">{format(parseISO(primaryEvent.startDate), 'd')}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-medium opacity-90">
                                        {format(parseISO(primaryEvent.startDate), 'EEEE')}
                                    </span>
                                    <span className="text-sm opacity-70">
                                        {primaryEvent.startDate !== primaryEvent.endDate ? `Until ${format(parseISO(primaryEvent.endDate), 'MMM d')}` : 'All Day'}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-white text-blue-600 rounded-full p-3 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-lg">
                                <ArrowRight size={20} />
                            </div>
                        </div>
                    </div>
                </button>

                {/* Secondary List */}
                <div className="flex flex-col gap-4">
                    {nextEvents.map(event => (
                        <button
                            key={event.id}
                            onClick={() => onEventClick(event)}
                            className="flex-1 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-4 group"
                        >
                            <div className={cn("shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center border", event.color)}>
                                <span className="text-[10px] font-bold uppercase">{format(parseISO(event.startDate), 'MMM')}</span>
                                <span className="text-lg font-bold leading-none">{format(parseISO(event.startDate), 'd')}</span>
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-semibold text-slate-800 truncate group-hover:text-iub-blue transition-colors">
                                    {event.title}
                                </h4>
                                <p className="text-xs text-slate-500 mt-1">
                                    {event.semester} • {event.type}
                                </p>
                            </div>
                        </button>
                    ))}

                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-center text-slate-400 text-sm italic">
                        More events coming up...
                    </div>
                </div>
            </div>
        </div>
    );
}
