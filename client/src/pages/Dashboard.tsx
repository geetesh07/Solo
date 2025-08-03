import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { GoalCategory } from "@/components/goals/GoalCategory";
import { useAuth } from "@/hooks/useAuth";
import { useGoals } from "@/hooks/useGoals";
import { Crown, Star, CheckCircle, Calendar, BarChart3 } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  xpReward?: number;
}

interface Category {
  id: string;
  name: string;
  goals: Goal[];
}

function Dashboard() {
  const { user } = useAuth();
  const { goals, addGoal, toggleGoal } = useGoals();
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMorningModalOpen, setIsMorningModalOpen] = useState(false);

  // Mock user stats - replace with real data
  const level = 5;
  const currentXP = 2850;
  const maxXP = 3000;
  const streak = 7;
  const rank = "C-Rank";

  // Mock categories with goals
  const categories: Category[] = [
    {
      id: '1',
      name: 'Main Mission',
      goals: [
        {
          id: '1',
          title: 'Complete project proposal',
          description: 'Finish the quarterly project proposal document',
          completed: false,
          priority: 'high',
          dueDate: '2025-08-05',
          xpReward: 50
        },
        {
          id: '2',
          title: 'Team meeting preparation',
          completed: true,
          priority: 'medium',
          xpReward: 25
        }
      ]
    },
    {
      id: '2', 
      name: 'Training',
      goals: [
        {
          id: '3',
          title: 'Read documentation',
          completed: false,
          priority: 'low',
          xpReward: 15
        }
      ]
    },
    {
      id: '3',
      name: 'Side Quests',
      goals: []
    }
  ];

  const handleAddGoal = (categoryId: string) => {
    // This would normally add a goal to the category
    console.log('Add goal to category:', categoryId);
  };

  const handleToggleGoal = (goalId: string) => {
    // This would normally toggle the goal status
    console.log('Toggle goal:', goalId);
  };

  const renderDashboard = () => (
    <div className="space-y-8 slide-up particle-effect">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-['Orbitron']">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-amber-300 bg-clip-text text-transparent">
              HUNTER HEADQUARTERS
            </span>
          </h1>
          <p className="text-gray-400 mt-2 font-medium">Command Center • Shadow Monarch Division</p>
        </div>
        <button
          onClick={() => setIsMorningModalOpen(true)}
          className="power-button"
        >
          <span className="relative z-10">Daily Quest Briefing</span>
        </button>
      </div>

      {/* Hunter Status Window */}
      <div className="hunter-status-window p-8 hunter-glow">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 via-cyan-300 to-amber-300 p-1">
                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                  <Crown className="w-10 h-10 text-amber-300" />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-black text-xs font-bold">
                {level}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-['Orbitron']">{user?.displayName || 'SHADOW HUNTER'}</h2>
              <p className="text-cyan-400 font-semibold text-lg">{rank}</p>
              <p className="text-gray-400 text-sm">Guild: Solo Leveling</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-6xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text font-['Orbitron'] level-up">
              {level}
            </div>
            <p className="text-gray-400 text-sm font-semibold">CURRENT LEVEL</p>
          </div>
        </div>

        {/* XP Progress System */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-300 font-semibold">EXPERIENCE POINTS</span>
            <span className="text-cyan-400 font-bold text-lg">{currentXP.toLocaleString()} / {maxXP.toLocaleString()}</span>
          </div>
          <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-amber-400 rounded-full transition-all duration-1000 power-surge"
              style={{ width: `${(currentXP / maxXP) * 100}%` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Next Rank: {level + 1}</span>
            <span>{maxXP - currentXP} XP needed</span>
          </div>
        </div>

        {/* Hunter Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="mystical-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-400 text-sm font-bold uppercase tracking-wide">Strength</p>
                <p className="text-3xl font-bold text-white font-['Orbitron']">87</p>
                <p className="text-green-400 text-xs font-semibold">(+12 today)</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="mystical-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-400 text-sm font-bold uppercase tracking-wide">Agility</p>
                <p className="text-3xl font-bold text-white font-['Orbitron']">92</p>
                <p className="text-green-400 text-xs font-semibold">(+8 today)</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="mystical-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm font-bold uppercase tracking-wide">Intelligence</p>
                <p className="text-3xl font-bold text-white font-['Orbitron']">95</p>
                <p className="text-green-400 text-xs font-semibold">(+15 today)</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="mystical-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-bold uppercase tracking-wide">Streak</p>
                <p className="text-3xl font-bold text-white font-['Orbitron']">{streak}</p>
                <p className="text-amber-400 text-xs font-semibold">DAYS ACTIVE</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quest Categories */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white font-['Orbitron']">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              ACTIVE QUESTS
            </span>
          </h2>
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">System Online</span>
          </div>
        </div>
        {categories.map((category) => (
          <GoalCategory
            key={category.id}
            category={category}
            onToggleGoal={handleToggleGoal}
            onAddGoal={handleAddGoal}
          />
        ))}
      </div>
    </div>
  );

  const renderCalendar = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Calendar</h1>
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Calendar view coming soon</p>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Analytics dashboard coming soon</p>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-medium mb-4">Preferences</h3>
        <p className="text-muted-foreground">Settings panel coming soon</p>
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard': return renderDashboard();
      case 'calendar': return renderCalendar();
      case 'analytics': return renderAnalytics();
      case 'settings': return renderSettings();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex relative">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40 fade-in"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        md:relative md:translate-x-0 md:block
        fixed left-0 top-0 z-50 h-full transition-transform duration-300 ease-out
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <AppSidebar
          currentView={currentView}
          onViewChange={(view) => {
            setCurrentView(view);
            setIsMobileSidebarOpen(false);
          }}
          userLevel={level}
          currentXP={currentXP}
          maxXP={maxXP}
          rank={rank}
        />
      </div>
      
      <main className="flex-1 overflow-hidden">
        <TopBar 
          user={user}
          onOpenMorningModal={() => setIsMorningModalOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />
        
        <div className="p-4 md:p-6 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="fade-in">
            {renderCurrentView()}
          </div>
        </div>
      </main>

      {/* Morning Modal - Solo Leveling Immersive */}
      {isMorningModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4 fade-in">
          <div className="hunter-status-window p-0 w-full max-w-4xl slide-up overflow-hidden">
            {/* Character Background */}
            <div className="relative h-64 bg-gradient-to-br from-blue-900/40 via-gray-900/60 to-black/80 overflow-hidden">
              {/* Animated background particles */}
              <div className="absolute inset-0 particle-effect opacity-60" />
              
              {/* Character silhouette/artwork area */}
              <div className="absolute right-8 top-4 w-48 h-56 bg-gradient-to-t from-black/80 via-gray-900/40 to-transparent rounded-lg flex items-end justify-center">
                <div className="text-6xl mb-4 filter drop-shadow-2xl">👤</div>
              </div>
              
              {/* System Alert Header */}
              <div className="absolute top-6 left-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-400 font-bold text-sm uppercase tracking-wider">SYSTEM ALERT</span>
                </div>
                <h2 className="text-4xl font-bold text-white font-['Orbitron'] mb-2">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    DAILY QUEST
                  </span>
                </h2>
                <h3 className="text-2xl font-bold text-amber-400 font-['Orbitron'] mb-3">
                  BRIEFING INITIATED
                </h3>
                <p className="text-gray-300 text-lg font-semibold max-w-md">
                  [HUNTER, YOUR DAILY MISSIONS AWAIT]
                </p>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 bg-gradient-to-br from-gray-900/95 to-black/90">
              {/* Quest Briefing */}
              <div className="mystical-card p-6 mb-8 bg-gradient-to-br from-blue-900/20 to-cyan-900/10 border-2 border-cyan-500/30">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-cyan-400 font-bold font-['Orbitron'] text-xl uppercase tracking-wide">
                    Mission Parameters
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="mystical-card p-4 bg-gradient-to-br from-red-900/30 to-red-800/20 border border-red-500/30">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">⚔️</span>
                      <div>
                        <p className="text-red-400 font-bold text-sm uppercase">Main Mission</p>
                        <p className="text-gray-300 text-xs">Priority: Critical</p>
                      </div>
                    </div>
                  </div>
                  <div className="mystical-card p-4 bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-500/30">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🛡️</span>
                      <div>
                        <p className="text-blue-400 font-bold text-sm uppercase">Training</p>
                        <p className="text-gray-300 text-xs">Priority: High</p>
                      </div>
                    </div>
                  </div>
                  <div className="mystical-card p-4 bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-500/30">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">⭐</span>
                      <div>
                        <p className="text-green-400 font-bold text-sm uppercase">Side Quests</p>
                        <p className="text-gray-300 text-xs">Priority: Optional</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-semibold text-sm">HUNTER SYSTEM ONLINE</span>
                </div>
                <div className="text-gray-400 text-sm font-mono">
                  {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setIsMorningModalOpen(false)}
                  className="power-button flex-1 text-lg py-4"
                >
                  <span className="relative z-10">ACCEPT MISSIONS</span>
                </button>
                <button
                  onClick={() => setIsMorningModalOpen(false)}
                  className="mystical-card px-8 py-4 text-gray-300 hover:text-white border-2 border-gray-600 hover:border-gray-500 transition-all duration-300 font-bold font-['Orbitron'] uppercase"
                >
                  Postpone
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;