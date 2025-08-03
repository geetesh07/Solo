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
    <div className="space-y-8 slide-up">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-['Orbitron'] bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] bg-clip-text text-transparent">
          HUNTER STATUS
        </h1>
        <button
          onClick={() => setIsMorningModalOpen(true)}
          className="glow-button"
        >
          DAILY BRIEFING
        </button>
      </div>

      {/* Status Window */}
      <div className="status-window p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] flex items-center justify-center">
              <Crown className="w-6 h-6 text-black font-bold" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-['Orbitron']">{user?.displayName || 'HUNTER'}</h2>
              <p className="text-[#00d4ff] font-semibold">{rank} • Shadow Monarch</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold font-['Orbitron'] text-[#00d4ff]">{level}</p>
            <p className="text-sm text-gray-400">LEVEL</p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">EXP</span>
            <span className="text-[#00d4ff] font-semibold">{currentXP.toLocaleString()} / {maxXP.toLocaleString()}</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#00d4ff] to-[#06ffff] rounded-full transition-all duration-500 neon-pulse"
              style={{ width: `${(currentXP / maxXP) * 100}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="premium-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#00d4ff] text-sm font-semibold">STR</p>
                <p className="text-2xl font-bold font-['Orbitron']">239</p>
                <p className="text-xs text-green-400">(+50)</p>
              </div>
              <Star className="w-5 h-5 text-[#00d4ff]" />
            </div>
          </div>
          <div className="premium-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#8b5cf6] text-sm font-semibold">VIT</p>
                <p className="text-2xl font-bold font-['Orbitron']">211</p>
                <p className="text-xs text-green-400">(+35)</p>
              </div>
              <CheckCircle className="w-5 h-5 text-[#8b5cf6]" />
            </div>
          </div>
          <div className="premium-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#06ffff] text-sm font-semibold">STREAK</p>
                <p className="text-2xl font-bold font-['Orbitron']">{streak}</p>
                <p className="text-xs text-yellow-400">DAYS</p>
              </div>
              <Crown className="w-5 h-5 text-[#06ffff]" />
            </div>
          </div>
        </div>
      </div>

      {/* Quest Categories */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold font-['Orbitron'] text-[#00d4ff] mb-4">ACTIVE QUESTS</h2>
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

      {/* Morning Modal */}
      {isMorningModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 fade-in">
          <div className="status-window p-8 w-full max-w-lg slide-up">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] flex items-center justify-center">
                <Crown className="w-8 h-8 text-black font-bold" />
              </div>
              <h2 className="text-2xl font-bold font-['Orbitron'] text-[#00d4ff] mb-2">⚠️ ALERT</h2>
              <p className="text-white font-semibold text-lg mb-1">[WELCOME, HUNTER.]</p>
              <p className="text-gray-400">
                Your daily quest briefing is ready. Begin your hunter journey and gain valuable experience points.
              </p>
            </div>

            <div className="premium-card p-4 mb-6 bg-gradient-to-r from-[#00d4ff]/10 to-[#8b5cf6]/10">
              <h3 className="font-bold text-[#00d4ff] mb-2 font-['Orbitron']">TODAY'S OBJECTIVES</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center space-x-2">
                  <span className="text-[#00d4ff]">•</span>
                  <span>Complete your main mission tasks</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-[#8b5cf6]">•</span>
                  <span>Train your skills and abilities</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-[#06ffff]">•</span>
                  <span>Take on side quests for bonus XP</span>
                </li>
              </ul>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setIsMorningModalOpen(false)}
                className="glow-button flex-1"
              >
                BEGIN HUNT
              </button>
              <button
                onClick={() => setIsMorningModalOpen(false)}
                className="premium-card px-6 py-3 text-gray-300 hover:text-white transition-colors duration-200"
              >
                LATER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;