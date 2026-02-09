import { CategoryOption } from './types';

export const CATEGORIES: CategoryOption[] = [
  { id: 'health', label: 'Health', color: 'bg-emerald-100 text-emerald-700', icon: 'Heart' },
  { id: 'productivity', label: 'Productivity', color: 'bg-blue-100 text-blue-700', icon: 'Zap' },
  { id: 'mindfulness', label: 'Mindfulness', color: 'bg-violet-100 text-violet-700', icon: 'Moon' },
  { id: 'learning', label: 'Learning', color: 'bg-amber-100 text-amber-700', icon: 'BookOpen' },
  { id: 'fitness', label: 'Fitness', color: 'bg-rose-100 text-rose-700', icon: 'Activity' },
  { id: 'social', label: 'Social', color: 'bg-pink-100 text-pink-700', icon: 'Users' },
];

export const COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#ec4899', // pink
];

export const DEFAULT_HABITS_SEED = [
  {
    id: '1',
    name: 'Morning Meditation',
    category: 'mindfulness',
    frequency: 'daily',
    startDate: new Date().toISOString(),
    streak: 5,
    bestStreak: 12,
    color: '#8b5cf6',
    logs: {},
    archived: false,
    description: '10 minutes of mindfulness before coffee.'
  },
  {
    id: '2',
    name: 'Drink 2L Water',
    category: 'health',
    frequency: 'daily',
    startDate: new Date().toISOString(),
    streak: 2,
    bestStreak: 20,
    color: '#06b6d4',
    logs: {},
    archived: false,
    description: 'Keep hydrated throughout the day.'
  },
  {
    id: '3',
    name: 'Read 30 mins',
    category: 'learning',
    frequency: 'daily',
    startDate: new Date().toISOString(),
    streak: 0,
    bestStreak: 5,
    color: '#f59e0b',
    logs: {},
    archived: false,
    description: 'Fiction or non-fiction.'
  }
];
