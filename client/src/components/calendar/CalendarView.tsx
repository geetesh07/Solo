import { useState } from "react";
import * as React from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from "lucide-react";
import { showToast } from "@/components/ui/Toast";
import { useConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
  
  const { showConfirm, confirmDialog } = useConfirmDialog();
  
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
      showToast({
        type: 'warning',
        title: 'Title Required',
        message: 'Please enter an event title before adding'
      });
      return;
    }

    createEventMutation.mutate({
      title: newEventTitle,
      date: newEventDate,
      type: newEventType,
      completed: false
    }, {
      onSuccess: (newEvent) => {
        // Schedule notification for the event
        scheduleNotification(newEvent);
        
        setNewEventTitle('');
        setIsAddingEvent(false);
        setSelectedDate(null);
        const today = new Date();
        setNewEventDate(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
        
        showToast({
          type: 'success',
          title: 'Quest Event Added!',
          message: `"${newEvent.title}" scheduled for ${new Date(newEvent.date).toLocaleDateString()}`
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
    const event = calendarEvents.find((e: CalendarEvent) => e.id === eventId);
    if (!event) return;
    
    showConfirm(
      'Delete Quest Event',
      `Are you sure you want to delete "${event.title}"? This action cannot be undone.`,
      () => {
        deleteEventMutation.mutate(eventId, {
          onSuccess: () => {
            showToast({
              type: 'success',
              title: 'Event Deleted',
              message: `"${event.title}" has been removed from your calendar`
            });
          },
          onError: () => {
            showToast({
              type: 'error',
              title: 'Failed to Delete Event',
              message: 'Please try again'
            });
          }
        });
      },
      'danger'
    );
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
      },
      onError: () => {
        showToast({
          type: 'error',
          title: 'Failed to Update Event',
          message: 'Please try again'
        });
      }
    });
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

        {/* Calendar Grid - Compact Version */}
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {/* Day headers */}
          {dayNames.map(day => (
            <div key={day} className="text-center p-1 md:p-2 text-gray-400 font-semibold text-xs md:text-sm">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="h-12 md:h-16" />;
            }
            
            const dayEvents = getEventsForDate(day);
            const isToday = new Date().getDate() === day && 
                           new Date().getMonth() === currentDate.getMonth() && 
                           new Date().getFullYear() === currentDate.getFullYear();
            
            return (
              <div
                key={`${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`}
                className={`h-12 md:h-16 p-1 md:p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  isToday 
                    ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/50' 
                    : 'hover:bg-white/5'
                } ${dayEvents.length > 0 ? 'ring-1 ring-cyan-500/30' : ''}`}
                onClick={() => handleDateClick(day)}
              >
                <div className="text-white font-semibold text-xs md:text-sm mb-1">{day}</div>
                <div className="space-y-0.5">
                  {dayEvents.slice(0, 1).map(event => (
                    <div
                      key={event.id}
                      className={`text-xs px-1 py-0.5 rounded border ${getEventTypeColor(event.type)} ${
                        event.completed ? 'opacity-60 line-through' : ''
                      }`}
                    >
                      {event.title.length > 6 ? event.title.substring(0, 6) + '...' : event.title}
                    </div>
                  ))}
                  {dayEvents.length > 1 && (
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
              Events for {new Date(selectedDate).toLocaleDateString('en-GB')}
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
                placeholder="DD/MM/YYYY"
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
      {confirmDialog}
    </div>
  );
}