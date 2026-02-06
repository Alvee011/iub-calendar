import { useState, useMemo, useEffect } from 'react';
import eventsData from '../data/events.json';
import { isWithinInterval, parseISO, startOfDay } from 'date-fns';

export function useCalendarEvents() {
    const [filterSemester, setFilterSemester] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [customEvents, setCustomEvents] = useState([]);

    // Load custom events on mount and listen for updates
    useEffect(() => {
        const loadCustomEvents = () => {
            const saved = localStorage.getItem('user_class_events');
            if (saved) {
                setCustomEvents(JSON.parse(saved));
            } else {
                setCustomEvents([]);
            }
        };

        loadCustomEvents();

        window.addEventListener('calendar-update', loadCustomEvents);
        return () => window.removeEventListener('calendar-update', loadCustomEvents);
    }, []);

    // Combine static and custom events
    const allEventsSource = useMemo(() => [...eventsData, ...customEvents], [customEvents]);

    // Get unique semesters and types for filter options
    const semesters = useMemo(() => ['All', ...new Set(allEventsSource.map(e => e.semester))], [allEventsSource]);
    const types = useMemo(() => ['All', ...new Set(allEventsSource.map(e => e.type))], [allEventsSource]);

    const filteredEvents = useMemo(() => {
        return allEventsSource.filter(event => {
            const matchSemester = filterSemester === 'All' || event.semester === filterSemester;
            const matchType = filterType === 'All' || event.type === filterType;
            return matchSemester && matchType;
        });
    }, [filterSemester, filterType, allEventsSource]);

    const getEventsForDate = (date) => {
        const checkDate = startOfDay(date);
        return filteredEvents.filter(event => {
            const start = parseISO(event.startDate);
            const end = parseISO(event.endDate);
            return isWithinInterval(checkDate, { start, end });
        });
    };

    return {
        events: filteredEvents,
        allEvents: allEventsSource,
        filters: {
            semester: filterSemester,
            setSemester: setFilterSemester,
            type: filterType,
            setType: setFilterType,
            options: { semesters, types }
        },
        calendar: {
            currentMonth,
            setCurrentMonth,
            getEventsForDate
        }
    };
}
