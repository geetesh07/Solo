import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserData";
import { useUserGoals } from "@/hooks/useUserData";
import { AppSidebar } from "../components/layout/AppSidebar";
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
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  
  // Extract current view from URL path
  const getCurrentView = () => {
    if (location === '/' || location === '/dashboard') return 'dashboard';
    const view = location.replace('/', '');
    return view || 'dashboard';
  };
  
  const currentView = getCurrentView();
  const [isMorningModalOpen, setIsMorningModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);

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
        
        // Enable background sync
        serviceWorkerManager.enableBackgroundSync();
        
        // Subscribe to push notifications
        serviceWorkerManager.subscribeToPushNotifications();
      } else {
        console.log('Service Worker not available, using fallback notifications');
      }
    });
  }, [user.uid]);

  const [newGoal, setNewGoal] = useState({ 
    title: '', 
    categoryId: '', 
    priority: 'medium' as 'low' | 'medium' | 'high', 
    dueDate: new Date().toISOString().split('T')[0] // Default to today
  });
  const [isAddingGoal, setIsAddingGoal] = useState<string | null>(null);

  // Calculate dynamic user stats from actual goals
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const currentXP = profile?.xp || 0;
  const level = profile?.level || 1;
  const currentLevelXP = currentXP % 100;
  const streak = profile?.streak || 0;
  const rank = profile?.rank || "E-Rank";

  // Firebase-based goal management functions
  const handleAddGoal = async (categoryId: string) => {
    if (!newGoal.title.trim()) return;
    
    try {
      await createGoal({
        title: newGoal.title,
        category: categoryId,
        priority: newGoal.priority,
        dueDate: newGoal.dueDate || undefined,
        status: 'pending',
        xpReward: 25
      });
      
      setNewGoal({ 
        title: '', 
        categoryId: '', 
        priority: 'medium', 
        dueDate: new Date().toISOString().split('T')[0] 
      });
      setIsAddingGoal(null);
      
      showToast({
        type: 'success',
        title: 'Quest Added!',
        message: `"${newGoal.title}" has been added to your quest list`
      });
    } catch (error) {
      console.error('Error adding goal:', error);
      showToast({
        type: 'error',
        title: 'Failed to Add Quest',
        message: 'Please try again'
      });
    }
  };

  const handleToggleGoal = async (goalId: string) => {
    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) return;
      
      await updateGoal(goalId, {
        status: goal.status === 'completed' ? 'pending' : 'completed',
        completedAt: goal.status === 'completed' ? undefined : new Date().toISOString()
      });
      
      if (goal.status !== 'completed') {
        showToast({
          type: 'success',
          title: 'Quest Completed!',
          message: `"${goal.title}" marked as complete. XP gained!`
        });
      }
    } catch (error) {
      console.error('Error toggling goal:', error);
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Please try again'
      });
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await deleteGoal(goalId);
      showToast({
        type: 'success',
        title: 'Quest Deleted',
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

  const renderDashboard = () => (
    <div className="space-y-5">
      {/* Hunter Status Window */}
      <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/80 border border-cyan-500/20 rounded-xl p-5 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">
                {rank}
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white font-['Orbitron']">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  HUNTER LEVEL {level}
                </span>
              </h1>
              <p className="text-gray-300">Welcome back, {user?.displayName || 'Hunter'}</p>
            </div>
          </div>
          <div className="flex space-x-5 text-center">
            <div>
              <div className="text-xl font-bold text-green-400">{completedGoals}</div>
              <div className="text-xs text-gray-400">Completed</div>
            </div>
            <div>
              <div className="text-xl font-bold text-amber-400">{streak}</div>
              <div className="text-xs text-gray-400">Streak</div>
            </div>
            <div>
              <div className="text-xl font-bold text-blue-400">{totalGoals - completedGoals}</div>
              <div className="text-xs text-gray-400">Active</div>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300 font-semibold">EXPERIENCE POINTS</span>
            <span className="text-cyan-400 font-bold">{currentLevelXP} / 100</span>
          </div>
          <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-amber-400 rounded-full transition-all duration-1000"
              style={{ width: `${(currentLevelXP / 100) * 100}%` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Level {level}</span>
            <span>Next: Level {level + 1}</span>
          </div>
        </div>
      </div>

      {/* Goals Display */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white font-['Orbitron']">Active Quests</h2>
        {totalGoals === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No active quests. Create your first quest to begin your hunter journey!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {goals.map((goal) => (
              <div key={goal.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleToggleGoal(goal.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      goal.status === 'completed'
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-400 hover:border-green-500'
                    }`}
                  >
                    {goal.status === 'completed' && <Check className="w-4 h-4" />}
                  </button>
                  <div>
                    <h3 className={`font-medium ${goal.status === 'completed' ? 'text-gray-400 line-through' : 'text-white'}`}>
                      {goal.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {goal.category} • {goal.priority} priority
                      {goal.dueDate && ` • Due: ${new Date(goal.dueDate).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Goal Section */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            placeholder="Enter new quest..."
            className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
          />
          <select
            value={newGoal.priority}
            onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as 'low' | 'medium' | 'high' })}
            className="bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            type="date"
            value={newGoal.dueDate}
            onChange={(e) => setNewGoal({ ...newGoal, dueDate: e.target.value })}
            className="bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
          />
          <button
            onClick={() => handleAddGoal('main-mission')}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex">
      {/* Desktop Sidebar */}
      <div className={`hidden lg:block transition-all duration-300 ${isDesktopSidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <AppSidebar
          currentView={currentView}
          onViewChange={(view) => setLocation(view === 'dashboard' ? '/' : `/${view}`)}
          collapsed={isDesktopSidebarCollapsed}
          onToggleCollapse={() => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40" 
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="lg:hidden fixed left-0 top-0 h-full w-64 z-50">
            <AppSidebar
              currentView={currentView}
              onViewChange={(view) => {
                setLocation(view === 'dashboard' ? '/' : `/${view}`);
                setIsMobileSidebarOpen(false);
              }}
            />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar 
          onMenuClick={() => setIsMobileSidebarOpen(true)}
          user={user}
        />
        
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {currentView === 'dashboard' && renderDashboard()}
          {currentView === 'analytics' && <AnalyticsDashboard />}
          {currentView === 'calendar' && <CalendarView />}
          {currentView === 'settings' && <Settings />}
          {currentView === 'notes' && <ShadowArchives />}
          {currentView === 'streaks' && <StreakTracker completedGoalsToday={completedGoals} totalGoalsToday={totalGoals} />}
        </main>
      </div>

      {/* Modals */}
      {showGreeting && (
        <MotivationalGreeting
          onClose={() => setShowGreeting(false)}
          userName={user?.displayName || 'Hunter'}
        />
      )}
      
      {isMorningModalOpen && (
        <MorningModal isOpen={isMorningModalOpen} onClose={() => setIsMorningModalOpen(false)} />
      )}
      
      {isOnboardingOpen && (
        <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
      )}

      <PWAInstall />
    </div>
  );
}

export default Dashboard;