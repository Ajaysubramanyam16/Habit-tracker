export type Frequency = 'daily' | 'weekly' | 'weekdays';

export interface HabitLog {
  date: string; // ISO date string YYYY-MM-DD
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  category: string;
  frequency: Frequency;
  startDate: string;
  description?: string;
  streak: number;
  bestStreak: number;
  logs: Record<string, boolean>; // Map date string to completion status
  color: string;
  archived: boolean;
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
}

export interface CategoryOption {
  id: string;
  label: string;
  color: string;
  icon: string;
}

export type ViewMode = 'dashboard' | 'habits' | 'analytics' | 'settings';

export interface AIInsight {
  message: string;
  type: 'encouragement' | 'analysis' | 'warning';
}
