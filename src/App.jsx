import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, List, Grid, Filter, Search, X, ArrowRight, Calendar, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useCalendarEvents } from './hooks/useCalendarEvents';
import HeroSection from './components/UI/HeroSection';
import MonthView from './components/Calendar/MonthView';
import SemesterView from './components/Semester/SemesterView';
import ListView from './components/List/ListView';
import EventModal from './components/UI/EventModal';
import Filters from './components/UI/Filters';
import Footer from './components/UI/Footer';
import { cn } from './lib/utils';

function App() {
  const [view, setView] = useState('month'); // month, semester, list
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { events, allEvents, filters, calendar } = useCalendarEvents();

  // Search through ALL events for global search
  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    return allEvents.filter(event =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allEvents, searchQuery]);

  // Navigate to event month on search result click
  const handleSearchResultClick = (event) => {
    setSearchQuery(''); // Clear search
    setView('month'); // Switch to month view
    calendar.setCurrentMonth(parseISO(event.startDate)); // Jump to that month
    // Optional: Open modal immediately? User said "open that month on calender". 
    // Let's also select it so they see it clearly.
    setSelectedEvent(event);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-iub-blue to-iub-green bg-clip-text text-transparent">
                IUB Academic Calendar
              </h1>
            </div>

            {/* Global Search Bar */}
            <div className="relative w-full sm:w-72 md:w-96 group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-iub-blue transition-colors">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search events (e.g. 'Exam', 'Eid')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-transparent focus:bg-white focus:border-iub-blue focus:ring-4 focus:ring-blue-500/10 rounded-xl text-base sm:text-sm font-medium transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 mt-4">
            {/* View Switcher */}
            <div className={`flex p-1 bg-slate-100/80 rounded-xl transition-opacity duration-200 ${searchQuery ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              {[
                { id: 'month', icon: CalendarIcon, label: 'Month' },
                { id: 'semester', icon: Grid, label: 'Semester' },
                { id: 'list', icon: List, label: 'List' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setView(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    view === tab.id
                      ? "bg-white text-iub-blue shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <tab.icon size={16} />
                  <span className={cn("hidden sm:inline", view === tab.id && "inline")}>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              disabled={!!searchQuery}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors border",
                (showFilters || filters.semester !== 'All' || filters.type !== 'All') && !searchQuery
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50",
                searchQuery && "opacity-50 pointer-events-none"
              )}
            >
              <Filter size={16} />
              <span className="hidden sm:inline">Filters</span>
              {(filters.semester !== 'All' || filters.type !== 'All') && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 sm:px-6">

        {/* State: SEARCH ACTIVE */}
        {searchQuery ? (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                Search Results
              </h2>
              <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {searchResults.length} found
              </span>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map(event => (
                  <button
                    key={event.id}
                    onClick={() => handleSearchResultClick(event)}
                    className="group bg-white rounded-xl p-3 border border-slate-200 hover:border-iub-blue/50 hover:shadow-md transition-all text-left flex flex-col gap-3 relative overflow-hidden"
                  >
                    <div className={`absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity ${event.color.split(' ')[2]}`}>
                      <Calendar size={48} />
                    </div>

                    <div className="flex items-start justify-between relative z-10">
                      <div className={cn("w-12 h-12 rounded-xl flex flex-col items-center justify-center border shadow-sm", event.color)}>
                        <span className="text-[9px] font-bold uppercase">{format(parseISO(event.startDate), 'MMM')}</span>
                        <span className="text-lg font-bold leading-none">{format(parseISO(event.startDate), 'd')}</span>
                      </div>
                      <div className="bg-slate-50 text-slate-500 p-1.5 rounded-full group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <ArrowRight size={16} />
                      </div>
                    </div>

                    <div className="relative z-10">
                      <h3 className="font-bold text-base text-slate-900 leading-tight mb-1.5 group-hover:text-iub-blue transition-colors">
                        {event.title}
                      </h3>

                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-2">
                        <span className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 flex items-center gap-1">
                          <Calendar size={10} className="text-slate-400" />
                          {format(parseISO(event.startDate), 'MMM d, yyyy')}
                          {event.startDate !== event.endDate && ` – ${format(parseISO(event.endDate), 'MMM d, yyyy')}`}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center text-[10px] font-medium text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                          {event.semester}
                        </span>
                        <span className={cn("inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded border", event.color)}>
                          {event.type}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Search size={32} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">No events found</h3>
                <p className="text-slate-500 max-w-xs mx-auto">
                  We couldn't find any events matching "{searchQuery}". Try searching for something else.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* State: NO SEARCH (Normal View) */
          <>
            {view === 'month' && !showFilters && (
              <HeroSection events={events} onEventClick={setSelectedEvent} />
            )}

            <Filters filters={filters} isOpen={showFilters} />

            <div className="animate-in fade-in zoom-in-95 duration-300">
              {view === 'month' && (
                <MonthView
                  currentMonth={calendar.currentMonth}
                  setCurrentMonth={calendar.setCurrentMonth}
                  events={events}
                  onEventClick={setSelectedEvent}
                />
              )}

              {view === 'semester' && (
                <SemesterView
                  events={events}
                  onEventClick={setSelectedEvent}
                />
              )}

              {view === 'list' && (
                <ListView
                  events={events}
                  onEventClick={setSelectedEvent}
                />
              )}
            </div>
          </>
        )}
      </main>

      <Footer />

      <EventModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}

export default App;
