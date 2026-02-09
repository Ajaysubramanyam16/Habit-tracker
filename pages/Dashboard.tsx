import React, { useState, useEffect } from 'react';
import { Habit } from '../types';
import { Check, Flame, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { getAIInsight } from '../services/aiService';

interface DashboardProps {
  habits: Habit[];
  onToggle: (id: string, date: string) => void;
  onEdit: (habit: Habit) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ habits, onToggle, onEdit }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Filter active habits for today (could add logic for 'weekdays' etc)
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
    <div className="space-y-8">
      {/* Header & Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Good Morning, John</h1>
            <p className="text-slate-500 mt-1">Ready to seize the day? You have {todaysHabits.length - completedCount} habits left.</p>
        </div>
        <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Today's Progress</p>
                <p className="text-lg font-bold text-indigo-600">{Math.round(progress)}%</p>
            </div>
            {/* Simple circular progress could go here */}
        </div>
      </div>

      {/* AI Insight Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-violet-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200">
        <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Flame className="text-amber-300" size={24} fill="currentColor" />
            </div>
            <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">Daily AI Coach</h3>
                <p className="text-indigo-100 text-sm leading-relaxed">
                    {insight || "Connect with your personal AI coach to analyze your streaks and get personalized motivation for today."}
                </p>
                {!insight && (
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        className="mt-4 border-none bg-white/10 text-white hover:bg-white/20"
                        onClick={handleGetInsight}
                        isLoading={loadingInsight}
                    >
                        Get Motivation <ArrowRight size={14} className="ml-2" />
                    </Button>
                )}
            </div>
        </div>
      </div>

      {/* Habits List */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-indigo-600" /> Today's Habits
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
                        className={`group relative flex items-center p-4 bg-white rounded-2xl border transition-all duration-300 ${isCompleted ? 'border-indigo-100 bg-indigo-50/30' : 'border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50'}`}
                    >
                        <button 
                            onClick={() => onToggle(habit.id, todayStr)}
                            className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                isCompleted 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-300 scale-105' 
                                : 'bg-slate-100 text-slate-300 group-hover:bg-indigo-100 group-hover:text-indigo-400'
                            }`}
                        >
                            <Check size={24} strokeWidth={3} />
                        </button>

                        <div className="ml-4 flex-1 cursor-pointer" onClick={() => onEdit(habit)}>
                            <h3 className={`font-semibold text-lg transition-colors ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                {habit.name}
                            </h3>
                            <div className="flex items-center gap-3 mt-1">
                                <span className={`text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium`}>
                                    {habit.category}
                                </span>
                                <span className="flex items-center text-xs font-medium text-amber-500">
                                    <Flame size={12} className="mr-1" fill="currentColor" />
                                    {habit.streak} day streak
                                </span>
                            </div>
                        </div>

                        <div className="w-1 h-8 rounded-full ml-4" style={{ backgroundColor: habit.color }}></div>
                    </motion.div>
                );
            })}
            
            {todaysHabits.length === 0 && (
                <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-400">No habits for today. Start by adding one!</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
