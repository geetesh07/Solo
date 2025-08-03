import { useState } from "react";
import { Plus, ChevronDown, ChevronRight, Target, CheckCircle2, Circle, Star } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  xpReward?: number;
}

interface GoalCategoryProps {
  category: {
    id: string;
    name: string;
    goals: Goal[];
  };
  onAddGoal: (categoryId: string, goalData: Omit<Goal, 'id'>) => void;
  onToggleGoal: (goalId: string) => void;
}

export function GoalCategory({ category, onAddGoal, onToggleGoal }: GoalCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoalText, setNewGoalText] = useState("");

  const completedGoals = category.goals.filter(goal => goal.completed).length;
  const totalGoals = category.goals.length;
  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  const handleAddGoal = () => {
    if (newGoalText.trim()) {
      onAddGoal(category.id, {
        title: newGoalText.trim(),
        completed: false,
        priority: 'medium',
        xpReward: 25
      });
      setNewGoalText("");
      setShowAddForm(false);
    }
  };

  const getCategoryStyles = (name: string) => {
    switch (name.toLowerCase()) {
      case 'main mission': 
        return {
          card: 'quest-category border-red-500/30',
          accent: 'text-red-400',
          icon: '⚔️',
          bgGradient: 'from-red-900/20 to-red-800/10',
          headerIcon: <Target className="w-6 h-6" />
        };
      case 'training': 
        return {
          card: 'quest-category border-blue-500/30',
          accent: 'text-blue-400',
          icon: '🛡️',
          bgGradient: 'from-blue-900/20 to-blue-800/10',
          headerIcon: <Star className="w-6 h-6" />
        };
      case 'side quests': 
        return {
          card: 'quest-category border-green-500/30',
          accent: 'text-green-400',
          icon: '⭐',
          bgGradient: 'from-green-900/20 to-green-800/10',
          headerIcon: <CheckCircle2 className="w-6 h-6" />
        };
      default: 
        return {
          card: 'quest-category',
          accent: 'text-cyan-400',
          icon: '📋',
          bgGradient: 'from-cyan-900/20 to-cyan-800/10',
          headerIcon: <Target className="w-6 h-6" />
        };
    }
  };

  const styles = getCategoryStyles(category.name);

  return (
    <div className={`${styles.card} mb-6 bg-gradient-to-br ${styles.bgGradient}`}>
      {/* Header */}
      <div 
        className="p-6 cursor-pointer flex items-center justify-between hover:bg-white/5 transition-all duration-300"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-4">
          {isExpanded ? 
            <ChevronDown className={`w-5 h-5 ${styles.accent} transition-transform duration-300 rotate-0`} /> : 
            <ChevronRight className={`w-5 h-5 ${styles.accent} transition-transform duration-300`} />
          }
          <div className="text-3xl">{styles.icon}</div>
          <div>
            <h3 className={`font-bold font-['Orbitron'] text-xl ${styles.accent} uppercase tracking-wide`}>
              {category.name}
            </h3>
            <p className="text-gray-400 font-semibold">
              {completedGoals}/{totalGoals} COMPLETED • {completionRate}% PROGRESS
            </p>
          </div>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowAddForm(true);
          }}
          className="mystical-card p-3 hover:scale-110 transition-all duration-300 group"
        >
          <Plus className={`w-6 h-6 ${styles.accent} group-hover:rotate-90 transition-transform duration-300`} />
        </button>
      </div>

      {/* Progress Bar */}
      {isExpanded && totalGoals > 0 && (
        <div className="px-6 pb-4">
          <div className="relative">
            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden border border-gray-700">
              <div 
                className={`h-full bg-gradient-to-r ${
                  category.name.toLowerCase() === 'main mission' ? 'from-red-500 to-red-400' :
                  category.name.toLowerCase() === 'training' ? 'from-blue-500 to-blue-400' :
                  'from-green-500 to-green-400'
                } rounded-full transition-all duration-700 power-surge`}
                style={{ width: `${completionRate}%` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
            <div className="absolute -top-8 right-0 text-xs font-bold text-gray-400">
              {completionRate}%
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {isExpanded && (
        <div className="border-t border-white/10 p-6 space-y-5">
          {/* Add Goal Form */}
          {showAddForm && (
            <div className="mystical-card p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/60 border-2 border-cyan-500/30">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-cyan-400 font-bold font-['Orbitron'] uppercase tracking-wide">
                  New {category.name.slice(0, -1)} Creation
                </h4>
              </div>
              <input
                type="text"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
                placeholder={`ENTER NEW ${category.name.toUpperCase()} OBJECTIVE...`}
                className="w-full bg-gray-900/80 border-2 border-cyan-500/30 rounded-lg px-4 py-4 text-white placeholder-gray-400 font-semibold focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                autoFocus
              />
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={handleAddGoal}
                  className="power-button flex-1"
                >
                  <span className="relative z-10">Deploy Quest</span>
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewGoalText("");
                  }}
                  className="mystical-card px-6 py-3 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 transition-all duration-200"
                >
                  Abort
                </button>
              </div>
            </div>
          )}

          {/* Goals List */}
          {category.goals.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="mystical-card p-12 text-center bg-gradient-to-br from-gray-900/60 to-gray-800/40">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
                  <Target className="w-10 h-10 text-gray-500" />
                </div>
                <p className="font-bold text-xl mb-3 text-gray-300 font-['Orbitron']">NO ACTIVE QUESTS</p>
                <p className="text-gray-500 text-sm">The realm awaits your first mission</p>
                <div className="mt-6 text-xs text-gray-600">
                  • Click the + button to begin your journey
                </div>
              </div>
            </div>
          ) : (
            category.goals.map((goal, index) => (
              <div
                key={goal.id}
                className="goal-quest cursor-pointer group fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => onToggleGoal(goal.id)}
              >
                <div className="flex items-start space-x-4">
                  <button className="mt-1 group-hover:scale-125 transition-all duration-300">
                    {goal.completed ? (
                      <div className="relative">
                        <CheckCircle2 className="w-7 h-7 text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        <div className="absolute inset-0 w-7 h-7 bg-green-400/20 rounded-full animate-pulse" />
                      </div>
                    ) : (
                      <Circle className="w-7 h-7 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <p className={`font-bold text-lg ${
                      goal.completed 
                        ? 'line-through text-gray-500' 
                        : 'text-white group-hover:text-cyan-300'
                    } transition-colors duration-300`}>
                      {goal.title}
                    </p>
                    {goal.description && (
                      <p className="text-gray-400 mt-2 text-sm">
                        {goal.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-6 mt-4 text-sm">
                      {goal.dueDate && (
                        <span className="text-amber-400 font-semibold flex items-center space-x-1">
                          <span>⏰</span>
                          <span>{new Date(goal.dueDate).toLocaleDateString()}</span>
                        </span>
                      )}
                      {goal.xpReward && (
                        <span className="text-cyan-400 font-bold bg-cyan-400/10 px-3 py-1 rounded-lg border border-cyan-400/20">
                          +{goal.xpReward} EXP
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase border ${
                        goal.priority === 'high' 
                          ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                        goal.priority === 'medium' 
                          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        'bg-green-500/20 text-green-400 border-green-500/30'
                      }`}>
                        {goal.priority} Priority
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}