import { useState, useMemo } from 'react';
import eventsData from '../data/events.json';
import { isWithinInterval, parseISO, startOfDay } from 'date-fns';

export function useCalendarEvents() {
    const [filterSemester, setFilterSemester] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Get unique semesters and types for filter options
    const semesters = useMemo(() => ['All', ...new Set(eventsData.map(e => e.semester))], []);
    const types = useMemo(() => ['All', ...new Set(eventsData.map(e => e.type))], []);

    const filteredEvents = useMemo(() => {
        return eventsData.filter(event => {
            const matchSemester = filterSemester === 'All' || event.semester === filterSemester;
            const matchType = filterType === 'All' || event.type === filterType;
            return matchSemester && matchType;
        });
    }, [filterSemester, filterType]);

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
        allEvents: eventsData,
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
