import { useState } from "react";
import { Plus, ChevronDown, ChevronRight, Target, CheckCircle2, Circle } from "lucide-react";

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
  onAddGoal: (categoryId: string) => void;
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
      onAddGoal(category.id);
      setNewGoalText("");
      setShowAddForm(false);
    }
  };

  const getCategoryColor = (name: string) => {
    switch (name.toLowerCase()) {
      case 'main mission': return 'neon-box border-red-400/40 bg-gradient-to-br from-red-500/10 to-red-600/5';
      case 'training': return 'neon-box border-blue-400/40 bg-gradient-to-br from-blue-500/10 to-blue-600/5';
      case 'side quests': return 'neon-box border-green-400/40 bg-gradient-to-br from-green-500/10 to-green-600/5';
      default: return 'premium-card';
    }
  };

  const getCategoryIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'main mission': return '⚔️';
      case 'training': return '🛡️';
      case 'side quests': return '⭐';
      default: return '📋';
    }
  };

  return (
    <div className={`${getCategoryColor(category.name)} mb-6 overflow-hidden`}>
      {/* Header */}
      <div 
        className="p-6 cursor-pointer flex items-center justify-between hover:bg-white/5 transition-all duration-300"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-4">
          {isExpanded ? 
            <ChevronDown className="w-5 h-5 text-[#00d4ff] transition-transform duration-300" /> : 
            <ChevronRight className="w-5 h-5 text-[#00d4ff] transition-transform duration-300" />
          }
          <div className="text-2xl">{getCategoryIcon(category.name)}</div>
          <div>
            <h3 className="font-bold font-['Orbitron'] text-lg text-[#00d4ff] uppercase tracking-wide">{category.name}</h3>
            <p className="text-sm text-gray-400 font-semibold">
              {completedGoals}/{totalGoals} COMPLETED • {completionRate}% PROGRESS
            </p>
          </div>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowAddForm(true);
          }}
          className="premium-card p-3 hover:scale-105 transition-transform duration-200"
        >
          <Plus className="w-5 h-5 text-[#00d4ff]" />
        </button>
      </div>

      {/* Progress Bar */}
      {isExpanded && totalGoals > 0 && (
        <div className="px-6 pb-4">
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#00d4ff] to-[#06ffff] rounded-full transition-all duration-500 neon-pulse"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      {isExpanded && (
        <div className="border-t border-white/10 p-6 space-y-4">
          {/* Add Goal Form */}
          {showAddForm && (
            <div className="premium-card p-4 bg-gradient-to-r from-[#00d4ff]/10 to-[#8b5cf6]/10">
              <input
                type="text"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
                placeholder={`ADD NEW ${category.name.toUpperCase()}...`}
                className="w-full bg-gray-900/50 border border-[#00d4ff]/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 font-semibold focus:border-[#00d4ff] focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/20 transition-all duration-300"
                autoFocus
              />
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={handleAddGoal}
                  className="glow-button flex-1"
                >
                  ADD QUEST
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewGoalText("");
                  }}
                  className="premium-card px-6 py-3 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  CANCEL
                </button>
              </div>
            </div>
          )}

          {/* Goals List */}
          {category.goals.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="premium-card p-8 text-center">
                <Target className="w-12 h-12 mx-auto mb-4 text-[#00d4ff] opacity-50" />
                <p className="font-semibold text-lg mb-2">NO ACTIVE QUESTS</p>
                <p className="text-sm text-gray-500">START YOUR JOURNEY BY ADDING YOUR FIRST QUEST</p>
              </div>
            </div>
          ) : (
            category.goals.map((goal) => (
              <div
                key={goal.id}
                className="premium-card p-4 hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
                onClick={() => onToggleGoal(goal.id)}
              >
                <div className="flex items-start space-x-4">
                  <button className="mt-1 group-hover:scale-110 transition-transform duration-200">
                    {goal.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-[#00d4ff] drop-shadow-[0_0_10px_rgba(0,212,255,0.5)]" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 hover:text-[#00d4ff] transition-colors duration-200" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <p className={`font-semibold ${goal.completed ? 'line-through text-gray-500' : 'text-white'} group-hover:text-[#00d4ff] transition-colors duration-200`}>
                      {goal.title}
                    </p>
                    {goal.description && (
                      <p className="text-sm text-gray-400 mt-1">
                        {goal.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-6 mt-3 text-sm">
                      {goal.dueDate && (
                        <span className="text-yellow-400 font-semibold">
                          📅 {new Date(goal.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      {goal.xpReward && (
                        <span className="text-[#00d4ff] font-bold bg-[#00d4ff]/10 px-2 py-1 rounded">
                          +{goal.xpReward} EXP
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        goal.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        goal.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {goal.priority.toUpperCase()}
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