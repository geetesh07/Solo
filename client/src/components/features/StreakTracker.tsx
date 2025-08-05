import { useState, useEffect } from "react";
import { Flame, Trophy, Star, Target, Calendar, Zap, Crown, Shield, Sword } from "lucide-react";
import { showToast } from "@/components/ui/toast";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCompletionDate: string;
  totalCompletions: number;
  weeklyProgress: boolean[];
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  streak: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface StreakTrackerProps {
  completedGoalsToday: number;
  totalGoalsToday: number;
  onStreakUpdate?: (streak: number) => void;
}

export function StreakTracker({ completedGoalsToday, totalGoalsToday, onStreakUpdate }: StreakTrackerProps) {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastCompletionDate: '',
    totalCompletions: 0,
    weeklyProgress: [false, false, false, false, false, false, false],
    achievements: []
  });

  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);
  const [isStreakActive, setIsStreakActive] = useState(false);

  const achievements: Achievement[] = [
    { id: 'first-day', title: 'First Step', description: 'Complete your first day', icon: '🎯', streak: 1, rarity: 'common' },
    { id: 'three-days', title: 'Getting Started', description: '3 days in a row', icon: '🔥', streak: 3, rarity: 'common' },
    { id: 'week-warrior', title: 'Week Warrior', description: '7 days streak', icon: '⚔️', streak: 7, rarity: 'rare' },
    { id: 'fortnight-fighter', title: 'Fortnight Fighter', description: '14 days streak', icon: '🛡️', streak: 14, rarity: 'rare' },
    { id: 'month-master', title: 'Month Master', description: '30 days streak', icon: '👑', streak: 30, rarity: 'epic' },
    { id: 'quarter-champion', title: 'Quarter Champion', description: '90 days streak', icon: '💎', streak: 90, rarity: 'epic' },
    { id: 'half-year-hero', title: 'Half-Year Hero', description: '180 days streak', icon: '⭐', streak: 180, rarity: 'legendary' },
    { id: 'year-legend', title: 'Year Legend', description: '365 days streak', icon: '🏆', streak: 365, rarity: 'legendary' }
  ];

  useEffect(() => {
    // Load streak data from localStorage
    const savedData = localStorage.getItem('hunter-streak-data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setStreakData(parsed);
    }
  }, []);

  useEffect(() => {
    // Save streak data to localStorage
    localStorage.setItem('hunter-streak-data', JSON.stringify(streakData));
    onStreakUpdate?.(streakData.currentStreak);
  }, [streakData, onStreakUpdate]);

  useEffect(() => {
    // Check if today's goals are completed
    const today = new Date().toDateString();
    const hasCompletedToday = completedGoalsToday > 0 && completedGoalsToday === totalGoalsToday && totalGoalsToday > 0;
    
    if (hasCompletedToday && streakData.lastCompletionDate !== today) {
      updateStreak();
    }
    
    setIsStreakActive(hasCompletedToday);
  }, [completedGoalsToday, totalGoalsToday, streakData.lastCompletionDate]);

  const updateStreak = () => {
    const today = new Date();
    const todayString = today.toDateString();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();

    setStreakData(prev => {
      let newStreak = prev.currentStreak;
      
      // If last completion was yesterday, continue streak
      if (prev.lastCompletionDate === yesterdayString) {
        newStreak = prev.currentStreak + 1;
      } 
      // If last completion was today, don't update
      else if (prev.lastCompletionDate === todayString) {
        return prev;
      }
      // Otherwise, start new streak
      else {
        newStreak = 1;
      }

      const newLongestStreak = Math.max(prev.longestStreak, newStreak);
      const newTotalCompletions = prev.totalCompletions + 1;

      // Update weekly progress
      const dayOfWeek = today.getDay();
      const newWeeklyProgress = [...prev.weeklyProgress];
      newWeeklyProgress[dayOfWeek] = true;

      // Check for new achievements
      const newAchievements = [...prev.achievements];
      achievements.forEach(achievement => {
        if (newStreak >= achievement.streak && !newAchievements.some(a => a.id === achievement.id)) {
          const unlockedAchievement = { ...achievement, unlockedAt: new Date().toISOString() };
          newAchievements.push(unlockedAchievement);
          setShowAchievement(unlockedAchievement);
          
          showToast({
            type: 'success',
            title: 'Achievement Unlocked!',
            message: `${achievement.title} - ${achievement.description}`
          });
        }
      });

      return {
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastCompletionDate: todayString,
        totalCompletions: newTotalCompletions,
        weeklyProgress: newWeeklyProgress,
        achievements: newAchievements
      };
    });
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 365) return 'from-purple-500 to-pink-500';
    if (streak >= 180) return 'from-yellow-500 to-orange-500';
    if (streak >= 90) return 'from-blue-500 to-purple-500';
    if (streak >= 30) return 'from-green-500 to-blue-500';
    if (streak >= 7) return 'from-orange-500 to-red-500';
    if (streak >= 3) return 'from-yellow-500 to-orange-400';
    return 'from-gray-500 to-gray-400';
  };

  const getStreakTitle = (streak: number) => {
    if (streak >= 365) return 'Legendary Hunter';
    if (streak >= 180) return 'Epic Hunter';
    if (streak >= 90) return 'Master Hunter';
    if (streak >= 30) return 'Elite Hunter';
    if (streak >= 7) return 'Veteran Hunter';
    if (streak >= 3) return 'Rising Hunter';
    return 'Novice Hunter';
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'legendary': return 'from-purple-400 to-pink-400';
      case 'epic': return 'from-orange-400 to-yellow-400';
      case 'rare': return 'from-blue-400 to-cyan-400';
      default: return 'from-gray-400 to-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Main Streak Display */}
      <div className="mystical-card p-6 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-r ${getStreakColor(streakData.currentStreak)} opacity-10`} />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 bg-gradient-to-r ${getStreakColor(streakData.currentStreak)} rounded-full flex items-center justify-center shadow-lg`}>
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white font-['Orbitron']">
                  {streakData.currentStreak} Day Streak
                </h2>
                <p className="text-gray-400">{getStreakTitle(streakData.currentStreak)}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-gray-400 text-sm">Best Streak</p>
              <p className="text-white font-bold">{streakData.longestStreak} days</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${getStreakColor(streakData.currentStreak)} transition-all duration-1000 ease-out relative`}
              style={{ width: `${Math.min((completedGoalsToday / Math.max(totalGoalsToday, 1)) * 100, 100)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">
              Today: {completedGoalsToday}/{totalGoalsToday} goals
            </span>
            <span className={`font-semibold ${isStreakActive ? 'text-green-400' : 'text-yellow-400'}`}>
              {isStreakActive ? '🔥 Streak Active!' : '⏳ Complete goals to continue streak'}
            </span>
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="mystical-card p-6">
        <h3 className="text-lg font-bold text-white font-['Orbitron'] mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Weekly Progress
        </h3>
        
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <div key={day} className="text-center">
              <p className="text-gray-400 text-xs mb-2">{day}</p>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                streakData.weeklyProgress[index] 
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 shadow-lg shadow-green-500/25' 
                  : 'bg-gray-700 border border-gray-600'
              }`}>
                {streakData.weeklyProgress[index] && <Star className="w-4 h-4 text-white" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="mystical-card p-4 text-center">
          <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{streakData.totalCompletions}</p>
          <p className="text-gray-400 text-sm">Total Completions</p>
        </div>
        
        <div className="mystical-card p-4 text-center">
          <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{streakData.achievements.length}</p>
          <p className="text-gray-400 text-sm">Achievements</p>
        </div>
        
        <div className="mystical-card p-4 text-center">
          <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{Math.round((streakData.currentStreak / Math.max(streakData.longestStreak, 1)) * 100)}%</p>
          <p className="text-gray-400 text-sm">Current vs Best</p>
        </div>
      </div>

      {/* Achievements */}
      <div className="mystical-card p-6">
        <h3 className="text-lg font-bold text-white font-['Orbitron'] mb-4 flex items-center">
          <Crown className="w-5 h-5 mr-2" />
          Achievements
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map(achievement => {
            const isUnlocked = streakData.achievements.some(a => a.id === achievement.id);
            const unlockedData = streakData.achievements.find(a => a.id === achievement.id);
            
            return (
              <div key={achievement.id} className={`p-4 rounded-lg border transition-all duration-300 ${
                isUnlocked 
                  ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)}/10 border-current shadow-lg` 
                  : 'bg-gray-800/50 border-gray-700'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-2xl ${
                    isUnlocked ? 'bg-white/10' : 'bg-gray-700 grayscale opacity-50'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-sm ${isUnlocked ? 'text-gray-300' : 'text-gray-600'}`}>
                      {achievement.description}
                    </p>
                    {isUnlocked && unlockedData?.unlockedAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        Unlocked: {formatDate(unlockedData.unlockedAt)}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${isUnlocked ? 'text-green-400' : 'text-gray-500'}`}>
                      {achievement.streak} days
                    </p>
                    <p className={`text-xs capitalize ${isUnlocked ? getRarityColor(achievement.rarity).replace('from-', 'text-').replace(' to-', '').split('-')[1] : 'text-gray-600'}`}>
                      {achievement.rarity}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievement Popup */}
      {showAchievement && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="mystical-card max-w-md w-full p-8 text-center relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-r ${getRarityColor(showAchievement.rarity)} opacity-20 animate-pulse`} />
            
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-6 text-6xl animate-bounce">
                {showAchievement.icon}
              </div>
              
              <h2 className="text-2xl font-bold text-white font-['Orbitron'] mb-2">
                Achievement Unlocked!
              </h2>
              
              <h3 className={`text-xl font-semibold mb-2 bg-gradient-to-r ${getRarityColor(showAchievement.rarity)} bg-clip-text text-transparent`}>
                {showAchievement.title}
              </h3>
              
              <p className="text-gray-300 mb-6">{showAchievement.description}</p>
              
              <div className="flex justify-center space-x-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{showAchievement.streak}</p>
                  <p className="text-gray-400 text-sm">Days</p>
                </div>
                <div className="text-center">
                  <p className={`text-xl font-bold capitalize bg-gradient-to-r ${getRarityColor(showAchievement.rarity)} bg-clip-text text-transparent`}>
                    {showAchievement.rarity}
                  </p>
                  <p className="text-gray-400 text-sm">Rarity</p>
                </div>
              </div>
              
              <button
                onClick={() => setShowAchievement(null)}
                className="power-button"
              >
                Continue Journey
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}