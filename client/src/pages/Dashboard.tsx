import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AppSidebar } from "../components/layout/AppSidebar";
import { TopBar } from "../components/layout/TopBar";
import { useGoals } from "@/hooks/useGoals";
import { Crown, Star, CheckCircle, Calendar, BarChart3, Target, Plus, X } from "lucide-react";
import { AnalyticsDashboard } from "../components/analytics/AnalyticsDashboard";
import { CalendarView } from "../components/calendar/CalendarView";
import { Settings } from "./Settings";
import { MorningModal } from "@/components/modals/MorningModal";
import { NotesPanel } from "../components/features/NotesPanel";
import { OnboardingModal } from "@/components/modals/OnboardingModal";

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
  const { goals, addGoal, toggleGoal } = useGoals();
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMorningModalOpen, setIsMorningModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Categories with goals state - start empty
  const [categories, setCategories] = useState<Category[]>([
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
  ]);

  const [newGoal, setNewGoal] = useState({ title: '', categoryId: '', priority: 'medium' as const, dueDate: '' });
  const [isAddingGoal, setIsAddingGoal] = useState<string | null>(null);

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

    setNewGoal({ title: '', categoryId: '', priority: 'medium', dueDate: '' });
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
    <div className="space-y-8 slide-up">
      {/* Hunter Status Panel */}
      <div className="hunter-status-window p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8">
          <div className="flex items-center space-x-6 mb-4 lg:mb-0">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                {rank}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white font-['Orbitron'] mb-2">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  HUNTER LEVEL {level}
                </span>
              </h1>
              <p className="text-gray-300 text-lg">Welcome back, {user?.displayName || 'Hunter'}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{completedGoals}</div>
              <div className="text-gray-400 text-sm">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400">{streak}</div>
              <div className="text-gray-400 text-sm">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{totalGoals - completedGoals}</div>
              <div className="text-gray-400 text-sm">Active</div>
            </div>
          </div>
        </div>

        {/* XP Progress System */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-300 font-semibold">EXPERIENCE POINTS</span>
            <span className="text-cyan-400 font-bold text-lg">{currentLevelXP.toLocaleString()} / {100}</span>
          </div>
          <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-amber-400 rounded-full transition-all duration-1000 power-surge"
              style={{ width: `${(currentLevelXP / 100) * 100}%` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Level {level}</span>
            <span>Next: Level {level + 1}</span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'COMPLETED TODAY', value: completedGoals, icon: CheckCircle, color: 'text-green-400' },
            { label: 'CURRENT STREAK', value: streak, icon: Star, color: 'text-amber-400' },
            { label: 'THIS WEEK', value: categories.flatMap(cat => cat.goals).filter(g => g.completed).length, icon: Calendar, color: 'text-blue-400' },
            { label: 'EFFICIENCY', value: totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0, icon: BarChart3, color: 'text-purple-400', suffix: '%' }
          ].map((stat, index) => (
            <div key={index} className="mystical-card p-6 text-center hover:scale-105 transition-all duration-200">
              <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
              <div className="text-2xl font-bold text-white mb-1">
                {stat.value}{stat.suffix || ''}
              </div>
              <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quest Categories */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white font-['Orbitron']">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ACTIVE QUESTS
            </span>
          </h2>
          <button 
            onClick={() => setIsOnboardingOpen(true)}
            className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
          >
            📖 Tutorial
          </button>
        </div>

        {categories.map((category) => (
          <div key={category.id} className="quest-category">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{category.icon}</span>
                <h3 className="text-xl font-bold text-white font-['Orbitron']">{category.name}</h3>
                <span className="text-gray-400 text-sm">({category.goals.length} goals)</span>
              </div>
              <button
                onClick={() => setIsAddingGoal(category.id)}
                className="power-button"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Goal
              </button>
            </div>

            {/* Add Goal Form */}
            {isAddingGoal === category.id && (
              <div className="mystical-card p-4 mb-4 bg-gradient-to-r from-gray-900/50 to-gray-800/30">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Enter your goal..."
                    value={newGoal.title}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                    className="flex-1 bg-gray-800/80 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddGoal(category.id)}
                  />
                  <input
                    type="date"
                    value={newGoal.dueDate}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="bg-gray-800/80 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-cyan-400 focus:outline-none"
                  />
                  <select
                    value={newGoal.priority}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                    className="bg-gray-800/80 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddGoal(category.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setIsAddingGoal(null)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Goals List */}
            <div className="space-y-3">
              {category.goals.length === 0 ? (
                <div className="mystical-card p-6 text-center">
                  <Target className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                  <p className="text-gray-400">No goals yet. Add your first quest to get started!</p>
                </div>
              ) : (
                category.goals.map((goal) => (
                  <div
                    key={goal.id}
                    className={`mystical-card p-4 flex items-center justify-between group transition-all duration-200 ${
                      goal.completed ? 'opacity-75 bg-green-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <button
                        onClick={() => handleToggleGoal(category.id, goal.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          goal.completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-400 hover:border-cyan-400'
                        }`}
                      >
                        {goal.completed && <CheckCircle className="w-4 h-4 text-white" />}
                      </button>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${goal.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                          {goal.title}
                        </h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            goal.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            goal.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {goal.priority} priority
                          </span>
                          {goal.dueDate && (
                            <span className="text-xs text-gray-400">
                              Due: {new Date(goal.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteGoal(category.id, goal.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-600 rounded-lg transition-all duration-200"
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCalendar = () => (
    <div className="slide-up">
      <CalendarView goals={categories.flatMap(cat => 
        cat.goals.map(goal => ({
          ...goal,
          category: cat.name
        }))
      )} />
    </div>
  );

  const renderAnalytics = () => (
    <div className="slide-up">
      <AnalyticsDashboard categories={categories} />
    </div>
  );

  const renderNotes = () => (
    <div className="slide-up">
      <NotesPanel />
    </div>
  );

  const renderSettings = () => (
    <div className="slide-up">
      <Settings />
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard': return renderDashboard();
      case 'calendar': return renderCalendar();
      case 'analytics': return renderAnalytics();
      case 'notes': return renderNotes();
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
          currentXP={currentLevelXP}
          maxXP={100}
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
    </div>
  );
}

export default Dashboard;