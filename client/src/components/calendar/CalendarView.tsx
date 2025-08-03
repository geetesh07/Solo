import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'main-mission' | 'training' | 'side-quest';
  completed: boolean;
}

interface CalendarViewProps {
  // Calendar props would go here
}

export function CalendarView({ }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Mock events data - replace with real data
  const events: CalendarEvent[] = [
    { id: '1', title: 'Complete project proposal', date: '2025-01-05', type: 'main-mission', completed: true },
    { id: '2', title: 'Learn React hooks', date: '2025-01-05', type: 'training', completed: false },
    { id: '3', title: 'Organize desk', date: '2025-01-06', type: 'side-quest', completed: false },
    { id: '4', title: 'Team meeting prep', date: '2025-01-07', type: 'main-mission', completed: false },
    { id: '5', title: 'Exercise routine', date: '2025-01-08', type: 'training', completed: true },
  ];

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

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = getDaysInMonth(currentDate);

  return (
    <div className="space-y-6">
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
        <button className="power-button">
          <Plus className="w-5 h-5 mr-2" />
          Add Event
        </button>
      </div>

      {/* Calendar Navigation */}
      <div className="mystical-card p-6">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigateMonth('prev')}
            className="mystical-card p-2 hover:scale-110 transition-transform duration-200"
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
            className="mystical-card p-2 hover:scale-110 transition-transform duration-200"
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
              return <div key={index} className="aspect-square" />;
            }
            
            const dayEvents = getEventsForDate(day);
            const isToday = new Date().getDate() === day && 
                           new Date().getMonth() === currentDate.getMonth() && 
                           new Date().getFullYear() === currentDate.getFullYear();
            
            return (
              <div
                key={day}
                className={`aspect-square p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  isToday 
                    ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/50' 
                    : 'hover:bg-white/5'
                } ${dayEvents.length > 0 ? 'ring-1 ring-cyan-500/30' : ''}`}
                onClick={() => setSelectedDate(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)}
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
                  <div>
                    <h4 className={`font-semibold ${event.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                      {event.title}
                    </h4>
                    <p className={`text-sm capitalize ${getEventTypeColor(event.type).split(' ')[2]}`}>
                      {event.type.replace('-', ' ')}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    event.completed 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {event.completed ? 'Completed' : 'Pending'}
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
    </div>
  );
}