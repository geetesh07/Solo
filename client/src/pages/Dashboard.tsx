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
    <div className="space-y-6 slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your goals and track progress</p>
        </div>
        <button
          onClick={() => setIsMorningModalOpen(true)}
          className="enhanced-button"
        >
          Daily Briefing
        </button>
      </div>

      {/* Status Panel */}
      <div className="status-panel p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <Crown className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.displayName || 'User'}</h2>
              <p className="text-muted-foreground">{rank} • Level {level}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary">{level}</p>
            <p className="text-sm text-muted-foreground">Current Level</p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Experience Points</span>
            <span className="text-primary font-medium">{currentXP.toLocaleString()} / {maxXP.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(currentXP / maxXP) * 100}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="professional-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Completed Today</p>
                <p className="text-2xl font-semibold">4</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <div className="professional-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Current Streak</p>
                <p className="text-2xl font-semibold">{streak}</p>
              </div>
              <Star className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <div className="professional-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total XP</p>
                <p className="text-2xl font-semibold">{currentXP.toLocaleString()}</p>
              </div>
              <Crown className="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Goal Categories */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Goal Categories</h2>
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
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
          <div className="status-panel p-6 w-full max-w-md slide-up">
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center">
                <Crown className="w-6 h-6 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Daily Briefing</h2>
              <p className="text-muted-foreground">
                Ready to start your productive day? Plan your goals and track your progress.
              </p>
            </div>

            <div className="professional-card p-4 mb-6">
              <h3 className="font-medium text-foreground mb-3">Today's Focus Areas</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Complete main mission goals</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Continue training and skill development</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Tackle side quests for extra progress</span>
                </li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setIsMorningModalOpen(false)}
                className="enhanced-button flex-1"
              >
                Let's Start
              </button>
              <button
                onClick={() => setIsMorningModalOpen(false)}
                className="px-4 py-2 border border-border rounded hover:bg-accent transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;