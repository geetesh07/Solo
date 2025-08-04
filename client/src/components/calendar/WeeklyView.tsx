import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from "lucide-react";
import { showToast } from "@/components/ui/Toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'main-mission' | 'training' | 'side-quest';
  completed: boolean;
}

interface WeeklyViewProps {
  goals?: Array<{
    id: string;
    title: string;
    dueDate?: string;
    completed: boolean;
    category: string;
  }>;
}

export function WeeklyView({ goals = [] }: WeeklyViewProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek;
    return new Date(today.setDate(diff));
  });
  
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState<'main-mission' | 'training' | 'side-quest'>('main-mission');
  const [newEventDate, setNewEventDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });
  
  const queryClient = useQueryClient();

  // Fetch events from database
  const { data: calendarEvents = [], isLoading } = useQuery({
    queryKey: ['/api/calendar-events'],
    queryFn: async () => {
      const response = await fetch('/api/calendar-events');
      if (!response.ok) throw new Error('Failed to fetch events');
      return response.json();
    }
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async (eventData: any) => {
      const response = await fetch('/api/calendar-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      if (!response.ok) throw new Error('Failed to create event');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/calendar-events'] });
    }
  });

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/calendar-events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update event');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/calendar-events'] });
    }
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/calendar-events/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete event');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/calendar-events'] });
    }
  });

  const getWeekDates = (startDate: Date) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newStart);
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    // Combine calendar events and goals with due dates
    const events = [...calendarEvents];
    
    goals.forEach(goal => {
      if (goal.dueDate === dateStr) {
        events.push({
          id: `goal-${goal.id}`,
          title: goal.title,
          date: dateStr,
          type: goal.category as 'main-mission' | 'training' | 'side-quest' || 'main-mission',
          completed: goal.completed
        });
      }
    });
    
    return events.filter(event => event.date === dateStr);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'main-mission': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'training': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'side-quest': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleAddEvent = () => {
    if (!newEventTitle.trim()) return;
    
    createEventMutation.mutate({
      title: newEventTitle,
      date: newEventDate,
      type: newEventType,
      completed: false
    }, {
      onSuccess: () => {
        setNewEventTitle('');
        setIsAddingEvent(false);
        const today = new Date();
        setNewEventDate(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
        
        showToast({
          type: 'success',
          title: 'Quest Event Added!',
          message: 'Event added to your weekly schedule'
        });
      },
      onError: () => {
        showToast({
          type: 'error',
          title: 'Failed to Add Event',
          message: 'Please try again'
        });
      }
    });
  };

  const handleToggleEventComplete = (eventId: string) => {
    const event = calendarEvents.find((e: CalendarEvent) => e.id === eventId);
    if (!event) return;
    
    updateEventMutation.mutate({
      id: eventId,
      data: { completed: !event.completed }
    }, {
      onSuccess: () => {
        showToast({
          type: 'success',
          title: !event.completed ? 'Quest Completed!' : 'Quest Reopened',
          message: `"${event.title}" marked as ${!event.completed ? 'completed' : 'pending'}`
        });
      }
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    const event = calendarEvents.find((e: CalendarEvent) => e.id === eventId);
    if (!event) return;
    
    deleteEventMutation.mutate(eventId, {
      onSuccess: () => {
        showToast({
          type: 'success',
          title: 'Event Deleted',
          message: `"${event.title}" has been removed`
        });
      }
    });
  };

  const weekDates = getWeekDates(currentWeekStart);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  return (
    <div className="w-full space-y-4">
      {/* Weekly Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-['Orbitron']">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              WEEKLY MISSIONS
            </span>
          </h2>
          <p className="text-gray-400 text-sm">Your 7-day quest overview</p>
        </div>
        <button 
          className="power-button text-sm px-3 py-2"
          onClick={() => setIsAddingEvent(true)}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </button>
      </div>

      {/* Week Navigation */}
      <div className="mystical-card p-4">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <button 
            onClick={() => navigateWeek('prev')}
            className="p-1.5 md:p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
          </button>
          
          <div className="text-center">
            <h3 className="text-base md:text-lg font-bold text-white font-['Orbitron']">
              {weekDates[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <p className="text-gray-400 text-xs md:text-sm">
              {weekDates[0].toLocaleDateString()} - {weekDates[6].toLocaleDateString()}
            </p>
          </div>
          
          <button 
            onClick={() => navigateWeek('next')}
            className="p-1.5 md:p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
          </button>
        </div>

        {/* Week Grid - Mobile Optimized */}
        <div className="grid grid-cols-7 gap-0.5 md:gap-2">
          {weekDates.map((date, index) => {
            const isToday = date.toDateString() === today.toDateString();
            const dayEvents = getEventsForDate(date);
            
            return (
              <div
                key={date.toISOString()}
                className={`p-1 md:p-2 rounded-lg min-h-[70px] md:min-h-[100px] transition-all duration-200 ${
                  isToday 
                    ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/50' 
                    : 'hover:bg-white/5 border border-gray-700/30'
                }`}
              >
                {/* Day Header */}
                <div className="text-center mb-1 md:mb-2">
                  <div className="text-[10px] md:text-xs text-gray-400 font-semibold">
                    {dayNames[index].substring(0, 3)}
                  </div>
                  <div className={`text-xs md:text-sm font-bold ${isToday ? 'text-cyan-400' : 'text-white'}`}>
                    {date.getDate()}
                  </div>
                </div>

                {/* Events */}
                <div className="space-y-0.5 md:space-y-1">
                  {dayEvents.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      className={`text-[9px] md:text-xs px-1 py-0.5 md:py-1 rounded ${getEventTypeColor(event.type)} ${
                        event.completed ? 'opacity-60 line-through' : ''
                      } cursor-pointer`}
                      onClick={() => !event.id.startsWith('goal-') && handleToggleEventComplete(event.id)}
                      title={event.title}
                    >
                      {event.title.length > 6 ? event.title.substring(0, 6) + '...' : event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-[8px] md:text-xs text-gray-400 text-center">+{dayEvents.length - 2}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Event Modal */}
      {isAddingEvent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="mystical-card max-w-md w-full">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-bold text-white font-['Orbitron']">Add Quest Event</h3>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quest Title
                </label>
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="Enter quest title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quest Type
                </label>
                <select
                  value={newEventType}
                  onChange={(e) => setNewEventType(e.target.value as any)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="main-mission">Main Mission</option>
                  <option value="training">Training</option>
                  <option value="side-quest">Side Quest</option>
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setIsAddingEvent(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEvent}
                  className="flex-1 power-button"
                  disabled={!newEventTitle.trim()}
                >
                  Add Quest
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}