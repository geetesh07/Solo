import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, startOfWeek, endOfWeek } from "date-fns";

interface CalendarViewProps {
  // TODO: Add props for daily stats data
}

export function CalendarView({}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

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

  // Mock data for demonstration - in real app, this would come from props/API
  const getDayStatus = (date: Date) => {
    const dayOfMonth = date.getDate();
    if (dayOfMonth === 8 || dayOfMonth === 10 || dayOfMonth === 15) {
      return 'completed'; // All goals completed
    } else if (dayOfMonth === 9 || dayOfMonth === 16) {
      return 'partial'; // Some goals completed
    } else if (dayOfMonth < new Date().getDate()) {
      return 'failed'; // Past day with no goals completed
    }
    return null; // Future day or no data
  };

  const getStatusStyle = (status: string | null) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 border border-green-500/50 hover:bg-green-500/30';
      case 'partial':
        return 'bg-yellow-500/20 border border-yellow-500/50 hover:bg-yellow-500/30';
      case 'failed':
        return 'bg-red-500/20 border border-red-500/50 hover:bg-red-500/30';
      default:
        return 'hover:bg-gray-700/50';
    }
  };

  const getStatusIndicator = (status: string | null) => {
    switch (status) {
      case 'completed':
        return <div className="text-xs text-green-400 mt-1">✓</div>;
      case 'partial':
        return <div className="text-xs text-yellow-400 mt-1">~</div>;
      case 'failed':
        return <div className="text-xs text-red-400 mt-1">✗</div>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-orbitron font-bold text-2xl text-solo-blue">Quest Calendar</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold px-4">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <button 
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center text-gray-400 font-semibold">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const dayStatus = isCurrentMonth ? getDayStatus(day) : null;
            const isTodayDate = isToday(day);
            
            return (
              <div
                key={index}
                className={`
                  aspect-square p-2 cursor-pointer transition-colors rounded-lg
                  ${!isCurrentMonth ? 'text-gray-500' : ''}
                  ${isTodayDate && isCurrentMonth ? 'bg-solo-blue/20 border-2 border-solo-blue' : getStatusStyle(dayStatus)}
                `}
              >
                <div className={`text-sm font-semibold ${isTodayDate ? 'text-solo-blue' : ''}`}>
                  {day.getDate()}
                </div>
                {isTodayDate && isCurrentMonth ? (
                  <div className="text-xs text-solo-blue mt-1">Today</div>
                ) : (
                  getStatusIndicator(dayStatus)
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500/50 rounded"></div>
            <span className="text-gray-400">All Complete</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500/50 rounded"></div>
            <span className="text-gray-400">Partial</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500/50 rounded"></div>
            <span className="text-gray-400">Incomplete</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-solo-blue/50 rounded"></div>
            <span className="text-gray-400">Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
