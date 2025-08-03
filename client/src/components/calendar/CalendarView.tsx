import { useState } from "react";
import * as React from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'main-mission' | 'training' | 'side-quest';
  completed: boolean;
}

interface CalendarViewProps {
  goals?: Array<{
    id: string;
    title: string;
    dueDate?: string;
    completed: boolean;
    category: string;
  }>;
}

export function CalendarView({ goals = [] }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState<'main-mission' | 'training' | 'side-quest'>('main-mission');
  const [newEventDate, setNewEventDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });
  
  // Load events from localStorage
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('calendar-events');
    return saved ? JSON.parse(saved) : [];
  });

  // Save events to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('calendar-events', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  // Convert goals to calendar events and combine with stored events
  const goalEvents: CalendarEvent[] = goals
    .filter(goal => goal.dueDate)
    .map(goal => ({
      id: `goal-${goal.id}`,
      title: goal.title,
      date: goal.dueDate!,
      type: goal.category.toLowerCase().replace(' ', '-') as 'main-mission' | 'training' | 'side-quest',
      completed: goal.completed
    }));

  const events: CalendarEvent[] = [...calendarEvents, ...goalEvents];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'main-mission': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'training': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      case 'side-quest': return 'bg-green-500/20 border-green-500/50 text-green-400';
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleAddEvent = () => {
    if (!newEventTitle.trim()) {
      alert('Please enter an event title');
      return;
    }
    
    const newEvent: CalendarEvent = {
      id: `event-${Date.now()}`,
      title: newEventTitle,
      date: newEventDate,
      type: newEventType,
      completed: false
    };

    const updatedEvents = [...calendarEvents, newEvent];
    setCalendarEvents(updatedEvents);
    localStorage.setItem('calendar-events', JSON.stringify(updatedEvents));
    
    // Schedule notification for the event
    scheduleNotification(newEvent);
    
    setNewEventTitle('');
    setIsAddingEvent(false);
    setSelectedDate(null);
    const today = new Date();
    setNewEventDate(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
    alert(`Event "${newEvent.title}" added successfully for ${new Date(newEvent.date).toLocaleDateString()}!`);
  };

  const scheduleNotification = (event: CalendarEvent) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const eventDate = new Date(event.date);
      const now = new Date();
      const timeUntilEvent = eventDate.getTime() - now.getTime();
      
      if (timeUntilEvent > 0) {
        setTimeout(() => {
          new Notification(`Solo Leveling Quest Reminder`, {
            body: `Today's ${event.type.replace('-', ' ')}: ${event.title}`,
            icon: '/favicon.ico',
            tag: event.id
          });
        }, timeUntilEvent);
      }
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      const updatedEvents = calendarEvents.filter(event => event.id !== eventId);
      setCalendarEvents(updatedEvents);
      localStorage.setItem('calendar-events', JSON.stringify(updatedEvents));
    }
  };

  const handleToggleEventComplete = (eventId: string) => {
    const updatedEvents = calendarEvents.map(event => 
      event.id === eventId ? { ...event, completed: !event.completed } : event
    );
    setCalendarEvents(updatedEvents);
    localStorage.setItem('calendar-events', JSON.stringify(updatedEvents));
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setNewEventDate(dateStr);
    setIsAddingEvent(true);
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = getDaysInMonth(currentDate);

  return (
    <div className="w-full max-w-none space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-['Orbitron']">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              MISSION CALENDAR
            </span>
          </h2>
          <p className="text-gray-400 mt-1">Plan and track your daily objectives</p>
        </div>
        <button 
          className="power-button"
          onClick={() => setIsAddingEvent(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Event
        </button>
      </div>

      {/* Calendar Navigation */}
      <div className="mystical-card p-6">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigateMonth('prev')}
            className="mystical-card p-2 transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5 text-cyan-400" />
          </button>
          
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white font-['Orbitron']">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
          </div>
          
          <button 
            onClick={() => navigateMonth('next')}
            className="mystical-card p-2 transition-colors duration-200"
          >
            <ChevronRight className="w-5 h-5 text-cyan-400" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {dayNames.map(day => (
            <div key={day} className="text-center p-2 text-gray-400 font-semibold text-sm">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }
            
            const dayEvents = getEventsForDate(day);
            const isToday = new Date().getDate() === day && 
                           new Date().getMonth() === currentDate.getMonth() && 
                           new Date().getFullYear() === currentDate.getFullYear();
            
            return (
              <div
                key={`${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`}
                className={`aspect-square p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  isToday 
                    ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/50' 
                    : 'hover:bg-white/5'
                } ${dayEvents.length > 0 ? 'ring-1 ring-cyan-500/30' : ''}`}
                onClick={() => handleDateClick(day)}
              >
                <div className="text-white font-semibold mb-1">{day}</div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      className={`text-xs px-1 py-0.5 rounded border ${getEventTypeColor(event.type)} ${
                        event.completed ? 'opacity-60 line-through' : ''
                      }`}
                    >
                      {event.title.length > 8 ? event.title.substring(0, 8) + '...' : event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-400">+{dayEvents.length - 2} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <div className="mystical-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Orbitron']">
              Events for {new Date(selectedDate).toLocaleDateString()}
            </h3>
          </div>
          
          <div className="space-y-3">
            {events.filter(event => event.date === selectedDate).map(event => (
              <div key={event.id} className={`mystical-card p-4 ${event.completed ? 'opacity-60' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className={`font-semibold ${event.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                      {event.title}
                    </h4>
                    <p className={`text-sm capitalize ${getEventTypeColor(event.type).split(' ')[2]}`}>
                      {event.type.replace('-', ' ')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      event.completed 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {event.completed ? 'Completed' : 'Pending'}
                    </div>
                    {!event.id.startsWith('goal-') && (
                      <>
                        <button
                          onClick={() => handleToggleEventComplete(event.id)}
                          className="p-1 text-green-400 hover:text-green-300 transition-colors"
                          title={event.completed ? 'Mark as pending' : 'Mark as completed'}
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors"
                          title="Delete event"
                        >
                          ✕
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {events.filter(event => event.date === selectedDate).length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No events scheduled for this date</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {isAddingEvent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="mystical-card max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-white font-['Orbitron'] mb-4">Add New Quest Event</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Event title..."
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddEvent()}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                autoFocus
              />
              <input
                type="date"
                value={newEventDate}
                onChange={(e) => setNewEventDate(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
              />
              <select
                value={newEventType}
                onChange={(e) => setNewEventType(e.target.value as any)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
              >
                <option value="main-mission" className="bg-gray-700">Main Mission (High Priority)</option>
                <option value="training" className="bg-gray-700">Training (Skill Building)</option>
                <option value="side-quest" className="bg-gray-700">Side Quest (Extra Tasks)</option>
              </select>
              <div className="flex space-x-3">
                <button
                  onClick={handleAddEvent}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Add Event
                </button>
                <button
                  onClick={() => setIsAddingEvent(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}