import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, X, Save } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'main-mission' | 'training' | 'side-quest';
  completed: boolean;
}

interface VerticalWeekViewProps {
  goals?: Array<{
    id: string;
    title: string;
    dueDate?: string;
    completed: boolean;
    category: string;
  }>;
}

export function VerticalWeekView({ goals = [] }: VerticalWeekViewProps) {
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

  const getWeekDates = (startDate: Date) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const navigateWeek = (direction: number) => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + (direction * 7));
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

  const getEventStyles = (type: string) => {
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
      }
    });
  };

  const toggleEventCompletion = (eventId: string, currentCompleted: boolean) => {
    updateEventMutation.mutate({
      id: eventId,
      data: { completed: !currentCompleted }
    });
  };

  const weekDays = getWeekDates(currentWeekStart);

  const isDateToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getWeekEnd = () => {
    const end = new Date(currentWeekStart);
    end.setDate(currentWeekStart.getDate() + 6);
    return end;
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white font-['Orbitron']">Weekly Quest Calendar</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateWeek(-1)}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors"
            data-testid="button-prev-week"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-sm text-gray-300 px-3">
            {currentWeekStart.toLocaleDateString()} - {getWeekEnd().toLocaleDateString()}
          </span>
          
          <button
            onClick={() => navigateWeek(1)}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors"
            data-testid="button-next-week"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Vertical Week Layout - More Space for Tasks */}
      <div className="space-y-4 mb-4">
        {weekDays.map((day, index) => {
          const dayEvents = getEventsForDate(day);
          const isToday = isDateToday(day);
          
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                isToday 
                  ? 'bg-blue-600/20 border-blue-500/50 shadow-lg shadow-blue-500/20' 
                  : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600/50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-center">
                    <div className="text-xs text-gray-400 uppercase">
                      {day.toLocaleDateString('en', { weekday: 'short' })}
                    </div>
                    <div className={`text-lg font-bold ${isToday ? 'text-blue-300' : 'text-white'}`}>
                      {day.getDate()}
                    </div>
                  </div>
                  <div className="text-sm text-gray-300">
                    {day.toLocaleDateString('en', { month: 'long', day: 'numeric' })}
                    {isToday && <span className="ml-2 text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded">Today</span>}
                  </div>
                </div>
                
                {/* Add Event Button */}
                <button
                  onClick={() => {
                    setNewEventDate(day.toISOString().split('T')[0]);
                    setIsAddingEvent(true);
                  }}
                  className="px-3 py-1 text-xs border border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300 rounded transition-colors"
                  data-testid={`button-add-event-${index}`}
                >
                  <Plus className="w-3 h-3 inline mr-1" />
                  Add Event
                </button>
              </div>
              
              {/* Events Grid - More space for tasks, responsive columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {dayEvents.map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className={`text-sm p-3 rounded cursor-pointer transition-all duration-200 border ${
                      event.completed 
                        ? 'bg-green-600/30 border-green-500/50 text-green-300 line-through'
                        : getEventStyles(event.type)
                    }`}
                    onClick={() => toggleEventCompletion(event.id, event.completed)}
                    title={event.title}
                    data-testid={`event-${event.id}`}
                  >
                    <div className="font-medium mb-1">{event.title}</div>
                    <div className="text-xs text-gray-400 capitalize">
                      {event.type.replace('-', ' ')}
                    </div>
                  </div>
                ))}
                
                {dayEvents.length === 0 && (
                  <div className="col-span-full text-center py-6 text-gray-500 text-sm border-2 border-dashed border-gray-700 rounded-lg">
                    No events scheduled for this day
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Event Modal */}
      {isAddingEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Add New Event</h3>
              <button
                onClick={() => setIsAddingEvent(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Event Title</label>
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  placeholder="Enter event title"
                  data-testid="input-event-title"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">Date</label>
                <input
                  type="date"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  data-testid="input-event-date"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">Type</label>
                <select
                  value={newEventType}
                  onChange={(e) => setNewEventType(e.target.value as 'main-mission' | 'training' | 'side-quest')}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  data-testid="select-event-type"
                >
                  <option value="main-mission">Main Mission</option>
                  <option value="training">Training</option>
                  <option value="side-quest">Side Quest</option>
                </select>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleAddEvent}
                  disabled={!newEventTitle.trim() || createEventMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                  data-testid="button-save-event"
                >
                  <Save className="w-4 h-4 inline mr-2" />
                  {createEventMutation.isPending ? 'Saving...' : 'Save Event'}
                </button>
                <button
                  onClick={() => setIsAddingEvent(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                  data-testid="button-cancel-event"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isLoading && (
        <div className="text-center py-8">
          <div className="text-gray-400">Loading events...</div>
        </div>
      )}
    </div>
  );
}