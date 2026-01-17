import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import CalendarGrid from './CalendarGrid';

export default function MonthView({ currentMonth, setCurrentMonth, events, onEventClick }) {
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                    {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={prevMonth}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-lg text-slate-600 dark:text-neutral-400 transition-colors"
                        aria-label="Previous Month"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-lg text-slate-600 dark:text-neutral-400 transition-colors"
                        aria-label="Next Month"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <CalendarGrid
                    currentMonth={currentMonth}
                    events={events}
                    onEventClick={onEventClick}
                />
            </div>
        </div>
    );
}
