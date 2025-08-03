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
      case 'main mission': return 'border-red-500/30 bg-red-500/5';
      case 'training': return 'border-blue-500/30 bg-blue-500/5';
      case 'side quests': return 'border-green-500/30 bg-green-500/5';
      default: return 'border-border bg-card';
    }
  };

  return (
    <div className={`border rounded-lg ${getCategoryColor(category.name)} mb-4`}>
      {/* Header */}
      <div 
        className="p-4 cursor-pointer flex items-center justify-between hover:bg-accent/50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          {isExpanded ? 
            <ChevronDown className="w-4 h-4 text-muted-foreground" /> : 
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          }
          <Target className="w-5 h-5" />
          <div>
            <h3 className="font-medium">{category.name}</h3>
            <p className="text-sm text-muted-foreground">
              {completedGoals}/{totalGoals} completed ({completionRate}%)
            </p>
          </div>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowAddForm(true);
          }}
          className="p-2 hover:bg-accent rounded-md"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      {isExpanded && totalGoals > 0 && (
        <div className="px-4 pb-2">
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      {isExpanded && (
        <div className="border-t border-border p-4 space-y-3">
          {/* Add Goal Form */}
          {showAddForm && (
            <div className="p-3 border border-border rounded-md bg-accent/20">
              <input
                type="text"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
                placeholder={`Add new ${category.name.toLowerCase()}...`}
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm"
                autoFocus
              />
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={handleAddGoal}
                  className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewGoalText("");
                  }}
                  className="px-3 py-1 border border-border rounded text-sm hover:bg-accent"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Goals List */}
          {category.goals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No goals yet</p>
              <p className="text-sm">Add your first goal to get started</p>
            </div>
          ) : (
            category.goals.map((goal) => (
              <div
                key={goal.id}
                className="flex items-start space-x-3 p-3 border border-border rounded-md hover:bg-accent/50 cursor-pointer"
                onClick={() => onToggleGoal(goal.id)}
              >
                <button className="mt-0.5">
                  {goal.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                
                <div className="flex-1">
                  <p className={`text-sm ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {goal.title}
                  </p>
                  {goal.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {goal.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                    {goal.dueDate && (
                      <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                    )}
                    {goal.xpReward && (
                      <span className="text-primary">+{goal.xpReward} XP</span>
                    )}
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