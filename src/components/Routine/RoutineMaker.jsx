import React, { useState, useEffect } from 'react';
import { Copy, Plus, Trash2, Save, X, Clipboard, Calendar as CalendarIcon, Upload, Download, CalendarPlus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import eventsData from '../../data/events.json';
import { format, eachDayOfInterval, parseISO, getDay } from 'date-fns';

// Time slots as per user image
const TIME_SLOTS = [
    "08:00-09:30",
    "09:40-11:10",
    "11:20-12:50",
    "13:00-14:30",
    "14:40-16:10",
    "16:20-17:50"
];

const DAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

// User provided: S=Sunday, M=Monday, T=Tuesday, W=Wednesday, R=Thursday, A=Saturday
const DAY_MAP = {
    'S': 'Sunday',
    'M': 'Monday',
    'T': 'Tuesday',
    'W': 'Wednesday',
    'R': 'Thursday',
    'A': 'Saturday',
    'F': 'Friday' // Assuming F for Friday just in case
};

const DAY_INDEX_MAP = {
    "Sunday": 0,
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6
};

export default function RoutineMaker() {
    const [courses, setCourses] = useState(() => {
        const saved = localStorage.getItem('routine_courses');
        return saved ? JSON.parse(saved) : [];
    });

    // Manual Input State
    const [courseName, setCourseName] = useState('');
    const [roomNo, setRoomNo] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[0]);

    // Import Modal State
    const [showImport, setShowImport] = useState(false);
    const [importText, setImportText] = useState('');

    // Add to Calendar Modal State
    const [showCalendarModal, setShowCalendarModal] = useState(false);
    const [selectedSemester, setSelectedSemester] = useState('Spring');

    useEffect(() => {
        localStorage.setItem('routine_courses', JSON.stringify(courses));
    }, [courses]);

    const handleAddManual = () => {
        if (!courseName || selectedDays.length === 0) return;

        const newCourse = {
            id: Date.now().toString(),
            code: courseName,
            name: courseName, // Use same for display in simple mode
            room: roomNo,
            timeSlot: selectedTime,
            days: selectedDays
        };

        setCourses([...courses, newCourse]);
        // Reset form
        setCourseName('');
        setRoomNo('');
        setSelectedDays([]);
    };

    const toggleDay = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const parseIRASText = () => {
        const lines = importText.split('\n');
        const newCourses = [];

        lines.forEach(line => {
            // Regex to parse IRAS copied text
            const timePattern = /([A-Z]+):(\d{1,2}:\d{2}-\d{1,2}:\d{2})/;
            const match = line.match(timePattern);

            if (match) {
                const dayCodes = match[1];
                const timeString = match[2];

                const days = [];
                for (let char of dayCodes) {
                    if (DAY_MAP[char]) days.push(DAY_MAP[char]);
                }

                // Extract parts from the left side of the time pattern
                const timeIndex = line.indexOf(match[0]);
                const preTimePart = line.substring(0, timeIndex).trim();
                const tokens = preTimePart.split(/\s+/);

                const code = tokens[0];
                let room = 'TBA';
                let section = 'N/A';
                let title = code;

                if (tokens.length >= 4) {
                    room = tokens[tokens.length - 1];
                    section = tokens[tokens.length - 2];
                    const titleTokens = tokens.slice(1, tokens.length - 2);
                    title = titleTokens.join(' ');
                } else if (tokens.length >= 3) {
                    room = tokens[tokens.length - 1];
                    const potentialSection = tokens[tokens.length - 2];
                    if (/^\d+$/.test(potentialSection)) {
                        section = potentialSection;
                        title = tokens.slice(1, tokens.length - 2).join(' ');
                    } else {
                        title = tokens.slice(1, tokens.length - 1).join(' ');
                    }
                }

                if (days.length > 0) {
                    newCourses.push({
                        id: Date.now() + Math.random().toString(),
                        code: code,
                        name: title,
                        section: section,
                        room: room,
                        timeSlot: normalizeTime(timeString),
                        days: days
                    });
                }
            }
        });

        setCourses([...courses, ...newCourses]);
        setImportText('');
        setShowImport(false);
    };

    // Helper to fix 09:40 to 9:40 if needed, or match exact string
    const normalizeTime = (t) => {
        // Fix single digit hours: 8:00 -> 08:00
        return t.split('-').map(part => {
            const [h, m] = part.split(':');
            return `${h.padStart(2, '0')}:${m}`;
        }).join('-');
    };

    const convertTo12Hour = (timeRange) => {
        if (!timeRange) return '';
        return timeRange.split('-').map(part => {
            const [h, m] = part.split(':');
            let hour = parseInt(h);
            const ampm = hour >= 12 ? 'pm' : 'am';
            hour = hour % 12;
            hour = hour ? hour : 12;
            return `${hour}:${m} ${ampm}`;
        }).join(' - ');
    };

    const [use24Hour, setUse24Hour] = useState(true);

    const formatTimeSlot = (slot) => {
        if (use24Hour) return slot;
        const parts = slot.split('-').map(time => {
            const [h, m] = time.split(':');
            let hour = parseInt(h);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            hour = hour % 12;
            hour = hour ? hour : 12;
            return `${hour}:${m} ${ampm}`;
        });

        return (
            <div className="flex flex-col leading-tight">
                <span>{parts[0]}-</span>
                <span>{parts[1]}</span>
            </div>
        );
    };

    const gridRef = React.useRef(null);

    const clearAll = () => {
        setCourses([]);
        // Also clear calendar events
        localStorage.removeItem('user_class_events');
        window.dispatchEvent(new Event('calendar-update'));
    };

    const handleAddToCalendar = () => {
        const semesterEvents = eventsData.filter(e => e.semester === selectedSemester && e.type === 'Academic');
        const startEvent = semesterEvents.find(e => e.title.includes("Classes commence"));
        const endEvent = semesterEvents.find(e => e.title.includes("Classes end"));

        if (!startEvent || !endEvent) {
            alert(`Could not find class start/end dates for ${selectedSemester} in events data.`);
            return;
        }

        const startDate = parseISO(startEvent.startDate);
        const endDate = parseISO(endEvent.endDate);

        const newEvents = [];
        const interval = eachDayOfInterval({ start: startDate, end: endDate });

        courses.forEach(course => {
            const dayIndices = course.days.map(d => DAY_INDEX_MAP[d]);

            interval.forEach(date => {
                if (dayIndices.includes(getDay(date))) {
                    newEvents.push({
                        id: `class-${course.id}-${format(date, 'yyyy-MM-dd')}`,
                        title: `${course.code}`,
                        // Structured Details for Custom Display
                        classDetails: {
                            time: convertTo12Hour(course.timeSlot),
                            room: course.room || 'TBA',
                            section: course.section || 'N/A',
                            title: course.name || course.code
                        },
                        semester: selectedSemester,
                        type: 'Class',
                        startDate: format(date, 'yyyy-MM-dd'),
                        endDate: format(date, 'yyyy-MM-dd'),
                        color: 'bg-indigo-50 border-indigo-200 text-indigo-800'
                    });
                }
            });
        });

        localStorage.setItem('user_class_events', JSON.stringify(newEvents));
        window.dispatchEvent(new Event('calendar-update'));

        setShowCalendarModal(false);
        alert(`Successfully added ${newEvents.length} class sessions to your calendar!`);
    };

    const handleDownload = async () => {
        if (gridRef.current) {
            try {
                // Determine if dark mode is active to set background color accordingly
                // We'll rely on the computed style or just force a color if transparent
                const canvas = await html2canvas(gridRef.current, {
                    backgroundColor: document.documentElement.classList.contains('dark') ? '#000000' : '#ffffff',
                    scale: 2 // Higher resolution
                });

                const link = document.createElement('a');
                link.download = 'iub-routine.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            } catch (err) {
                console.error("Failed to download image", err);
            }
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header / Actions */}
            <div className="mb-8 grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
                <div className="xl:col-span-3 w-full p-6 bg-white dark:bg-neutral-900 rounded-3xl border border-slate-100 dark:border-neutral-800 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Plus size={20} className="text-iub-blue" />
                        Add Course
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <input
                            placeholder="Course Code (e.g. CSC101)"
                            value={courseName}
                            onChange={e => setCourseName(e.target.value)}
                            className="bg-slate-50 dark:bg-neutral-800 border-transparent rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-iub-blue/20 outline-none transition-all dark:text-white"
                        />
                        <input
                            placeholder="Room (e.g. BC5002)"
                            value={roomNo}
                            onChange={e => setRoomNo(e.target.value)}
                            className="bg-slate-50 dark:bg-neutral-800 border-transparent rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-iub-blue/20 outline-none transition-all dark:text-white"
                        />
                        <select
                            value={selectedTime}
                            onChange={e => setSelectedTime(e.target.value)}
                            className="bg-slate-50 dark:bg-neutral-800 border-transparent rounded-xl px-4 py-2.5 outline-none dark:text-white appearance-none cursor-pointer"
                        >
                            {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <button
                            onClick={handleAddManual}
                            disabled={!courseName || selectedDays.length === 0}
                            className="bg-iub-blue hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {DAYS.map(day => (
                            <button
                                key={day}
                                onClick={() => toggleDay(day)}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-bold uppercase rounded-lg border transition-all",
                                    selectedDays.includes(day)
                                        ? "bg-iub-blue text-white border-iub-blue"
                                        : "bg-white dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 border-slate-200 dark:border-neutral-700 hover:border-iub-blue/50"
                                )}
                            >
                                {day.substring(0, 3)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-full p-6 bg-white dark:bg-neutral-900 rounded-3xl border border-slate-100 dark:border-neutral-800 shadow-sm flex flex-col gap-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Clipboard size={20} className="text-slate-400" />
                        Actions
                    </h2>
                    <button
                        onClick={() => setShowImport(true)}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                    >
                        <Upload size={18} />
                        Import from IRAS
                    </button>
                </div>
            </div>

            {/* Routine Grid */}
            <div ref={gridRef} className="overflow-x-auto pb-4 rounded-3xl border border-slate-200 dark:border-neutral-800 shadow-xl bg-white dark:bg-black">
                <table className="w-full min-w-[1000px] border-collapse">
                    <thead>
                        <tr>
                            <th className="p-2 border-b border-r border-slate-100 dark:border-neutral-800 w-24 bg-slate-50/50 dark:bg-neutral-900/50 sticky left-0 backdrop-blur-sm z-10">
                                <button
                                    onClick={() => setUse24Hour(!use24Hour)}
                                    className="px-2 py-1 rounded-full text-[10px] font-bold border border-slate-300 dark:border-neutral-700 hover:bg-white dark:hover:bg-neutral-800 transition-colors"
                                >
                                    {use24Hour ? '12H' : '24H'}
                                </button>
                            </th>
                            {TIME_SLOTS.map(slot => (
                                <th key={slot} className={cn(
                                    "p-2 text-xs font-bold text-slate-700 dark:text-slate-300 border-b border-r border-slate-100 dark:border-neutral-800 last:border-r-0 transition-all",
                                    use24Hour ? "min-w-[120px]" : "min-w-[90px]"
                                )}>
                                    {formatTimeSlot(slot)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {DAYS.map(day => (
                            <tr key={day} className="group hover:bg-slate-50/30 dark:hover:bg-neutral-900/20 transition-colors">
                                <td className="p-3 border-b border-r border-slate-100 dark:border-neutral-800 font-bold text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-black sticky left-0 z-10">
                                    {day}
                                </td>
                                {TIME_SLOTS.map(slot => {
                                    const course = courses.find(c =>
                                        c.days.includes(day) &&
                                        (c.timeSlot === slot || c.timeSlot.replace(/^0/, '') === slot.replace(/^0/, ''))
                                    );

                                    return (
                                        <td key={day + slot} className="p-1 border-b border-r border-slate-100 dark:border-neutral-800 h-20 last:border-r-0 relative">
                                            {course && (
                                                <div className="absolute inset-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-2 flex flex-col justify-center items-center text-center animate-in zoom-in-95 duration-300 hover:scale-[1.05] transition-transform shadow-sm">
                                                    <span className="font-bold text-iub-blue dark:text-blue-400 text-sm">{course.code}</span>
                                                    {course.room && (
                                                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 bg-white dark:bg-black/50 px-1.5 py-0.5 rounded">
                                                            {course.room}
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={() => setCourses(courses.filter(c => c.id !== course.id))}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all shadow-md"
                                                    >
                                                        <X size={10} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 flex justify-center gap-3">
                <button
                    onClick={clearAll}
                    className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 px-6 py-3 rounded-2xl font-bold transition-all border border-red-100 dark:border-red-900/30"
                >
                    <Trash2 size={18} />
                    <span>Clear Routine</span>
                </button>
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-black dark:hover:bg-slate-200 px-6 py-3 rounded-2xl font-bold shadow-lg shadow-slate-900/20 transition-all hover:scale-[1.02]"
                >
                    <Download size={18} />
                    <span>Save Image</span>
                </button>
                <button
                    onClick={() => setShowCalendarModal(true)}
                    disabled={courses.length === 0}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <CalendarPlus size={18} />
                    <span>Add to Calendar</span>
                </button>
            </div>

            {/* Import Modal */}
            <AnimatePresence>
                {showImport && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white dark:bg-neutral-900 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-slate-100 dark:border-neutral-800 flex justify-between items-center">
                                <h3 className="text-xl font-bold">Import from IRAS</h3>
                                <button onClick={() => setShowImport(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 flex-1 overflow-y-auto">
                                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl text-sm mb-4">
                                    <strong>How to use:</strong> Go to your IRAS Semester-wise Registered Courses, copy them, and paste them below.
                                </div>
                                <textarea
                                    value={importText}
                                    onChange={e => setImportText(e.target.value)}
                                    placeholder={`Paste your course text here...\nExample:\nMIS341 Computers in Business 1 BC4011 ST:09:40-11:10 0 / 0 Z`}
                                    className="w-full h-64 bg-slate-50 dark:bg-neutral-950 border-2 border-slate-200 dark:border-neutral-800 rounded-2xl p-4 focus:ring-4 focus:ring-iub-blue/20 focus:border-iub-blue outline-none resize-none font-mono text-sm dark:text-white"
                                />
                            </div>

                            <div className="p-6 border-t border-slate-100 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 flex justify-end gap-3">
                                <button
                                    onClick={() => setShowImport(false)}
                                    className="px-6 py-2.5 font-bold text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-neutral-800 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={parseIRASText}
                                    disabled={!importText}
                                    className="px-6 py-2.5 font-bold bg-iub-blue text-white rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Generate Routine
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add to Calendar Modal */}
            <AnimatePresence>
                {showCalendarModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white dark:bg-neutral-900 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 dark:border-neutral-800 flex justify-between items-center">
                                <h3 className="text-xl font-bold">Add to Calendar</h3>
                                <button onClick={() => setShowCalendarModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6">
                                <p className="text-sm text-slate-500 dark:text-neutral-400 mb-4">
                                    Select the semester to generate calendar events for your routine.
                                </p>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Semester</label>
                                    <select
                                        value={selectedSemester}
                                        onChange={(e) => setSelectedSemester(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-neutral-800 border-transparent rounded-xl px-4 py-3 outline-none dark:text-white"
                                    >
                                        <option value="Spring">Spring</option>
                                        <option value="Summer">Summer</option>
                                        <option value="Autumn">Autumn</option>
                                    </select>
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-100 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 flex justify-end gap-3">
                                <button
                                    onClick={() => setShowCalendarModal(false)}
                                    className="px-6 py-2.5 font-bold text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-neutral-800 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddToCalendar}
                                    className="px-6 py-2.5 font-bold bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95"
                                >
                                    Confirm
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
