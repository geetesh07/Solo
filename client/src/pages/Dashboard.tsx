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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button
          onClick={() => setIsMorningModalOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Daily Briefing
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Level</p>
              <p className="text-2xl font-semibold">{level}</p>
            </div>
            <Crown className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">XP</p>
              <p className="text-2xl font-semibold">{currentXP.toLocaleString()}</p>
            </div>
            <Star className="w-6 h-6 text-yellow-500" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Streak</p>
              <p className="text-2xl font-semibold">{streak}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Rank</p>
              <p className="text-2xl font-semibold">{rank}</p>
            </div>
            <Crown className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>

      {/* Categories */}
      {categories.map((category) => (
        <GoalCategory
          key={category.id}
          category={category}
          onToggleGoal={handleToggleGoal}
          onAddGoal={handleAddGoal}
        />
      ))}
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
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Daily Quest Briefing</h2>
            <p className="text-muted-foreground mb-4">
              Ready to start your hunter journey for today?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsMorningModalOpen(false)}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Let's Go!
              </button>
              <button
                onClick={() => setIsMorningModalOpen(false)}
                className="px-4 py-2 border border-border rounded-md hover:bg-accent"
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