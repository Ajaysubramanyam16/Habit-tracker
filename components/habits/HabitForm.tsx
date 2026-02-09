import React, { useState } from 'react';
import { CATEGORIES, COLORS } from '../../constants';
import { Habit, Frequency } from '../../types';
import { Button } from '../ui/Button';
import { Check, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const simpleId = () => Math.random().toString(36).substr(2, 9);

interface HabitFormProps {
  initialData?: Partial<Habit>;
  onSubmit: (habit: Habit) => void;
  onCancel: () => void;
}

export const HabitForm: React.FC<HabitFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const { user } = useAuth();
  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState(initialData?.category || 'health');
  const [frequency, setFrequency] = useState<Frequency>(initialData?.frequency || 'daily');
  const [color, setColor] = useState(initialData?.color || COLORS[6]); // default indigo
  const [description, setDescription] = useState(initialData?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newHabit: Habit = {
      id: initialData?.id || simpleId(),
      name,
      category,
      frequency,
      color,
      description,
      startDate: initialData?.startDate || new Date().toISOString(),
      logs: initialData?.logs || {},
      streak: initialData?.streak || 0,
      bestStreak: initialData?.bestStreak || 0,
      archived: initialData?.archived || false,
      userId: initialData?.userId || user.id,
    };
    onSubmit(newHabit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Habit Name</label>
        <input 
          required
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Read 30 mins"
          className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
          <div className="relative">
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
            >
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={16} />
          </div>
        </div>
        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Frequency</label>
           <div className="relative">
             <select 
               value={frequency} 
               onChange={(e) => setFrequency(e.target.value as Frequency)}
               className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
             >
               <option value="daily">Every Day</option>
               <option value="weekdays">Weekdays Only</option>
               <option value="weekly">Once a Week</option>
             </select>
             <ChevronDown className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={16} />
           </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Color Tag</label>
        <div className="flex gap-2 flex-wrap">
          {COLORS.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : ''}`}
              style={{ backgroundColor: c }}
            >
              {color === c && <Check size={14} className="text-white" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Create Habit</Button>
      </div>
    </form>
  );
};