import React, { useState, useEffect } from 'react';
import { Habit, User } from '../types';
import { Check, Flame, Calendar, ArrowRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { getAIInsight } from '../services/aiService';

interface DashboardProps {
  user: User;
  habits: Habit[];
  onToggle: (id: string, date: string) => void;
  onEdit: (habit: Habit) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, habits, onToggle, onEdit }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Filter active habits for today
  const todaysHabits = habits.filter(h => !h.archived);
  
  const completedCount = todaysHabits.filter(h => h.logs[todayStr]).length;
  const progress = todaysHabits.length > 0 ? (completedCount / todaysHabits.length) * 100 : 0;

  const handleGetInsight = async () => {
    setLoadingInsight(true);
    const text = await getAIInsight(habits);
    setInsight(text);
    setLoadingInsight(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Welcome */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                Good Morning, {user.name.split(' ')[0]}
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
                You've completed <span className="text-indigo-600 font-bold">{completedCount}</span> out of <span className="text-slate-800 font-bold">{todaysHabits.length}</span> habits today.
            </p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 pr-6">
             <div className="relative w-14 h-14 flex items-center justify-center">
                 <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
                     <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e2e8f0" strokeWidth="8" />
                     <circle 
                        cx="50" cy="50" r="40" 
                        fill="transparent" 
                        stroke="#4f46e5" 
                        strokeWidth="8" 
                        strokeDasharray="251.2" 
                        strokeDashoffset={251.2 - (251.2 * progress) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                     />
                 </svg>
                 <span className="absolute text-xs font-bold text-slate-700">{Math.round(progress)}%</span>
            </div>
            <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Daily Goal</p>
                <p className="text-sm font-bold text-slate-800">Keep it up!</p>
            </div>
        </div>
      </div>

      {/* AI Insight Card */}
      <div className="relative overflow-hidden bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-200">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
        
        <div className="relative flex items-start gap-4 z-10">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                <Flame className="text-amber-300" size={24} fill="currentColor" />
            </div>
            <div className="flex-1">
                <h3 className="text-lg font-bold mb-2 tracking-wide">Daily Intelligence</h3>
                <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                    {insight || "Analyze your performance trends and get personalized coaching to boost your consistency."}
                </p>
                {!insight && (
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        className="mt-4 border-none bg-white text-slate-900 hover:bg-indigo-50 font-semibold"
                        onClick={handleGetInsight}
                        isLoading={loadingInsight}
                    >
                        Generate Insight <ArrowRight size={14} className="ml-2" />
                    </Button>
                )}
            </div>
        </div>
      </div>

      {/* Habits List */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Calendar size={20} className="text-indigo-600" /> 
            Today's Focus
        </h2>
        
        <div className="grid grid-cols-1 gap-4">
            {todaysHabits.map((habit) => {
                const isCompleted = !!habit.logs[todayStr];
                
                return (
                    <motion.div 
                        key={habit.id}
                        layoutId={habit.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`group relative flex items-center p-5 bg-white rounded-2xl border transition-all duration-300 ${isCompleted ? 'border-indigo-100 shadow-none' : 'border-slate-100 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/50'}`}
                    >
                        <button 
                            onClick={() => onToggle(habit.id, todayStr)}
                            className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                isCompleted 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-100' 
                                : 'bg-slate-50 text-slate-300 border border-slate-200 group-hover:border-indigo-200 group-hover:text-indigo-500'
                            }`}
                        >
                            <Check size={28} strokeWidth={3.5} />
                        </button>

                        <div className="ml-5 flex-1 cursor-pointer" onClick={() => onEdit(habit)}>
                            <h3 className={`font-bold text-lg transition-colors ${isCompleted ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-800 group-hover:text-indigo-900'}`}>
                                {habit.name}
                            </h3>
                            <div className="flex items-center gap-3 mt-1.5">
                                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-bold`}>
                                    {habit.category}
                                </span>
                                <span className="flex items-center text-xs font-semibold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">
                                    <Flame size={12} className="mr-1" fill="currentColor" />
                                    {habit.streak} DAY STREAK
                                </span>
                            </div>
                        </div>

                        <div className={`w-1.5 h-10 rounded-full ml-4 opacity-50`} style={{ backgroundColor: habit.color }}></div>
                    </motion.div>
                );
            })}
            
            {todaysHabits.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                        <Check size={32} />
                    </div>
                    <p className="text-slate-500 font-medium">No habits scheduled for today.</p>
                    <p className="text-slate-400 text-sm">Add a new habit to start tracking.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
