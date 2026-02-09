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
  userId: string; // Associated with a user
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
}

export interface CategoryOption {
  id: string;
  label: string;
  color: string;
  icon: string;
}

export type ViewMode = 'dashboard' | 'habits' | 'analytics' | 'projects' | 'ai-assistant' | 'settings';

export interface AIInsight {
  message: string;
  type: 'encouragement' | 'analysis' | 'warning';
}

// Project Management Types
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignee?: User;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  members: User[];
  tasks: Task[];
  ownerId: string;
  activityLog: ActivityLogEntry[];
}

export interface ActivityLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
