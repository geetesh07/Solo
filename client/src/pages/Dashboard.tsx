import { useState, useEffect } from "react";
import { Star, CheckCircle, Flame, Crown } from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { GoalCategory } from "@/components/goals/GoalCategory";
import { MorningModal } from "@/components/goals/MorningModal";
import { CalendarView } from "@/components/calendar/CalendarView";
import { AnalyticsView } from "@/components/analytics/AnalyticsView";
import { useAuth } from "@/hooks/useAuth";
import { useGoals } from "@/hooks/useGoals";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function Dashboard() {
  const { user } = useAuth();
  const { categories, loading, addGoal, toggleGoalStatus } = useGoals();
  const { profile } = useUserProfile();
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMorningModalOpen, setIsMorningModalOpen] = useState(false);

  // Show morning modal automatically at 7 AM (can be customized)
  useEffect(() => {
    const checkMorningTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const lastShown = localStorage.getItem('lastMorningPrompt');
      const today = now.toDateString();
      
      // Show at 7 AM if not shown today
      if (hours === 7 && lastShown !== today) {
        setIsMorningModalOpen(true);
        localStorage.setItem('lastMorningPrompt', today);
      }
    };

    const interval = setInterval(checkMorningTime, 60000); // Check every minute
    checkMorningTime(); // Check immediately

    return () => clearInterval(interval);
  }, []);

  const handleAddGoal = async (goalData: any) => {
    if (categories.length === 0) return;
    
    // If no category is selected, use the first available category
    const categoryId = goalData.categoryId || categories[0].id;
    
    await addGoal({
      ...goalData,
      categoryId,
    });
  };

  // Calculate daily stats
  const todaysGoals = categories.flatMap(cat => cat.goals);
  const completedGoals = todaysGoals.filter(goal => goal.status === 'completed');
  const dailyXP = completedGoals.reduce((total, goal) => total + goal.xpValue, 0);

  // Calculate XP for next level
  const currentXP = profile?.currentXP || 0;
  const level = profile?.level || 1;
  const maxXP = 1000; // XP needed per level
  const rank = profile?.rank || 'E-Rank';
  const streak = profile?.streak || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-solo-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-solo-blue to-solo-violet rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-300">Loading your quest data...</p>
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'calendar':
        return <CalendarView />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return (
          <div className="space-y-6">
            {/* Morning Routine Prompt */}
            <div className="bg-gradient-to-r from-solo-indigo/20 to-solo-violet/20 border border-solo-blue/30 rounded-lg p-4 animate-pulse-slow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-orbitron font-bold text-lg text-solo-blue">Morning Quest Briefing</h3>
                  <p className="text-gray-300">What goals do you want to crush today, hunter?</p>
                </div>
                <button 
                  onClick={() => setIsMorningModalOpen(true)}
                  className="bg-gradient-to-r from-solo-blue to-solo-violet px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-solo-blue/25 transition-all"
                >
                  Start Quest
                </button>
              </div>
            </div>

            {/* Today's Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Today's XP</p>
                    <p className="text-2xl font-bold text-green-400">{dailyXP}</p>
                  </div>
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Completed</p>
                    <p className="text-2xl font-bold text-solo-blue">{completedGoals.length} / {todaysGoals.length}</p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Streak</p>
                    <p className="text-2xl font-bold text-orange-400">{streak} days</p>
                  </div>
                  <Flame className="w-6 h-6 text-red-400" />
                </div>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Rank</p>
                    <p className="text-xl font-bold text-solo-violet">{rank}</p>
                  </div>
                  <Crown className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </div>

            {/* Goal Categories */}
            <div className="space-y-6">
              {categories.map((category) => (
                <GoalCategory
                  key={category.id}
                  category={category}
                  onToggleGoal={toggleGoalStatus}
                  onAddGoal={() => setIsMorningModalOpen(true)}
                />
              ))}
              
              {categories.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Crown className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">No Quest Categories Yet</h3>
                  <p className="text-gray-400 mb-4">Start your hunter journey by adding your first quest!</p>
                  <button 
                    onClick={() => setIsMorningModalOpen(true)}
                    className="bg-gradient-to-r from-solo-blue to-solo-violet px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-solo-blue/25 transition-all"
                  >
                    Begin Your Journey
                  </button>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-solo-dark text-white font-inter flex">
      <AppSidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        userLevel={level}
        currentXP={currentXP}
        maxXP={maxXP}
        rank={rank}
      />
      
      <main className="flex-1 overflow-hidden">
        <TopBar 
          user={user}
          onOpenMorningModal={() => setIsMorningModalOpen(true)}
        />
        
        <div className="p-6 h-full overflow-y-auto">
          {renderCurrentView()}
        </div>
      </main>

      <MorningModal
        isOpen={isMorningModalOpen}
        onClose={() => setIsMorningModalOpen(false)}
        categories={categories}
        onAddGoal={handleAddGoal}
      />
    </div>
  );
}
