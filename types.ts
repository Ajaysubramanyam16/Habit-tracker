export type Frequency = 'daily' | 'weekly' | 'weekdays';

export interface JournalEntry {
  note: string;
  mood: 'great' | 'neutral' | 'difficult';
  timestamp: string;
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
  journal: Record<string, JournalEntry>; // Map date string to journal entry
  color: string;
  archived: boolean;
  userId: string; // Associated with a user
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
  xp: number;
  level: number;
  badges: Badge[];
}

export interface CategoryOption {
  id: string;
  label: string;
  color: string;
  icon: string;
}

export type ViewMode = 'dashboard' | 'habits' | 'analytics' | 'projects' | 'ai-assistant' | 'community' | 'settings';

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