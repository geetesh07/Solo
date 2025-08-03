import { Calendar, BarChart3, TrendingUp, Clock } from "lucide-react";

interface AnalyticsDashboardProps {
  // Analytics data props would go here
}

export function AnalyticsDashboard({ }: AnalyticsDashboardProps) {
  // Mock data for demonstration - replace with real data
  const weeklyData = [
    { day: 'Mon', completed: 8, total: 10 },
    { day: 'Tue', completed: 12, total: 15 },
    { day: 'Wed', completed: 6, total: 8 },
    { day: 'Thu', completed: 15, total: 18 },
    { day: 'Fri', completed: 10, total: 12 },
    { day: 'Sat', completed: 7, total: 9 },
    { day: 'Sun', completed: 5, total: 6 },
  ];

  const categoryStats = [
    { name: 'Main Mission', completed: 15, total: 20, color: 'from-red-500 to-red-400' },
    { name: 'Training', completed: 22, total: 25, color: 'from-blue-500 to-blue-400' },
    { name: 'Side Quests', completed: 10, total: 15, color: 'from-green-500 to-green-400' },
  ];

  return (
    <div className="space-y-8">
      {/* Analytics Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-['Orbitron']">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              ANALYTICS DASHBOARD
            </span>
          </h2>
          <p className="text-gray-400 mt-1">Track your productivity and progress over time</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
          <span className="text-cyan-400 text-sm font-medium">Live Data</span>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="mystical-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-['Orbitron']">Weekly Progress</h3>
            <p className="text-gray-400 text-sm">Task completion over the last 7 days</p>
          </div>
        </div>

        {/* Chart */}
        <div className="space-y-4">
          {weeklyData.map((day) => {
            const percentage = (day.completed / day.total) * 100;
            return (
              <div key={day.day} className="flex items-center space-x-4">
                <div className="w-12 text-gray-400 text-sm font-medium">{day.day}</div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{day.completed}/{day.total} tasks</span>
                    <span className="text-cyan-400 font-semibold">{percentage.toFixed(0)}%</span>
                  </div>
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Performance */}
      <div className="mystical-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-['Orbitron']">Category Performance</h3>
            <p className="text-gray-400 text-sm">Progress across different goal categories</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categoryStats.map((category) => {
            const percentage = (category.completed / category.total) * 100;
            return (
              <div key={category.name} className="mystical-card p-4">
                <h4 className="text-white font-semibold mb-2">{category.name}</h4>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">{category.completed}/{category.total}</span>
                  <span className="text-white font-semibold">{percentage.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${category.color} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Time Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="mystical-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Orbitron']">Peak Hours</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Most Productive</span>
              <span className="text-amber-400 font-semibold">2:00 PM - 4:00 PM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Average Session</span>
              <span className="text-amber-400 font-semibold">45 minutes</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Best Day</span>
              <span className="text-amber-400 font-semibold">Thursday</span>
            </div>
          </div>
        </div>

        <div className="mystical-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Orbitron']">This Month</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Goals Completed</span>
              <span className="text-green-400 font-semibold">127</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Success Rate</span>
              <span className="text-green-400 font-semibold">89%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Streak Record</span>
              <span className="text-green-400 font-semibold">21 days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}