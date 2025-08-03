import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryWithGoals } from "@/types";
import { GoalItem } from "./GoalItem";

interface GoalCategoryProps {
  category: CategoryWithGoals;
  onToggleGoal: (goalId: string, currentStatus: string) => void;
  onAddGoal: () => void;
}

export function GoalCategory({ category, onToggleGoal, onAddGoal }: GoalCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const getCategoryColor = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'main mission':
        return {
          border: 'border-red-500/30',
          text: 'text-red-400',
          bg: 'bg-red-500/20',
        };
      case 'training':
        return {
          border: 'border-blue-500/30',
          text: 'text-blue-400',
          bg: 'bg-blue-500/20',
        };
      case 'side quests':
        return {
          border: 'border-green-500/30',
          text: 'text-green-400',
          bg: 'bg-green-500/20',
        };
      default:
        return {
          border: 'border-purple-500/30',
          text: 'text-purple-400',
          bg: 'bg-purple-500/20',
        };
    }
  };

  const colors = getCategoryColor(category.name);
  const activeGoals = category.goals.filter(goal => goal.status !== 'completed');
  const completedGoals = category.goals.filter(goal => goal.status === 'completed');

  return (
    <div className={cn("bg-gray-800/30 border rounded-lg", colors.border)}>
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn("hover:opacity-75 transition-transform", colors.text)}
            >
              <ChevronDown 
                className={cn(
                  "w-4 h-4 transition-transform",
                  !isExpanded && "-rotate-90"
                )}
              />
            </button>
            <h3 className={cn("font-orbitron font-bold", colors.text)}>
              {category.name}
            </h3>
            <span className={cn("px-2 py-1 rounded text-xs", colors.bg, colors.text)}>
              {category.goals.length} quests
            </span>
          </div>
          <button 
            onClick={onAddGoal}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 space-y-3">
          {activeGoals.map((goal) => (
            <GoalItem
              key={goal.id}
              goal={goal}
              categoryColor={colors.text}
              onToggle={() => onToggleGoal(goal.id, goal.status)}
            />
          ))}
          {completedGoals.map((goal) => (
            <GoalItem
              key={goal.id}
              goal={goal}
              categoryColor={colors.text}
              onToggle={() => onToggleGoal(goal.id, goal.status)}
            />
          ))}
          {category.goals.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>No quests in this category yet.</p>
              <p className="text-sm mt-1">Click the + button to add your first quest!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
