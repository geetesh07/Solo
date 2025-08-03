import { Goal } from "@/types";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface GoalItemProps {
  goal: Goal;
  categoryColor: string;
  onToggle: () => void;
}

export function GoalItem({ goal, categoryColor, onToggle }: GoalItemProps) {
  const isCompleted = goal.status === 'completed';

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-300';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'low':
        return 'bg-blue-500/20 text-blue-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-300';
      case 'in-progress':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'failed':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const formatDueDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className={cn(
      "flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors",
      isCompleted && "opacity-75"
    )}>
      <Checkbox
        checked={isCompleted}
        onCheckedChange={onToggle}
        className={cn("border-2", categoryColor.replace('text-', 'border-'))}
      />
      
      <div className="flex-1">
        <p className={cn(
          "font-medium",
          isCompleted && "line-through"
        )}>
          {goal.title}
        </p>
        <div className="flex items-center space-x-2 mt-1">
          {goal.dueDate && (
            <p className="text-sm text-gray-400">
              Due: {formatDueDate(goal.dueDate)}
            </p>
          )}
          {goal.dueDate && goal.xpValue && <span className="text-gray-500">•</span>}
          {goal.xpValue && (
            <p className="text-sm text-gray-400">
              XP: {goal.xpValue}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {goal.priority !== 'medium' && (
          <span className={cn("px-2 py-1 rounded text-xs", getPriorityColor(goal.priority))}>
            {goal.priority === 'high' ? 'High Priority' : 'Low Priority'}
          </span>
        )}
        <span className={cn("px-2 py-1 rounded text-xs capitalize", getStatusColor(goal.status))}>
          {goal.status === 'in-progress' ? 'In Progress' : goal.status}
        </span>
      </div>
    </div>
  );
}
