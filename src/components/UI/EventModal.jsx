import React from 'react';
import { X, Calendar, Clock, Tag } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function EventModal({ event, isOpen, onClose }) {
    if (!isOpen || !event) return null;

    const startDate = parseISO(event.startDate);
    const endDate = parseISO(event.endDate);
    const isOneDay = event.startDate === event.endDate;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                {/* Header with dynamic color - Fixed */}
                <div className={`h-20 shrink-0 ${event.color.split(' ')[0]} relative`}>
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 p-1.5 bg-white/20 hover:bg-white/40 rounded-full transition-colors text-slate-800"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="px-5 py-4 -mt-10 relative overflow-y-auto flex-1 custom-scrollbar">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl shadow-lg mb-3 ${event.color} bg-white sticky top-0 z-10`}>
                        <Calendar size={28} className={event.color.split(' ')[2]} />
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 mb-2">{event.title}</h2>

                    <div className="space-y-3 mt-4">
                        <div className="flex items-start gap-3">
                            <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-xs font-medium text-slate-900">Date</p>
                                <p className="text-sm text-slate-600">
                                    {format(startDate, 'MMMM d, yyyy')}
                                    {!isOneDay && ` – ${format(endDate, 'MMMM d, yyyy')}`}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Tag className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-xs font-medium text-slate-900">Type</p>
                                <div className="flex gap-2 mt-1">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${event.color}`}>
                                        {event.type}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium border bg-slate-100 border-slate-200 text-slate-600">
                                        {event.semester}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {event.schedule && (
                            <div className="mt-3 border-t border-slate-100 pt-3">
                                <p className="text-xs font-medium text-slate-900 mb-2">Detailed Schedule</p>
                                <div className="space-y-2">
                                    {event.schedule.map((day, idx) => (
                                        <div key={idx} className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                                            <h4 className="font-semibold text-slate-800 text-xs mb-1.5 pb-1.5 border-b border-slate-200">
                                                {day.date}
                                            </h4>
                                            <div className="space-y-1">
                                                {day.slots.map((slot, sIdx) => (
                                                    <div key={sIdx} className="flex justify-between text-xs">
                                                        <span className="text-slate-500 font-medium">{slot.time}</span>
                                                        <span className="text-slate-800 text-right">{slot.criteria}</span>
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
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 rounded-lg text-sm font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
