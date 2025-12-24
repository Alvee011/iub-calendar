import React from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday, format } from 'date-fns';
import { cn } from '../../lib/utils';

export default function CalendarGrid({ currentMonth, events, onEventClick }) {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
                {weekDays.map(day => (
                    <div
                        key={day}
                        className={cn(
                            "py-2 text-center text-xs font-bold uppercase tracking-wider",
                            day === 'Fri' ? "bg-[#ffe4e6] text-red-600" : "text-black"
                        )}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 auto-rows-fr">
                {days.map((day, dayIdx) => {
                    const dayEvents = events.filter(e => isSameDay(day, new Date())); // Note: Logic is handled in parent mostly, but we receive pre-filtered day events? 
                    // Actually, 'events' prop here assumes *all* events, so need to filter per day.
                    // Wait, passing generic events list and filtering 30 times is fine.

                    // Let's use the helper passed from hook? No, component should use what it has.
                    // We can reuse the isWithinInterval logic or simple date comparison.
                    // Since events can span multiple days, we check intervals.

                    const todaysEvents = events.filter(event => {
                        const start = new Date(event.startDate);
                        const end = new Date(event.endDate);
                        // normalization to ignore time
                        start.setHours(0, 0, 0, 0);
                        end.setHours(23, 59, 59, 999);
                        return day >= start && day <= end;
                    });

                    return (
                        <div
                            key={day.toString()}
                            className={cn(
                                "min-h-[65px] sm:min-h-[90px] p-1 border-b border-r border-slate-100 flex flex-col relative transition-colors hover:bg-slate-50/50",
                                !isSameMonth(day, monthStart) && "bg-slate-50/30 text-slate-400",
                                isToday(day) && "bg-blue-50/30"
                            )}
                        >
                            <span className={cn(
                                "w-6 h-6 flex items-center justify-center rounded-full text-xs sm:text-sm font-medium mb-1",
                                isToday(day) ? "bg-iub-blue text-white" : "text-slate-700"
                            )}>
                                {format(day, 'd')}
                            </span>

                            <div className="flex-1 flex flex-col gap-0.5 overflow-y-auto max-h-[60px] no-scrollbar">
                                {todaysEvents.map((event) => (
                                    <button
                                        key={event.id + day.toISOString()} // unique key for span
                                        onClick={(e) => { e.stopPropagation(); onEventClick(event); }}
                                        className={cn(
                                            "text-left text-[10px] px-1.5 py-0.5 rounded border truncate w-full shadow-sm transition-transform hover:scale-[1.02] active:scale-95",
                                            event.color,
                                            "opacity-90 hover:opacity-100"
                                        )}
                                    >
                                        {event.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
