import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { 
  ChevronLeft, ChevronRight, Plus, X, Calendar as CalendarIcon,
  Clock, User, Tag, Edit2, Trash2, Check, AlertCircle, Search,
  MapPin, Sun, Moon, List, LayoutGrid, CalendarDays,
  MoreVertical, Bell, Repeat
} from 'lucide-react';

// Helper functions
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
const getMonthName = (month) => ['January','February','March','April','May','June','July','August','September','October','November','December'][month];
const getShortMonthName = (month) => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][month];
const getShortDayName = (day) => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][day];
const getFullDayName = (day) => ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][day];
const isToday = (date) => {
  const today = new Date();
  return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
};
const isSameDay = (d1, d2) => d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
const isSameWeek = (d1, d2) => {
  const firstDay = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate() - d1.getDay());
  const lastDay = new Date(firstDay);
  lastDay.setDate(firstDay.getDate() + 6);
  return d2 >= firstDay && d2 <= lastDay;
};
const formatDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const formatTime = (date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

// Generate random colors for events
const eventColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500', 'bg-red-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500'];
const colorNames = ['Blue', 'Green', 'Purple', 'Pink', 'Yellow', 'Red', 'Indigo', 'Teal', 'Orange', 'Cyan'];

// Mock events data
const generateMockEvents = () => {
  const today = new Date();
  const events = [];
  const titles = ['Team Meeting', 'Design Review', 'Lunch with Client', 'Doctor Appointment', 'Gym Session', 'Conference Call', 'Project Deadline', 'Coffee with Sarah', 'Board Meeting', 'Code Review'];
  const locations = ['Office', 'Zoom', 'Cafe', 'Hospital', 'Gym', 'Conference Room', 'Home', 'Online'];
  for (let i = 0; i < 20; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + Math.floor(Math.random() * 30) - 10);
    const randomColor = eventColors[Math.floor(Math.random() * eventColors.length)];
    events.push({
      id: Date.now() + i + Math.random() * 100,
      title: titles[Math.floor(Math.random() * titles.length)] + (i % 3 === 0 ? ' (urgent)' : ''),
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      location: locations[Math.floor(Math.random() * locations.length)],
      date: date.toISOString().slice(0,10),
      time: `${String(Math.floor(Math.random() * 12) + 8).padStart(2,'0')}:${String(Math.floor(Math.random() * 60)).padStart(2,'0')}`,
      allDay: Math.random() > 0.7,
      color: randomColor,
      reminder: Math.random() > 0.6 ? 15 : null,
    });
  }
  // Ensure at least one event today
  const todayStr = today.toISOString().slice(0,10);
  if (!events.some(e => e.date === todayStr)) {
    events.push({
      id: Date.now() + 9999,
      title: 'Today\'s event',
      description: 'This is a sample event for today.',
      location: 'Office',
      date: todayStr,
      time: '10:00',
      allDay: false,
      color: eventColors[0],
      reminder: 15,
    });
  }
  return events.sort((a, b) => a.date.localeCompare(b.date));
};

