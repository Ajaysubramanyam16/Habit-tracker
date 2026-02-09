import React, { useState } from 'react';
import { CATEGORIES, COLORS } from '../../constants';
import { Habit, Frequency } from '../../types';
import { Button } from '../ui/Button';
import { Check, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../ui/Input';

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
  const [color, setColor] = useState(initialData?.color || COLORS[6]); 
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
      journal: initialData?.journal || {},
      archived: initialData?.archived || false,
      userId: initialData?.userId || user.id,
    };
    onSubmit(newHabit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-sm">
      <Input
          label="Habit Name"
          required
          value={name} 
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Morning Jog"
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Category</label>
          <div className="relative">
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-300 bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none appearance-none"
            >
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={14} />
          </div>
        </div>
        <div>
           <label className="block font-semibold text-gray-700 mb-1">Frequency</label>
           <div className="relative">
             <select 
               value={frequency} 
               onChange={(e) => setFrequency(e.target.value as Frequency)}
               className="w-full px-3 py-2 rounded border border-gray-300 bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none appearance-none"
             >
               <option value="daily">Every Day</option>
               <option value="weekdays">Weekdays Only</option>
               <option value="weekly">Once a Week</option>
             </select>
             <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={14} />
           </div>
        </div>
      </div>

      <div>
        <label className="block font-semibold text-gray-700 mb-2">Color</label>
        <div className="flex gap-2 flex-wrap">
          {COLORS.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 border ${color === c ? 'border-gray-600 scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
            >
              {color === c && <Check size={12} className="text-white" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-semibold text-gray-700 mb-1">Description</label>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded border border-gray-300 bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none resize-none"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
        <Button type="button" variant="ghost" onClick={onCancel}>Discard</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};