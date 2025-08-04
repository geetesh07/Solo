import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { AppSidebar } from "../components/layout/AppSidebar";
import { TopBar } from "../components/layout/TopBar";
import { useGoals } from "@/hooks/useGoals";
import { Crown, Star, CheckCircle, Calendar, BarChart3, Target, Plus, X, Bell, Trash2, Check, Menu, Flame } from "lucide-react";
import { AnalyticsDashboard } from "../components/analytics/AnalyticsDashboard";
import { CalendarView } from "../components/calendar/CalendarView";
import { Settings } from "./Settings";
import { MorningModal } from "@/components/modals/MorningModal";
import { ShadowArchives } from "../components/features/ShadowArchives";
import { OnboardingModal } from "@/components/modals/OnboardingModal";
import { MotivationalGreeting } from "@/components/ui/MotivationalGreeting";
import { StreakTracker } from "../components/features/StreakTracker";
import { showToast } from "@/components/ui/Toast";
import { PWAInstall } from "@/components/features/PWAInstall";
import { serviceWorkerManager, HunterNotifications } from "@/lib/serviceWorker";

interface Goal {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

interface Category {
  id: string;
  name: string;
  goals: Goal[];
  icon: string;
  color: string;
}

function Dashboard() {
  const { user } = useAuth();
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
    const lastGreeting = localStorage.getItem('last-greeting-date');
    const today = new Date().toDateString();
    
    if (lastGreeting !== today) {
      setShowGreeting(true);
      localStorage.setItem('last-greeting-date', today);
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
      }
    });
  }, []);

  // Categories with goals state - load from localStorage
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('hunter-categories-with-goals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved categories:', e);
      }
    }
    return [
      {
        id: 'main-mission',
        name: 'Main Mission',
        goals: [],
        icon: '⚔️',
        color: 'from-red-500 to-red-400'
      },
      {
        id: 'training',
        name: 'Training',
        goals: [],
        icon: '🛡️',
        color: 'from-blue-500 to-blue-400'
      },
      {
        id: 'side-quest',
        name: 'Side Quest',
        goals: [],
        icon: '⭐',
        color: 'from-green-500 to-green-400'
      }
    ];
  });

  const [newGoal, setNewGoal] = useState({ 
    title: '', 
    categoryId: '', 
    priority: 'medium' as 'low' | 'medium' | 'high', 
    dueDate: new Date().toISOString().split('T')[0] // Default to today
  });
  const [isAddingGoal, setIsAddingGoal] = useState<string | null>(null);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('hunter-categories-with-goals', JSON.stringify(categories));
  }, [categories]);

  // Auto-remove expired quests and update efficiency
  useEffect(() => {
    const now = new Date();
    now.setHours(23, 59, 59, 999); // End of today
    
    setCategories(prev => prev.map(cat => ({
      ...cat,
      goals: cat.goals.filter(goal => {
        if (!goal.dueDate) return true; // Keep goals without due dates
        
        const dueDate = new Date(goal.dueDate);
        dueDate.setHours(23, 59, 59, 999);
        
        // If goal is overdue and not completed, remove it
        if (dueDate < now && !goal.completed) {
          showToast({
            type: 'warning',
            title: 'Quest Expired!',
            message: `"${goal.title}" has been removed due to missed deadline`,
            duration: 6000
          });
          return false;
        }
        return true;
      })
    })));
  }, []); // Run once on component mount

  // Check for expired quests every hour
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      now.setHours(23, 59, 59, 999);
      
      setCategories(prev => prev.map(cat => ({
        ...cat,
        goals: cat.goals.filter(goal => {
          if (!goal.dueDate) return true;
          
          const dueDate = new Date(goal.dueDate);
          dueDate.setHours(23, 59, 59, 999);
          
          if (dueDate < now && !goal.completed) {
            showToast({
              type: 'warning',
              title: 'Quest Expired!',
              message: `"${goal.title}" has been removed due to missed deadline`,
              duration: 6000
            });
            return false;
          }
          return true;
        })
      })));
    }, 3600000); // Check every hour

    return () => clearInterval(interval);
  }, []);

  // Calculate dynamic user stats from actual goals
  const totalGoals = categories.flatMap(cat => cat.goals).length;
  const completedGoals = categories.flatMap(cat => cat.goals).filter(g => g.completed).length;
  const currentXP = completedGoals * 25; // 25 XP per completed goal
  const level = Math.floor(currentXP / 100) + 1;
  const maxXP = level * 100;
  const currentLevelXP = currentXP % 100;
  const streak = 0; // Could be calculated from completion dates
  const rank = level <= 2 ? "E-Rank" : level <= 5 ? "D-Rank" : level <= 10 ? "C-Rank" : level <= 15 ? "B-Rank" : level <= 25 ? "A-Rank" : "S-Rank";

  const handleAddGoal = (categoryId: string) => {
    if (!newGoal.title.trim()) return;
    
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      completed: false,
      priority: newGoal.priority,
      dueDate: newGoal.dueDate || undefined
    };

    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, goals: [...cat.goals, goal] }
        : cat
    ));

    setNewGoal({ title: '', categoryId: '', priority: 'medium', dueDate: new Date().toISOString().split('T')[0] });
    setIsAddingGoal(null);
  };

  const handleToggleGoal = (categoryId: string, goalId: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? {
            ...cat,
            goals: cat.goals.map(goal => 
              goal.id === goalId 
                ? { ...goal, completed: !goal.completed }
                : goal
            )
          }
        : cat
    ));
  };

  const handleDeleteGoal = (categoryId: string, goalId: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, goals: cat.goals.filter(goal => goal.id !== goalId) }
        : cat
    ));
  };

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
          <div className={`flex space-x-5 text-center ${completedGoals === 0 && streak === 0 ? 'hidden md:flex' : 'flex'}`}>
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

      {/* Enhanced Stats Grid - Mobile Optimized */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        {[
          { label: 'COMPLETED', value: completedGoals, icon: CheckCircle, color: 'text-green-400', bg: 'from-green-900/20 to-green-800/10' },
          { label: 'STREAK', value: streak, icon: Star, color: 'text-amber-400', bg: 'from-amber-900/20 to-amber-800/10' },
          { label: 'THIS WEEK', value: categories.flatMap(cat => cat.goals).filter(g => g.completed).length, icon: Calendar, color: 'text-blue-400', bg: 'from-blue-900/20 to-blue-800/10' },
          { label: 'EFFICIENCY', value: totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0, icon: BarChart3, color: 'text-purple-400', bg: 'from-purple-900/20 to-purple-800/10', suffix: '%' }
        ].map((stat, index) => (
          <div key={index} className={`bg-gradient-to-br ${stat.bg} border border-gray-700/30 rounded-lg p-2 md:p-4 text-center shadow-lg backdrop-blur-sm min-h-[80px] flex flex-col justify-center`}>
            <stat.icon className={`w-4 h-4 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 ${stat.color}`} />
            <div className="text-lg md:text-xl font-bold text-white mb-0.5 md:mb-1">
              {stat.value}{stat.suffix || ''}
            </div>
            <div className="text-[10px] md:text-xs text-gray-400 font-medium leading-tight">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Active Quests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white font-['Orbitron']">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ACTIVE QUESTS
            </span>
          </h2>
          <button 
            onClick={() => setIsOnboardingOpen(true)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg"
          >
            📖 Tutorial
          </button>
        </div>

        {/* Quest Categories */}
        {categories.map((category) => (
          <div key={category.id} className={`bg-gradient-to-br from-gray-900/60 to-gray-800/40 border rounded-xl overflow-hidden shadow-xl backdrop-blur-sm ${
            category.id === 'main-mission' ? 'border-red-500/30 shadow-red-500/10' :
            category.id === 'training' ? 'border-blue-500/30 shadow-blue-500/10' :
            'border-green-500/30 shadow-green-500/10'
          }`}>
            {/* Category Header */}
            <div className={`p-4 border-b ${
              category.id === 'main-mission' ? 'border-red-500/20 bg-gradient-to-r from-red-900/20 to-transparent' :
              category.id === 'training' ? 'border-blue-500/20 bg-gradient-to-r from-blue-900/20 to-transparent' :
              'border-green-500/20 bg-gradient-to-r from-green-900/20 to-transparent'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h3 className={`font-bold font-['Orbitron'] ${
                      category.id === 'main-mission' ? 'text-red-400' :
                      category.id === 'training' ? 'text-blue-400' :
                      'text-green-400'
                    }`}>{category.name}</h3>
                    <span className="text-sm text-gray-400">({category.goals.length} active quests)</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddingGoal(category.id)}
                  className={`px-3 py-2 rounded-lg font-medium text-sm transition-all shadow-lg ${
                    category.id === 'main-mission' ? 'bg-red-600 hover:bg-red-700 text-white hover:shadow-red-500/25' :
                    category.id === 'training' ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-500/25' :
                    'bg-green-600 hover:bg-green-700 text-white hover:shadow-green-500/25'
                  }`}
                >
                  <Plus className="w-4 h-4 mr-1 inline" />
                  Add Goal
                </button>
              </div>
            </div>

            {/* Add Goal Form */}
            {isAddingGoal === category.id && (
              <div className="p-4 bg-gray-800/60 border-b border-gray-700/50">
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Enter your quest objective..."
                    value={newGoal.title}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none shadow-inner"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddGoal(category.id)}
                  />
                  <div className="flex flex-col md:flex-row gap-3">
                    <input
                      type="date"
                      value={newGoal.dueDate}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none min-h-[44px]"
                    />
                    <select
                      value={newGoal.priority}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none min-h-[44px] md:min-w-[140px]"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                  <div className="flex flex-col md:flex-row gap-3">
                    <button
                      onClick={() => handleAddGoal(category.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors shadow-lg min-h-[44px] flex-1 md:flex-none"
                      data-testid="button-create-quest"
                    >
                      Create Quest
                    </button>
                    <button
                      onClick={() => setIsAddingGoal(null)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors min-h-[44px] flex-1 md:flex-none"
                      data-testid="button-cancel-quest"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Goals List */}
            <div className="p-4">
              {category.goals.length === 0 ? (
                <div className="text-center py-6 text-gray-400">
                  <Target className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                  <p className="text-sm">No quests active. Begin your journey by adding a goal!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {category.goals.map((goal) => (
                    <div key={goal.id} className="bg-gray-800/50 border border-gray-700/40 rounded-lg p-3 flex items-center justify-between group transition-all duration-200 hover:bg-gray-800/70">
                      <div className="flex items-center space-x-3 flex-1">
                        <button
                          onClick={() => handleToggleGoal(category.id, goal.id)}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            goal.completed
                              ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/25'
                              : 'border-gray-500 hover:border-green-400 hover:shadow-lg hover:shadow-green-400/25'
                          }`}
                        >
                          {goal.completed && <Check className="w-3 h-3" />}
                        </button>
                        <div className="flex-1">
                          <h4 className={`font-medium ${goal.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                            {goal.title}
                          </h4>
                          <div className="flex items-center space-x-3 text-xs text-gray-400 mt-1">
                            <span className={`px-2 py-1 rounded font-medium ${
                              goal.priority === 'high' ? 'bg-red-900/30 text-red-400 border border-red-500/20' :
                              goal.priority === 'medium' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/20' :
                              'bg-green-900/30 text-green-400 border border-green-500/20'
                            }`}>
                              {goal.priority} priority
                            </span>
                            {goal.dueDate && (
                              <span className="flex items-center bg-gray-700/50 px-2 py-1 rounded">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(goal.dueDate).toLocaleDateString('en-GB')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteGoal(category.id, goal.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-600/20 text-gray-400 hover:text-red-400 transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCalendar = () => (
    <div className="slide-up h-full overflow-y-auto p-4 md:p-6">
      <CalendarView goals={categories.flatMap(cat => 
        cat.goals.map(goal => ({
          ...goal,
          category: cat.name
        }))
      )} />
    </div>
  );

  const renderAnalytics = () => (
    <div className="slide-up p-4 md:p-6">
      <AnalyticsDashboard categories={categories} />
    </div>
  );

  const renderNotes = () => (
    <div className="slide-up h-full">
      <ShadowArchives />
    </div>
  );

  const renderSettings = () => (
    <div className="slide-up h-full">
      <Settings />
    </div>
  );

  const renderStreaks = () => {
    const completedGoalsToday = categories.flatMap(cat => cat.goals).filter(g => g.completed).length;
    const totalGoalsToday = categories.flatMap(cat => cat.goals).length;
    
    return (
      <div className="slide-up p-4 md:p-6">
        <StreakTracker 
          completedGoalsToday={completedGoalsToday}
          totalGoalsToday={totalGoalsToday}
        />
      </div>
    );
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard': return renderDashboard();
      case 'streaks': return renderStreaks();
      case 'calendar': return renderCalendar();
      case 'analytics': return renderAnalytics();
      case 'notes': return renderNotes();
      case 'settings': return renderSettings();
      default: return renderDashboard();
    }
  };

  return (
    <div className="h-screen bg-background text-foreground flex relative overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40 fade-in"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        transition-all duration-300 ease-out
        ${isDesktopSidebarCollapsed ? 'md:w-0 md:overflow-hidden' : 'md:w-64'}
        md:relative md:translate-x-0 md:block
        fixed left-0 top-0 z-50 h-full w-64
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <AppSidebar
          currentView={currentView}
          onViewChange={(view) => {
            const path = view === 'dashboard' ? '/' : `/${view}`;
            setLocation(path);
            setIsMobileSidebarOpen(false);
          }}
          userLevel={level}
          currentXP={currentLevelXP}
          maxXP={100}
          rank={rank}
          user={user}
        />
      </div>
      
      <main className="flex-1 overflow-hidden">
        <TopBar 
          user={user}
          onOpenMorningModal={() => setIsMorningModalOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onToggleDesktopSidebar={() => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)}
          isDesktopSidebarCollapsed={isDesktopSidebarCollapsed}
        />
        
        <div className={`h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden pb-20 md:pb-6 ${
          currentView === 'dashboard' ? 'p-2 md:p-6' : 'p-0'
        }`}>
          <div className="fade-in">
            {renderCurrentView()}
          </div>
        </div>
      </main>

      {/* Morning Planning Modal */}
      <MorningModal 
        isOpen={isMorningModalOpen}
        onClose={() => setIsMorningModalOpen(false)}
      />
      
      {/* Onboarding Modal */}
      <OnboardingModal 
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      {/* Motivational Greeting */}
      {showGreeting && (
        <MotivationalGreeting 
          userName={user?.displayName || 'Hunter'}
          onClose={() => setShowGreeting(false)}
        />
      )}

      {/* PWA Install Prompt */}
      <PWAInstall />
    </div>
  );
}

export { Dashboard };
export default Dashboard;