// Event Modal – Fully Responsive
const EventModal = ({ isOpen, onClose, onSubmit, event, title, selectedDate }) => {
  const [form, setForm] = useState(event || { 
    title: '', 
    description: '', 
    location: '',
    time: '09:00', 
    allDay: false,
    color: eventColors[0],
    reminder: null,
  });
  const [selectedColor, setSelectedColor] = useState(event?.color || eventColors[0]);

  useEffect(() => {
    if (event) {
      setForm(event);
      setSelectedColor(event.color || eventColors[0]);
    } else {
      setForm({ title: '', description: '', location: '', time: '09:00', allDay: false, color: eventColors[0], reminder: null });
      setSelectedColor(eventColors[0]);
    }
  }, [event]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-3 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 w-full max-w-[95vw] sm:max-w-[450px] shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"><X size={20} /></button>
        </div>
        <div className="space-y-3">
          <input 
            type="text" 
            placeholder="Event title" 
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-900/70 focus:ring-2 focus:ring-purple-500 outline-none text-sm sm:text-base"
          />
          <textarea 
            placeholder="Description (optional)" 
            value={form.description || ''}
            onChange={e => setForm({...form, description: e.target.value})}
            rows={2}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-900/70 focus:ring-2 focus:ring-purple-500 outline-none resize-none text-sm sm:text-base"
          />
          <div className="flex flex-wrap items-center gap-2">
            <MapPin size={18} className="text-gray-400 flex-shrink-0" />
            <input 
              type="text" 
              placeholder="Location" 
              value={form.location || ''}
              onChange={e => setForm({...form, location: e.target.value})}
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-900/70 focus:ring-2 focus:ring-purple-500 outline-none text-sm sm:text-base"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Clock size={18} className="text-gray-400 flex-shrink-0" />
            <input 
              type="time" 
              value={form.time || '09:00'}
              onChange={e => setForm({...form, time: e.target.value})}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-900/70 focus:ring-2 focus:ring-purple-500 outline-none text-sm"
              disabled={form.allDay}
            />
            <label className="flex items-center gap-1 text-sm ml-2">
              <input 
                type="checkbox" 
                checked={form.allDay || false}
                onChange={e => setForm({...form, allDay: e.target.checked})}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              All day
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Bell size={18} className="text-gray-400 flex-shrink-0" />
            <select 
              value={form.reminder || ''}
              onChange={e => setForm({...form, reminder: e.target.value ? parseInt(e.target.value) : null})}
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-900/70 focus:ring-2 focus:ring-purple-500 outline-none text-sm"
            >
              <option value="">No reminder</option>
              <option value="5">5 min before</option>
              <option value="15">15 min before</option>
              <option value="30">30 min before</option>
              <option value="60">1 hour before</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            {eventColors.map((color, idx) => (
              <button 
                key={color} 
                onClick={() => { setSelectedColor(color); setForm({...form, color}); }}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${color} ${selectedColor === color ? 'ring-2 ring-offset-2 ring-purple-500' : ''}`}
                title={colorNames[idx]}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
          <button onClick={() => { onSubmit(form); onClose(); }} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition text-sm sm:text-base">Save</button>
          <button onClick={onClose} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-lg transition text-sm sm:text-base">Cancel</button>
        </div>
      </div>
    </div>
  );
};

// Event Item Component – Responsive
const EventItem = ({ event, onEdit, onDelete }) => {
  return (
    <div className={`flex flex-wrap items-center justify-between p-2 rounded-lg ${event.color} bg-opacity-20 dark:bg-opacity-30 hover:bg-opacity-30 transition mb-1 group`}>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className={`w-2 h-2 rounded-full ${event.color} flex-shrink-0`} />
        <span className="text-xs sm:text-sm truncate">{event.title}</span>
        {event.time && !event.allDay && <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 ml-auto flex-shrink-0">{event.time}</span>}
        {event.allDay && <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 ml-auto flex-shrink-0">All day</span>}
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition mt-1 sm:mt-0">
        <button onClick={() => onEdit(event)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><Edit2 size={14} className="text-gray-500" /></button>
        <button onClick={() => onDelete(event.id)} className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30"><Trash2 size={14} className="text-red-500" /></button>
      </div>
    </div>
  );
};

// Mini Calendar Component (sidebar)
const MiniCalendar = ({ currentDate, onSelectDate, selectedDate }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthName = getShortMonthName(month);

  return (
    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-sm">{monthName} {year}</span>
        <div className="flex gap-1">
          <button onClick={() => onSelectDate(new Date(year, month - 1, 1))} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><ChevronLeft size={14} /></button>
          <button onClick={() => onSelectDate(new Date(year, month + 1, 1))} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><ChevronRight size={14} /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} className="text-gray-400 font-medium py-0.5">{d}</div>)}
        {Array.from({ length: firstDay }, (_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateObj = new Date(year, month, day);
          const isSelected = isSameDay(dateObj, selectedDate);
          const isTodayDate = isToday(dateObj);
          return (
            <div 
              key={day} 
              onClick={() => onSelectDate(dateObj)}
              className={`cursor-pointer rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center mx-auto transition text-xs sm:text-sm ${isSelected ? 'bg-purple-600 text-white' : isTodayDate ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main Calendar Component
const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState(generateMockEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [view, setView] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const filteredEvents = useMemo(() => {
    if (!searchTerm.trim()) return events;
    return events.filter(e => 
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.description && e.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.location && e.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [events, searchTerm]);

  const getEventsForDate = (date) => {
    return filteredEvents.filter(e => {
      const eDate = new Date(e.date);
      return isSameDay(eDate, date);
    });
  };

  const getWeekEvents = () => {
    const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - selectedDate.getDay());
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(firstDay);
      day.setDate(firstDay.getDate() + i);
      week.push(day);
    }
    return week.map(day => ({
      date: day,
      events: getEventsForDate(day),
    }));
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    const upcoming = filteredEvents
      .filter(e => new Date(e.date) >= today)
      .sort((a, b) => a.date.localeCompare(b.date));
    return upcoming.slice(0, 10);
  };

  const prevPeriod = () => {
    if (view === 'month') setCurrentDate(new Date(year, month - 1, 1));
    else if (view === 'week') {
      const newDate = new Date(selectedDate);
      newDate.setDate(selectedDate.getDate() - 7);
      setSelectedDate(newDate);
      setCurrentDate(newDate);
    }
  };
  const nextPeriod = () => {
    if (view === 'month') setCurrentDate(new Date(year, month + 1, 1));
    else if (view === 'week') {
      const newDate = new Date(selectedDate);
      newDate.setDate(selectedDate.getDate() + 7);
      setSelectedDate(newDate);
      setCurrentDate(newDate);
    }
  };
  const goToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const selectDay = (day) => {
    const date = new Date(year, month, day);
    setSelectedDate(date);
    setView('day');
  };

  const handleAddEvent = (eventData) => {
    if (!eventData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? { ...eventData, id: e.id, date: e.date } : e));
      toast.success('Event updated');
    } else {
      const newEvent = { 
        ...eventData, 
        id: Date.now(), 
        date: selectedDate.toISOString().slice(0,10) 
      };
      setEvents([...events, newEvent]);
      toast.success('Event added');
    }
    setEditingEvent(null);
    setIsModalOpen(false);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = (id) => {
    if (window.confirm('Delete this event?')) {
      setEvents(events.filter(e => e.id !== id));
      toast.success('Event deleted');
    }
  };

  const hasEvents = (day) => {
    const date = new Date(year, month, day);
    return filteredEvents.some(e => isSameDay(new Date(e.date), date));
  };

  // Render month view – Fully Responsive
  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    return (
      <div className="p-2 sm:p-4">
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => (
            <div key={day} className="text-center text-[8px] sm:text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase py-1 sm:py-2">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
          {Array.from({ length: firstDay }, (_, i) => <div key={`empty-${i}`} className="aspect-square" />)}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const date = new Date(year, month, day);
            const isCurrentDay = isToday(date);
            const hasEvent = hasEvents(day);
            const isSelected = isSameDay(date, selectedDate);
            return (
              <div 
                key={day} 
                onClick={() => selectDay(day)}
                className={`aspect-square flex flex-col items-center justify-center rounded-lg sm:rounded-xl cursor-pointer transition hover:scale-105 text-[10px] sm:text-sm ${isSelected ? 'bg-purple-600 text-white' : isCurrentDay ? 'bg-purple-100 dark:bg-purple-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <span className={`font-medium ${isSelected ? 'text-white' : 'text-gray-800 dark:text-white'}`}>{day}</span>
                {hasEvent && !isSelected && <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-purple-500 mt-0.5" />}
                {isSelected && <span className="text-[6px] sm:text-[8px] md:text-xs mt-0.5 opacity-70">{getEventsForDate(date).length} events</span>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render week view – Fully Responsive
  const renderWeekView = () => {
    const weekData = getWeekEvents();
    return (
      <div className="p-2 sm:p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs sm:text-lg font-semibold">Week of {weekData[0].date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h3>
        </div>
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {weekData.map((day, idx) => (
            <div key={idx} className={`rounded-lg sm:rounded-xl p-1 sm:p-2 ${isSameDay(day.date, selectedDate) ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-white/50 dark:bg-gray-800/50'}`}>
              <div className="text-center">
                <div className="text-[8px] sm:text-xs font-medium text-gray-500">{getShortDayName(day.date.getDay())}</div>
                <div className={`text-xs sm:text-lg font-bold ${isToday(day.date) ? 'text-purple-600' : 'text-gray-800 dark:text-white'}`}>{day.date.getDate()}</div>
              </div>
              <div className="mt-1 sm:mt-2 space-y-0.5 sm:space-y-1 max-h-20 sm:max-h-32 overflow-y-auto">
                {day.events.length === 0 ? (
                  <div className="text-[6px] sm:text-xs text-gray-400 text-center py-0.5 sm:py-1">No events</div>
                ) : (
                  day.events.map(event => (
                    <div key={event.id} className={`text-[6px] sm:text-xs p-0.5 sm:p-1 rounded ${event.color} text-white truncate cursor-pointer hover:opacity-80`}>
                      {event.time && !event.allDay ? event.time : ''} {event.title}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render day view – Fully Responsive
  const renderDayView = () => {
    const dayEvents = getEventsForDate(selectedDate);
    return (
      <div className="p-2 sm:p-4">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <h3 className="text-sm sm:text-xl font-bold text-gray-800 dark:text-white">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </h3>
          <button onClick={() => { setEditingEvent(null); setIsModalOpen(true); }} className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-xs sm:text-sm transition"><Plus size={16} /> Add</button>
        </div>
        <div className="space-y-2">
          {dayEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">No events for this day</div>
          ) : (
            dayEvents.map(event => (
              <EventItem key={event.id} event={event} onEdit={handleEditEvent} onDelete={handleDeleteEvent} />
            ))
          )}
        </div>
      </div>
    );
  };

  // Render agenda view – Fully Responsive
  const renderAgendaView = () => {
    const upcoming = getUpcomingEvents();
    return (
      <div className="p-2 sm:p-4">
        <h3 className="text-base sm:text-xl font-bold mb-4">Upcoming Events</h3>
        {upcoming.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">No upcoming events</div>
        ) : (
          <div className="space-y-3">
            {upcoming.map(event => {
              const eventDate = new Date(event.date);
              return (
                <div key={event.id} className="flex flex-col sm:flex-row sm:items-start gap-3 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
                  <div className={`w-1.5 h-full min-h-[40px] rounded-full ${event.color}`} />
                  <div className="flex-1">
                    <div className="flex flex-wrap justify-between">
                      <span className="font-medium text-sm sm:text-base">{event.title}</span>
                      <span className="text-xs text-gray-500">{formatDate(eventDate)}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 sm:gap-2 text-xs text-gray-500">
                      {event.time && !event.allDay && <span>{event.time}</span>}
                      {event.allDay && <span>All day</span>}
                      {event.location && <span>• {event.location}</span>}
                    </div>
                    {event.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{event.description}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in p-3 sm:p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">📅 Calendar</h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">Manage your schedule</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={goToday} className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow transition text-sm sm:text-base">Today</button>
          <button onClick={() => { setEditingEvent(null); setIsModalOpen(true); }} className="bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow flex items-center gap-2 transition text-sm sm:text-base"><Plus size={18} /> Add Event</button>
        </div>
      </div>

      {/* Main Layout: Sidebar + Calendar */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar */}
        <div className="lg:w-1/4 space-y-4">
          <MiniCalendar 
            currentDate={currentDate}
            selectedDate={selectedDate}
            onSelectDate={(date) => { setCurrentDate(date); setSelectedDate(date); setView('day'); }}
          />
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-sm mb-2">Upcoming</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {getUpcomingEvents().slice(0, 3).map(ev => (
                <div key={ev.id} className="text-xs flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${ev.color}`} />
                  <span className="truncate">{ev.title}</span>
                  <span className="text-gray-400 ml-auto">{ev.time || 'All day'}</span>
                </div>
              ))}
              {getUpcomingEvents().length === 0 && <div className="text-xs text-gray-400">No upcoming events</div>}
            </div>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Search size={14} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Search events..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent outline-none text-sm border-b border-gray-200 dark:border-gray-700"
              />
            </div>
            <div className="text-xs text-gray-500">
              {filteredEvents.length} events found
            </div>
          </div>
        </div>

        {/* Main Calendar */}
        <div className="lg:w-3/4">
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Navigation */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center gap-2 p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-gray-800/50 dark:to-gray-700/50">
              <div className="flex items-center gap-2">
                <button onClick={prevPeriod} className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"><ChevronLeft size={18} /></button>
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 dark:text-white">
                  {view === 'month' ? `${getMonthName(month)} ${year}` : 
                   view === 'week' ? `Week of ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` :
                   view === 'day' ? selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) :
                   'Agenda'}
                </h2>
                <button onClick={nextPeriod} className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"><ChevronRight size={18} /></button>
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <button onClick={() => setView('month')} className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs transition ${view === 'month' ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Month</button>
                <button onClick={() => setView('week')} className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs transition ${view === 'week' ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Week</button>
                <button onClick={() => setView('day')} className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs transition ${view === 'day' ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Day</button>
                <button onClick={() => setView('agenda')} className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs transition ${view === 'agenda' ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Agenda</button>
              </div>
            </div>

            {/* Content */}
            {view === 'month' && renderMonthView()}
            {view === 'week' && renderWeekView()}
            {view === 'day' && renderDayView()}
            {view === 'agenda' && renderAgendaView()}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingEvent(null); }}
        onSubmit={handleAddEvent}
        event={editingEvent}
        title={editingEvent ? 'Edit Event' : 'Add Event'}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default Calendar;