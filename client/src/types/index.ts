export interface Goal {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high';
  xpValue: number;
  dueDate?: Date;
  completedAt?: Date;
  isRecurring: boolean;
  recurringPattern?: {
    type: 'daily' | 'weekly';
    days?: string[];
  };
  createdAt: Date;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
}

export interface UserProfile {
  id: string;
  firebaseUid: string;
  email: string;
  displayName?: string;
  level: number;
  currentXP: number;
  totalXP: number;
  streak: number;
  rank: string;
  createdAt: Date;
}

export interface DailyStats {
  id: string;
  userId: string;
  date: Date;
  goalsCompleted: number;
  totalGoals: number;
  xpGained: number;
  isDungeonCleared: boolean;
}

export interface CategoryWithGoals extends Category {
  goals: Goal[];
}
