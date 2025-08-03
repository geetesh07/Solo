import { useState } from "react";
import { Plus, ChevronDown, ChevronRight, Target, Flame, Star, CheckCircle2, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Goal } from "@/shared/schema";

interface GoalCategoryProps {
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
    goals: Goal[];
  };
  onAddGoal: (categoryId: string) => void;
  onToggleGoal: (goalId: string) => void;
}

const categoryIcons = {
  "Main Mission": Target,
  "Training": Flame,
  "Side Quests": Star,
};

const categoryGradients = {
  "Main Mission": "from-solo-red via-red-500 to-red-600",
  "Training": "from-solo-blue via-blue-500 to-cyan-500",
  "Side Quests": "from-solo-gold via-yellow-500 to-amber-500",
};

const categoryBorders = {
  "Main Mission": "border-red-500/30",
  "Training": "border-solo-blue/30",
  "Side Quests": "border-yellow-500/30",
};

export function GoalCategory({ category, onAddGoal, onToggleGoal }: GoalCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoalText, setNewGoalText] = useState("");

  const IconComponent = categoryIcons[category.name as keyof typeof categoryIcons] || Target;
  const gradient = categoryGradients[category.name as keyof typeof categoryGradients] || categoryGradients["Training"];
  const borderClass = categoryBorders[category.name as keyof typeof categoryBorders] || categoryBorders["Training"];

  const completedGoals = category.goals.filter(goal => goal.completed).length;
  const totalGoals = category.goals.length;
  const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  const handleAddGoal = () => {
    if (newGoalText.trim()) {
      onAddGoal(category.id);
      setNewGoalText("");
      setShowAddForm(false);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Zap className="w-3 h-3 text-red-400" />;
      case 'medium': return <Clock className="w-3 h-3 text-yellow-400" />;
      case 'low': return <Target className="w-3 h-3 text-blue-400" />;
      default: return <Target className="w-3 h-3 text-gray-400" />;
    }
  };

  return (
    <div className={cn("solo-card mb-6 overflow-hidden animate-slide-up", borderClass)}>
      {/* Category Header */}
      <div 
        className="relative p-5 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Background Pattern */}
        <div className={cn("absolute inset-0 bg-gradient-to-r opacity-10", gradient)}></div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                {isExpanded ? 
                  <ChevronDown className="w-5 h-5 text-gray-300" /> : 
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                }
              </button>
              
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-glow", gradient)}>
                <IconComponent className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="font-orbitron font-bold text-lg text-white mb-1">{category.name}</h3>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-gray-400 font-rajdhani">
                  {completedGoals}/{totalGoals} completed
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-solo-darker/60 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-500 bg-gradient-to-r", gradient)}
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                  <span className="text-xs font-rajdhani font-semibold text-gray-300">
                    {Math.round(completionRate)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAddForm(true);
            }}
            className="group p-2 rounded-xl hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-white/20"
          >
            <Plus className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>

      {/* Goals List */}
      {isExpanded && (
        <div className="px-5 pb-5 space-y-3 animate-slide-up">
          {/* Add Goal Form */}
          {showAddForm && (
            <div className="p-4 bg-solo-darker/40 border border-white/10 rounded-xl">
              <input
                type="text"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
                placeholder={`Add new ${category.name.toLowerCase()}...`}
                className="w-full bg-transparent border-b border-gray-600 pb-2 text-white placeholder-gray-400 focus:outline-none focus:border-solo-blue font-rajdhani"
                autoFocus
              />
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={handleAddGoal}
                  className="px-4 py-2 bg-gradient-to-r from-solo-blue to-solo-purple rounded-lg text-white font-rajdhani font-semibold hover:shadow-glow transition-all duration-300"
                >
                  Add Quest
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewGoalText("");
                  }}
                  className="px-4 py-2 bg-solo-darker/60 border border-gray-600 rounded-lg text-gray-300 hover:text-white transition-colors font-rajdhani"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Goals */}
          {category.goals.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="font-rajdhani">No quests available</p>
              <p className="text-sm mt-1">Add your first quest to begin your hunter journey</p>
            </div>
          ) : (
            category.goals.map((goal) => (
              <div
                key={goal.id}
                className={cn(
                  "group p-4 rounded-xl border transition-all duration-300 hover:shadow-glow cursor-pointer",
                  goal.completed
                    ? "bg-green-950/30 border-green-500/30 hover:border-green-400/50"
                    : "bg-solo-darker/40 border-white/10 hover:border-solo-blue/30"
                )}
                onClick={() => onToggleGoal(goal.id)}
              >
                <div className="flex items-center space-x-3">
                  <button
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                      goal.completed
                        ? "bg-green-500 border-green-500 shadow-glow"
                        : "border-gray-500 hover:border-solo-blue group-hover:border-solo-blue"
                    )}
                  >
                    {goal.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className={cn(
                        "font-rajdhani font-medium transition-all duration-300",
                        goal.completed
                          ? "text-gray-400 line-through"
                          : "text-white group-hover:text-solo-blue"
                      )}>
                        {goal.title}
                      </p>
                      {getPriorityIcon(goal.priority)}
                    </div>
                    
                    {goal.description && (
                      <p className="text-sm text-gray-400 mt-1 font-rajdhani">
                        {goal.description}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-4 mt-2 text-xs font-rajdhani">
                      {goal.dueDate && (
                        <span className="text-gray-500">
                          Due: {new Date(goal.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      {goal.xpReward && (
                        <span className="text-solo-blue font-semibold">
                          +{goal.xpReward} XP
                        </span>
                      )}
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