import React from 'react';
import { X, Calendar, Clock, Tag } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function EventModal({ event, isOpen, onClose }) {
    if (!isOpen || !event) return null;

    const startDate = parseISO(event.startDate);
    const endDate = parseISO(event.endDate);
    const isOneDay = event.startDate === event.endDate;

    // Helper to generate dark mode compatible classes
    const getEventThemeClasses = (baseColor, type) => {

        // "Grayish darker" - uniform background for dark mode
        const darkBase = {
            headerBg: 'dark:bg-neutral-900',
            iconBg: 'dark:bg-neutral-800',
            badgeBg: 'dark:bg-neutral-800',
            border: 'dark:border-neutral-800',
            text: (color) => `dark:text-${color}`
        };

        // Enforce consistent Dark Mode colors by Category
        if (type === 'Registration') {
            return {
                headerBg: `bg-slate-50 ${darkBase.headerBg}`,
                iconBg: `bg-slate-100 ${darkBase.iconBg}`,
                iconColor: `text-slate-600 ${darkBase.text('cyan-400')}`,
                badge: `bg-white ${darkBase.badgeBg} text-slate-800 ${darkBase.text('cyan-200')} border-slate-200 ${darkBase.border}`,
                border: `border-slate-200 ${darkBase.border}`
            };
        }
        if (type === 'Holiday') {
            return {
                headerBg: `bg-red-50 ${darkBase.headerBg}`,
                iconBg: `bg-red-100 ${darkBase.iconBg}`,
                iconColor: `text-red-600 ${darkBase.text('red-400')}`,
                badge: `bg-[#ffe4e6] ${darkBase.badgeBg} text-red-800 ${darkBase.text('red-200')} border-red-200 ${darkBase.border}`,
                border: `border-red-200 ${darkBase.border}`
            };
        }
        if (type === 'Exam') {
            return {
                headerBg: `bg-purple-50 ${darkBase.headerBg}`,
                iconBg: `bg-purple-100 ${darkBase.iconBg}`,
                iconColor: `text-purple-600 ${darkBase.text('purple-400')}`,
                badge: `bg-purple-100 ${darkBase.badgeBg} text-purple-800 ${darkBase.text('purple-200')} border-purple-200 ${darkBase.border}`,
                border: `border-purple-200 ${darkBase.border}`
            };
        }
        if (type === 'Payment') {
            return {
                headerBg: `bg-stone-50 ${darkBase.headerBg}`,
                iconBg: `bg-stone-100 ${darkBase.iconBg}`,
                iconColor: `text-stone-600 ${darkBase.text('stone-400')}`,
                badge: `bg-stone-100 ${darkBase.badgeBg} text-stone-800 ${darkBase.text('stone-200')} border-stone-200 ${darkBase.border}`,
                border: `border-stone-200 ${darkBase.border}`
            };
        }
        if (type === 'Academic') {
            // Enforce Consistent Blue for Academic in Light Mode
            const darkBg = `dark:bg-neutral-800`;
            const darkText = `dark:text-slate-300`;
            const darkBorder = `dark:border-neutral-800`;
            const darkHeaderBg = `dark:bg-neutral-900`;
            const darkIconBg = `dark:bg-neutral-800`;

            return {
                headerBg: `bg-blue-50 ${darkHeaderBg}`,
                iconBg: `bg-blue-100 ${darkIconBg}`,
                iconColor: `text-blue-600 dark:text-slate-400`,
                badge: `bg-blue-100 ${darkBg} text-blue-800 ${darkText} border-blue-200 ${darkBorder}`,
                border: `border-blue-200 ${darkBorder}`
            };
        }

        // baseColor example: "bg-cyan-100 border-cyan-200 text-cyan-800"
        if (!baseColor) return {};

        let colorName = 'slate';

        // Handle hex code for holidays
        if (baseColor.includes('[#ffe4e6]')) {
            colorName = 'red';
        } else {
            const colorMatch = baseColor.match(/-(cyan|emerald|amber|blue|red|slate|purple|stone|orange|rose|pink|indigo|violet|sky|lime|teal|fuchsia)-/);
            if (colorMatch) colorName = colorMatch[1];
        }

        // Specific adjustments for dark mode readability
        const darkBg = `dark:bg-${colorName}-950`; // Deeper background
        const darkText = `dark:text-${colorName}-200`; // Lighter text
        const darkBorder = `dark:border-${colorName}-800`;
        const darkHeaderBg = `dark:bg-${colorName}-900/40`;
        const darkIconBg = `dark:bg-${colorName}-900/60`;

        return {
            headerBg: `bg-${colorName}-100 ${darkHeaderBg}`,
            iconBg: `bg-${colorName}-100 ${darkIconBg}`,
            iconColor: `text-${colorName}-600 dark:text-${colorName}-400`,
            badge: `bg-${colorName}-100 ${darkBg} text-${colorName}-800 ${darkText} border-${colorName}-200 ${darkBorder}`,
            border: `border-${colorName}-200 ${darkBorder}`
        };
    };

    const theme = getEventThemeClasses(event.color, event.type);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] border border-transparent dark:border-neutral-800">

                {/* Header with dynamic color - Fixed */}
                <div className={`h-24 shrink-0 relative overflow-hidden`}>
                    <div className={`absolute inset-0 ${theme.headerBg} transition-colors duration-300`}></div>
                    {/* Gradient overlay for depth */}
                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent"></div>

                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 p-1.5 bg-white/40 dark:bg-black/20 hover:bg-white/60 dark:hover:bg-black/30 backdrop-blur-sm rounded-full transition-colors text-slate-800 dark:text-slate-200"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="px-6 pb-6 -mt-12 relative overflow-y-auto flex-1 custom-scrollbar">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg mb-4 bg-white dark:bg-black border-4 border-white dark:border-neutral-900 sticky top-0 z-10 transition-colors duration-300`}>
                        <div className={`w-full h-full rounded-xl flex items-center justify-center ${theme.iconBg}`}>
                            <Calendar size={28} className={theme.iconColor} />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 leading-tight">{event.title}</h2>
                    <p className="text-sm font-medium text-slate-500 dark:text-neutral-400 mb-6">{event.semester} {event.type}</p>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-neutral-800/50 border border-slate-100 dark:border-neutral-800">
                            <Clock className="w-5 h-5 text-slate-400 dark:text-neutral-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-500 mb-0.5">Time</p>
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    {format(startDate, 'MMMM d, yyyy')}
                                    {!isOneDay && ` – ${format(endDate, 'MMMM d, yyyy')}`}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-neutral-800/50 border border-slate-100 dark:border-neutral-800">
                            <Tag className="w-5 h-5 text-slate-400 dark:text-neutral-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-500 mb-1.5">Category</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${theme.badge}`}>
                                        {event.type}
                                    </span>
                                    <span className="px-2.5 py-1 rounded-md text-xs font-medium border bg-white dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-neutral-300">
                                        {event.semester}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {event.schedule && (
                            <div className="mt-2 pt-2">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-500 mb-3">Detailed Schedule</p>
                                <div className="space-y-3">
                                    {event.schedule.map((day, idx) => (
                                        <div key={idx} className="bg-slate-50 dark:bg-neutral-800/30 rounded-xl p-3 border border-slate-100 dark:border-neutral-800">
                                            <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-2 pb-2 border-b border-slate-200 dark:border-neutral-700">
                                                {day.date}
                                            </h4>
                                            <div className="space-y-2">
                                                {day.slots.map((slot, sIdx) => (
                                                    <div key={sIdx} className="flex justify-between text-sm items-start gap-4">
                                                        <span className="text-slate-600 dark:text-neutral-400 font-medium shrink-0">{slot.time}</span>
                                                        <span className="text-slate-800 dark:text-slate-300 text-right">{slot.criteria}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer - Fixed */}
                <div className="p-4 bg-slate-50 dark:bg-black border-t border-slate-100 dark:border-neutral-800 flex justify-end shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-700 text-slate-900 dark:text-slate-100 rounded-lg text-sm font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
