import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import CalendarGrid from './CalendarGrid';

export default function MonthView({ currentMonth, setCurrentMonth, events, onEventClick }) {
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                    {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={prevMonth}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
                        aria-label="Previous Month"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
                        aria-label="Next Month"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            <CalendarGrid
                currentMonth={currentMonth}
                events={events}
                onEventClick={onEventClick}
            />
        </div>
    );
}
