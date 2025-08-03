import { Category } from '@/types';

export const DEFAULT_CATEGORIES = [
  {
    name: 'Main Mission',
    color: '#EF4444', // red-500
    icon: 'crown',
    isActive: true,
    order: 0,
  },
  {
    name: 'Training',
    color: '#3B82F6', // blue-500
    icon: 'dumbbell',
    isActive: true,
    order: 1,
  },
  {
    name: 'Side Quests',
    color: '#10B981', // green-500
    icon: 'map',
    isActive: true,
    order: 2,
  },
];

export const MOTIVATIONAL_QUOTES = [
  "The stronger the monster, the stronger I become. - Sung Jin-Woo",
  "I alone level up. - Sung Jin-Woo", 
  "No matter how hard you train, there's always room for improvement. - Sung Jin-Woo",
  "The shadow soldiers will always have my back. - Sung Jin-Woo",
  "Every ending is a new beginning. - Sung Jin-Woo",
  "Power without purpose is meaningless. - Sung Jin-Woo",
  "The weak fear the shadows, but I command them. - Sung Jin-Woo",
  "In this world, only the strong survive. - Sung Jin-Woo",
];

export const XP_VALUES = {
  LOW_PRIORITY: 25,
  MEDIUM_PRIORITY: 50,
  HIGH_PRIORITY: 100,
};

export const LEVEL_THRESHOLDS = {
  XP_PER_LEVEL: 1000,
  RANKS: {
    'E-Rank': 0,
    'D-Rank': 5,
    'C-Rank': 10,
    'B-Rank': 20,
    'A-Rank': 30,
    'S-Rank': 40,
    'Shadow Monarch': 50,
  }
};
