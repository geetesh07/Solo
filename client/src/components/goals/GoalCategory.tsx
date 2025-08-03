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

  const getCategoryStyles = (name: string) => {
    switch (name.toLowerCase()) {
      case 'main mission': 
        return {
          card: 'category-card border-red-500/20 bg-red-500/5',
          accent: 'text-red-500',
          icon: <Target className="w-5 h-5" />
        };
      case 'training': 
        return {
          card: 'category-card border-blue-500/20 bg-blue-500/5',
          accent: 'text-blue-500',
          icon: <Star className="w-5 h-5" />
        };
      case 'side quests': 
        return {
          card: 'category-card border-green-500/20 bg-green-500/5',
          accent: 'text-green-500',
          icon: <CheckCircle2 className="w-5 h-5" />
        };
      default: 
        return {
          card: 'category-card',
          accent: 'text-primary',
          icon: <Target className="w-5 h-5" />
        };
    }
  };

  const styles = getCategoryStyles(category.name);

  return (
    <div className={`${styles.card} mb-4`}>
      {/* Header */}
      <div 
        className="p-4 cursor-pointer flex items-center justify-between hover:bg-accent/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          {isExpanded ? 
            <ChevronDown className="w-4 h-4 text-muted-foreground" /> : 
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          }
          <div className={styles.accent}>
            {styles.icon}
          </div>
          <div>
            <h3 className="font-semibold">{category.name}</h3>
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
          className="p-2 hover:bg-accent rounded-md transition-colors"
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
            <div className="professional-card p-3">
              <input
                type="text"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
                placeholder={`Add new ${category.name.toLowerCase()}...`}
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                autoFocus
              />
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={handleAddGoal}
                  className="enhanced-button text-sm"
                >
                  Add Goal
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewGoalText("");
                  }}
                  className="px-3 py-2 border border-border rounded text-sm hover:bg-accent transition-colors"
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
                className="goal-item cursor-pointer"
                onClick={() => onToggleGoal(goal.id)}
              >
                <div className="flex items-start space-x-3">
                  <button className="mt-0.5">
                    {goal.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {goal.title}
                    </p>
                    {goal.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {goal.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-xs">
                      {goal.dueDate && (
                        <span className="text-muted-foreground">
                          Due: {new Date(goal.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      {goal.xpReward && (
                        <span className="text-primary font-medium">
                          +{goal.xpReward} XP
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        goal.priority === 'high' ? 'bg-red-500/10 text-red-500' :
                        goal.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-green-500/10 text-green-500'
                      }`}>
                        {goal.priority}
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