import { Progress } from "@/components/ui/progress";
import { Trophy, Star } from "lucide-react";

interface AnalyticsViewProps {
  // TODO: Add props for analytics data
}

export function AnalyticsView({}: AnalyticsViewProps) {
  // Mock data - in real app this would come from props/API
  const weeklyData = [
    { day: 'Mon', percentage: 80 },
    { day: 'Tue', percentage: 90 },
    { day: 'Wed', percentage: 75 },
    { day: 'Thu', percentage: 85 },
    { day: 'Fri', percentage: 95 },
    { day: 'Sat', percentage: 70 },
    { day: 'Sun', percentage: 88 },
  ];

  const categoryBreakdown = [
    { name: 'Main Missions', completed: 24, total: 30, color: 'red' },
    { name: 'Training', completed: 18, total: 20, color: 'blue' },
    { name: 'Side Quests', completed: 45, total: 50, color: 'green' },
  ];

  const achievements = [
    {
      title: '15-Day Streak',
      subtitle: 'Legendary Hunter',
      icon: Trophy,
      color: 'yellow',
    },
    {
      title: 'Level 23 Reached',
      subtitle: 'Shadow Monarch',
      icon: Star,
      color: 'blue',
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      red: 'bg-red-400',
      blue: 'bg-blue-400',
      green: 'bg-green-400',
      yellow: 'bg-yellow-400',
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-400';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h2 className="font-orbitron font-bold text-2xl text-solo-blue">Progress Analytics</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weekly Performance */}
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Weekly Performance</h3>
          <div className="space-y-3">
            {weeklyData.map((item) => (
              <div key={item.day} className="flex justify-between items-center">
                <span className="text-gray-400">{item.day}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm w-8">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Achievement Breakdown */}
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Achievement Breakdown</h3>
          <div className="space-y-4">
            {categoryBreakdown.map((category) => {
              const percentage = (category.completed / category.total) * 100;
              return (
                <div key={category.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-400">{category.name}</span>
                    <span className="text-sm">{category.completed}/{category.total}</span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="h-2"
                  />
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Recent Achievements */}
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Recent Achievements</h3>
          <div className="space-y-3">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-8 h-8 ${getColorClasses(achievement.color)}/20 rounded-full flex items-center justify-center`}>
                    <IconComponent className={`w-4 h-4 text-${achievement.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{achievement.title}</p>
                    <p className="text-xs text-gray-400">{achievement.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Additional Analytics Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* XP Progression */}
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">XP Progression (Last 7 Days)</h3>
          <div className="space-y-2">
            {[120, 80, 150, 95, 200, 110, 180].map((xp, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Day {index + 1}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-solo-blue h-2 rounded-full" 
                      style={{ width: `${(xp / 200) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm w-10">{xp} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Streak Information */}
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Streak Information</h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-1">15</div>
              <div className="text-sm text-gray-400">Current Streak</div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-solo-blue">23</div>
                <div className="text-xs text-gray-400">Longest Streak</div>
              </div>
              <div>
                <div className="text-xl font-bold text-green-400">87%</div>
                <div className="text-xs text-gray-400">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
