import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserData";
import { useUserGoals } from "@/hooks/useUserData";
import { TopBar } from "../components/layout/TopBar";
import { Crown, Star, CheckCircle, Calendar, BarChart3, Target, Plus, X, Bell, Trash2, Check, Menu, Flame } from "lucide-react";
import { AnalyticsDashboard } from "../components/analytics/AnalyticsDashboard";
import { CalendarView } from "../components/calendar/CalendarView";
import { Settings } from "./Settings";
import { MorningModal } from "@/components/modals/MorningModal";
import { ShadowArchives } from "../components/features/ShadowArchives";
import { OnboardingModal } from "@/components/modals/OnboardingModal";
import { MotivationalGreeting } from "@/components/ui/MotivationalGreeting";
import { StreakTracker } from "../components/features/StreakTracker";
import { showToast } from "@/components/ui/toast";
import { PWAInstall } from "@/components/features/PWAInstall";
import { serviceWorkerManager, HunterNotifications } from "@/lib/serviceWorker";

function Dashboard() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const { goals, loading: goalsLoading, createGoal, updateGoal, deleteGoal } = useUserGoals();
  
  // CRITICAL: Ensure user is authenticated before rendering anything
  if (!user || !user.uid) {
    return null; // This will cause ProtectedRoutes to redirect to login
  }

  const [location, setLocation] = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Extract current view from URL path
  const getCurrentView = () => {
    if (location === '/' || location === '/dashboard') return 'dashboard';
    const view = location.replace('/', '');
    return view || 'dashboard';
  };
  
  const currentView = getCurrentView();
  const [showGreeting, setShowGreeting] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<'medium' | 'high'>('medium');

  // Initialize service worker and show greeting on first visit of the day
  useEffect(() => {
    const lastGreeting = localStorage.getItem(`last-greeting-${user.uid}`);
    const today = new Date().toDateString();
    
    if (lastGreeting !== today) {
      setShowGreeting(true);
      localStorage.setItem(`last-greeting-${user.uid}`, today);
    }
    
    // Initialize service worker
    serviceWorkerManager.init().then((success) => {
      if (success) {
        console.log('Service Worker initialized successfully');
        
        // Request notification permission
        serviceWorkerManager.requestNotificationPermission().then((permission) => {
          if (permission === 'granted') {
            console.log('Notifications enabled');
            
            // Send daily motivation if it's morning
            const hour = new Date().getHours();
            if (hour >= 8 && hour <= 10 && lastGreeting !== today) {
              setTimeout(() => {
                HunterNotifications.dailyMotivation();
              }, 3000); // 3 second delay
            }
          }
        });
      }
    });
  }, [user.uid]);

  // Calculate stats
  const completedGoals = goals.filter(goal => goal.status === 'completed').length;
  const totalGoals = goals.length;
  const streakCount = profile?.streak || 0;

  const completeGoal = async (goalId: string) => {
    try {
      await updateGoal(goalId, { 
        status: 'completed',
        completedAt: new Date().toISOString()
      });
      showToast({
        type: 'success',
        title: 'Quest Completed!',
        message: `+${25} XP earned!`
      });
      
      // Send celebration notification
      if ('serviceWorker' in navigator) {
        HunterNotifications.questComplete('Quest completed successfully!');
      }
    } catch (error) {
      console.error('Error completing goal:', error);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await deleteGoal(goalId);
      showToast({
        type: 'success',
        title: 'Quest Removed',
        message: 'Quest has been removed from your list'
      });
    } catch (error) {
      console.error('Error deleting goal:', error);
      showToast({
        type: 'error',
        title: 'Delete Failed',
        message: 'Please try again'
      });
    }
  };

  const handleCreateQuest = async (priority: 'medium' | 'high') => {
    if (!newGoalTitle.trim()) return;
    
    try {
      await createGoal({
        title: newGoalTitle.trim(),
        category: 'Main Mission',
        priority: priority,
        status: 'pending',
        xpReward: priority === 'high' ? 50 : 25
      });
      
      setNewGoalTitle('');
      showToast({
        type: 'success',
        title: 'Quest Created!',
        message: 'New quest added to your list'
      });
    } catch (error) {
      console.error('Error creating goal:', error);
      showToast({
        type: 'error',
        title: 'Creation Failed',
        message: 'Please try again'
      });
    }
  };

  // Show loading state
  if (profileLoading || goalsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-cyan-400 font-['Orbitron'] text-xl">Loading Hunter Data...</div>
        </div>
      </div>
    );
  }

  const renderMobileDashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 pb-20">
      {/* Mobile Header */}
      <div className="bg-gradient-to-r from-slate-900/95 to-blue-900/95 backdrop-blur-xl border-b border-blue-500/20 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-cyan-400 font-['Orbitron']">Solo Hunter</h1>
              <p className="text-xs text-gray-400">Tuesday, 05/08/2025</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Hunter Status Card */}
        <div className="bg-gradient-to-br from-blue-900/90 to-blue-800/70 backdrop-blur-xl rounded-3xl p-6 border border-blue-500/30 shadow-2xl">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white">
                {profile?.rank || 'E-Rank'}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-cyan-400 font-['Orbitron'] leading-tight">
                HUNTER
              </h1>
              <h2 className="text-2xl font-bold text-cyan-400 font-['Orbitron'] leading-tight">
                LEVEL {profile?.level || 1}
              </h2>
              <p className="text-gray-300 text-sm mt-1">Welcome back,</p>
              <p className="text-white font-semibold">{user?.displayName || 'Patil Geetesh'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{completedGoals}</div>
              <div className="text-sm text-gray-400">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{streakCount}</div>
              <div className="text-sm text-gray-400">Streak</div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-300 mb-3">
              <span className="font-['Orbitron'] text-cyan-400 font-semibold">EXPERIENCE POINTS</span>
              <span className="text-cyan-400 font-bold">{profile?.xp || 0} / {((profile?.level || 1) * 100)}</span>
            </div>
            <div className="w-full bg-slate-800/60 rounded-full h-4 overflow-hidden border border-cyan-500/30">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 transition-all duration-1000 shadow-lg"
                style={{ width: `${Math.min(((profile?.xp || 0) % 100), 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>Level {profile?.level || 1}</span>
              <span>Next: Level {(profile?.level || 1) + 1}</span>
            </div>
          </div>
        </div>

        {/* Active Quests Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 font-['Orbitron']">Active Quests</h2>
          
          {goals.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r from-slate-700/50 to-slate-600/50 flex items-center justify-center border border-slate-600/30">
                <Target className="w-16 h-16 text-slate-500" strokeWidth={1.5} />
              </div>
              <p className="text-slate-400 text-lg mb-8 px-4 leading-relaxed">
                No active quests. Create your first quest to begin your hunter journey!
              </p>
              
              {/* Quick Add Quest Form */}
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 mx-2">
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter new quest..."
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-600/50 rounded-2xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all text-lg"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newGoalTitle.trim()) {
                        handleCreateQuest(selectedPriority);
                      }
                    }}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => {
                        setSelectedPriority('medium');
                        if (newGoalTitle.trim()) handleCreateQuest('medium');
                      }}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-2xl font-bold text-lg transition-all hover:from-cyan-600 hover:to-blue-700 shadow-lg hover:shadow-cyan-500/25 active:scale-95"
                    >
                      Medium
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedPriority('high');
                        if (newGoalTitle.trim()) handleCreateQuest('high');
                      }}
                      className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-2xl font-bold text-lg transition-all hover:from-orange-600 hover:to-red-700 shadow-lg hover:shadow-orange-500/25 active:scale-95"
                    >
                      High
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => (
                <div key={goal.id} className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-lg mb-2">{goal.title}</h4>
                      {goal.description && (
                        <p className="text-slate-400 text-sm mb-3">{goal.description}</p>
                      )}
                      <div className="flex items-center space-x-3 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          goal.priority === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          goal.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                          {goal.priority.toUpperCase()}
                        </span>
                        <span className="text-cyan-400 font-semibold">+{goal.xpReward} XP</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => completeGoal(goal.id)}
                        className="text-green-400 hover:text-green-300 transition-colors p-2 rounded-lg hover:bg-green-500/10"
                        title="Complete Quest"
                      >
                        <Check className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                        title="Delete Quest"
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add New Quest Button */}
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50">
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter new quest..."
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newGoalTitle.trim()) {
                        handleCreateQuest(selectedPriority);
                      }
                    }}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => {
                        setSelectedPriority('medium');
                        if (newGoalTitle.trim()) handleCreateQuest('medium');
                      }}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold transition-all hover:from-cyan-600 hover:to-blue-700 shadow-lg active:scale-95"
                    >
                      Medium
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedPriority('high');
                        if (newGoalTitle.trim()) handleCreateQuest('high');
                      }}
                      className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl font-semibold transition-all hover:from-orange-600 hover:to-red-700 shadow-lg active:scale-95"
                    >
                      High
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation - Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-blue-500/20 p-4 z-50">
        <div className="flex justify-center">
          <div className="w-1/3 h-1 bg-cyan-400 rounded-full"></div>
        </div>
      </div>

      {/* Modals */}
      {showGreeting && (
        <MotivationalGreeting
          onClose={() => setShowGreeting(false)}
          userName={user?.displayName || 'Hunter'}
        />
      )}

      <PWAInstall />
    </div>
  );

  // For mobile, show the optimized mobile dashboard
  if (currentView === 'dashboard') {
    return renderMobileDashboard();
  }

  // For other views, show the regular layout with navigation
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <TopBar onMenuClick={() => setIsMobileSidebarOpen(true)} user={user} />
      <main className="p-4">
        {currentView === 'analytics' && <AnalyticsDashboard />}
        {currentView === 'calendar' && <CalendarView />}
        {currentView === 'settings' && <Settings />}
        {currentView === 'notes' && <ShadowArchives />}
        {currentView === 'streaks' && <StreakTracker completedGoalsToday={completedGoals} totalGoalsToday={totalGoals} />}
      </main>
    </div>
  );
}

export default Dashboard;