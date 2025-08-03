import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AppSidebar } from "../components/layout/AppSidebar";
import { TopBar } from "../components/layout/TopBar";
import { useGoals } from "@/hooks/useGoals";
import { Crown, Star, CheckCircle, Calendar, BarChart3, Target, Plus, X, Bell, Trash2, Check, Menu } from "lucide-react";
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

  const [newGoal, setNewGoal] = useState({ title: '', categoryId: '', priority: 'medium' as 'low' | 'medium' | 'high', dueDate: '' });
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
            <div key={index} className="mystical-card p-6 text-center transition-all duration-200">
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
          <div key={category.id} className={`hunter-status-window p-6 border-l-4 ${
            category.id === 'main-mission' ? 'border-red-500 bg-gradient-to-r from-red-900/10 to-gray-900' :
            category.id === 'training' ? 'border-blue-500 bg-gradient-to-r from-blue-900/10 to-gray-900' :
            'border-green-500 bg-gradient-to-r from-green-900/10 to-gray-900'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-3xl">{category.icon}</span>
                <div>
                  <h3 className={`text-xl font-bold font-['Orbitron'] ${
                    category.id === 'main-mission' ? 'text-red-400' :
                    category.id === 'training' ? 'text-blue-400' :
                    'text-green-400'
                  }`}>{category.name}</h3>
                  <span className="text-gray-400 text-sm">({category.goals.length} goals)</span>
                </div>
              </div>
              <button
                onClick={() => setIsAddingGoal(category.id)}
                className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                  category.id === 'main-mission' ? 'bg-red-600 hover:bg-red-700 text-white' :
                  category.id === 'training' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                  'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Goal
              </button>
            </div>

            {/* Add Goal Form */}
            {isAddingGoal === category.id && (
              <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 mb-4">
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Enter your goal..."
                    value={newGoal.title}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddGoal(category.id)}
                  />
                  <div className="flex gap-3">
                    <input
                      type="date"
                      value={newGoal.dueDate}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none text-sm"
                    />
                    <select
                      value={newGoal.priority}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                      className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none text-sm"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddGoal(category.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setIsAddingGoal(null)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Goals List */}
            {category.goals.length === 0 ? (
              <div className="text-center py-6 text-gray-400 bg-gray-800/30 rounded-lg">
                <Target className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-sm">No goals yet. Add your first quest to get started!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {category.goals.map((goal) => (
                  <div key={goal.id} className="bg-gray-800/40 border border-gray-700 rounded-lg p-3 flex items-center justify-between group">
                    <div className="flex items-center space-x-3 flex-1">
                      <button
                        onClick={() => handleToggleGoal(category.id, goal.id)}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          goal.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-500 hover:border-green-400'
                        }`}
                      >
                        {goal.completed && <Check className="w-3 h-3" />}
                      </button>
                      <div className="flex-1">
                        <h4 className={`font-medium text-sm ${goal.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                          {goal.title}
                        </h4>
                        <div className="flex items-center space-x-3 text-xs text-gray-400 mt-1">
                          <span className={`px-2 py-1 rounded text-xs ${
                            goal.priority === 'high' ? 'bg-red-900/30 text-red-400' :
                            goal.priority === 'medium' ? 'bg-yellow-900/30 text-yellow-400' :
                            'bg-green-900/30 text-green-400'
                          }`}>
                            {goal.priority}
                          </span>
                          {goal.dueDate && (
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(goal.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteGoal(category.id, goal.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
          user={user}
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