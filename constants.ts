import { CategoryOption } from './types';

// Odoo-inspired color palette for tags/categories
export const CATEGORIES: CategoryOption[] = [
  { id: 'health', label: 'Physical', color: 'bg-emerald-100 text-emerald-700', icon: 'Heart' },
  { id: 'productivity', label: 'Output', color: 'bg-blue-100 text-blue-700', icon: 'Zap' },
  { id: 'mindfulness', label: 'Mental', color: 'bg-purple-100 text-purple-700', icon: 'Moon' },
  { id: 'learning', label: 'Growth', color: 'bg-amber-100 text-amber-700', icon: 'BookOpen' },
  { id: 'fitness', label: 'Training', color: 'bg-rose-100 text-rose-700', icon: 'Activity' },
  { id: 'social', label: 'Network', color: 'bg-cyan-100 text-cyan-700', icon: 'Users' },
];

// Odoo/ERP standard tag colors
export const COLORS = [
  '#008784', // Teal (Odoo primary-ish)
  '#714B67', // Odoo Community Purple
  '#F0AD4E', // Warning Orange
  '#D9534F', // Danger Red
  '#5BC0DE', // Info Blue
  '#5CB85C', // Success Green
  '#7C3AED', // Violet
  '#374151', // Gray
  '#EC4899', // Pink
];

export const DEFAULT_HABITS_SEED = [
  {
    id: '1',
    name: 'Deep Work Session',
    category: 'productivity',
    frequency: 'daily',
    startDate: new Date().toISOString(),
    streak: 5,
    bestStreak: 12,
    color: '#714B67',
    logs: {},
    archived: false,
    description: '90 minutes of uninterrupted focus.'
  },
  {
    id: '2',
    name: 'Hydration Target',
    category: 'health',
    frequency: 'daily',
    startDate: new Date().toISOString(),
    streak: 2,
    bestStreak: 20,
    color: '#5CB85C',
    logs: {},
    archived: false,
    description: '3 Liters minimum.'
  },
  {
    id: '3',
    name: 'Market Research',
    category: 'learning',
    frequency: 'daily',
    startDate: new Date().toISOString(),
    streak: 0,
    bestStreak: 5,
    color: '#F0AD4E',
    logs: {},
    archived: false,
    description: 'Read financial reports.'
  }
];