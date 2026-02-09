import React, { useState, useEffect } from 'react';
import { Habit, User } from '../types';
import { Check, Zap, Target, Calendar, TrendingUp, Award, Activity, PenLine, Clock, Sparkles } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { getAIBriefing } from '../services/aiService';

interface DashboardProps {
  user: User;
  habits: Habit[];
  onToggle: (id: string, date: string) => void;
  onEdit: (habit: Habit) => void;
  onOpenFocus: () => void;
  onReflect: (habit: Habit) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, habits, onToggle, onEdit, onOpenFocus, onReflect }) => {
  const [briefing, setBriefing] = useState<string | null>(null);
  const [loadingBriefing, setLoadingBriefing] = useState(false);

  useEffect(() => {
    // Generate briefing once on load if not present
    const loadBriefing = async () => {
        setLoadingBriefing(true);
        const text = await getAIBriefing(habits, user.name);
        setBriefing(text);
        setLoadingBriefing(false);
    };
    loadBriefing();
  }, [user.name]); // Run once per user session effectively

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysHabits = habits.filter(h => !h.archived);
  const completedCount = todaysHabits.filter(h => h.logs[todayStr]).length;
  const progress = todaysHabits.length > 0 ? Math.round((completedCount / todaysHabits.length) * 100) : 0;
  
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div 
      className="space-y-8 text-gray-800 pb-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero / Command Center Header */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-200 group"
      >
        <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-90"></div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
             <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative z-10 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-white">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider border border-white/10">
                        Morning Briefing
                    </span>
                    <span className="text-violet-200 text-xs font-mono">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight mb-3">
                    Hello, {user.name.split(' ')[0]}.
                </h1>
                
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 max-w-xl">
                    {loadingBriefing ? (
                        <div className="flex items-center gap-2 text-sm text-violet-200">
                            <Sparkles size={16} className="animate-spin" /> Analyzing schedule...
                        </div>
                    ) : (
                        <p className="text-sm md:text-base leading-relaxed font-medium text-violet-50">
                            "{briefing}"
                        </p>
                    )}
                </div>
            </div>
            
            <div className="hidden md:flex flex-col items-center">
                <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="56" cy="56" r="46" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/20" />
                        <circle 
                            cx="56" cy="56" r="46" 
                            stroke="currentColor" strokeWidth="8" fill="transparent" 
                            strokeDasharray="289" 
                            strokeDashoffset={289 - (289 * progress) / 100} 
                            className="text-white transition-all duration-1000 ease-out" 
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold">{progress}%</span>
                    </div>
                </div>
                <span className="text-xs font-medium text-violet-200 mt-2 uppercase tracking-wide">Daily Completion</span>
            </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-5">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                <Target size={24} />
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Remaining</p>
                <p className="text-2xl font-bold text-gray-800">{todaysHabits.length - completedCount}</p>
            </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-5">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                <Check size={24} />
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Completed</p>
                <p className="text-2xl font-bold text-gray-800">{completedCount}</p>
            </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-5 relative overflow-hidden">
            <div className="absolute right-0 top-0 p-4 opacity-5">
                <Award size={64} />
            </div>
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 z-10">
                <Award size={24} />
            </div>
            <div className="z-10">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Badges</p>
                <p className="text-2xl font-bold text-gray-800">
                    {user.badges.length} <span className="text-sm font-normal text-gray-400">Unlocked</span>
                </p>
            </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Habits List */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Activity size={20} className="text-violet-600" />
                        Today's Protocols
                    </h2>
                    <Button size="sm" onClick={onOpenFocus} className="bg-violet-600 text-white shadow-violet-200">
                        <Clock size={16} className="mr-2" /> Focus Mode
                    </Button>
                </div>
                
                <div className="divide-y divide-gray-100">
                    {todaysHabits.map((habit) => {
                        const isCompleted = !!habit.logs[todayStr];
                        
                        return (
                            <motion.div 
                                key={habit.id}
                                layoutId={habit.id}
                                className={`group flex items-center justify-between p-5 hover:bg-gray-50 transition-all cursor-pointer border-l-4 ${isCompleted ? 'bg-gray-50/50 border-emerald-400' : 'border-transparent hover:border-violet-500'}`}
                                onClick={() => onEdit(habit)}
                            >
                                <div className="flex items-center gap-5 flex-1">
                                    <div 
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm transition-transform group-hover:scale-105 ${isCompleted ? 'bg-gray-100 text-gray-400' : 'text-white'}`} 
                                        style={{ backgroundColor: isCompleted ? undefined : habit.color }}
                                    >
                                        {habit.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-base ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                            {habit.name}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-bold bg-gray-100 text-gray-600`}>
                                                {habit.category}
                                            </span>
                                            {habit.streak > 0 && (
                                                <span className="text-[10px] font-bold text-orange-600 flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                                                    <Zap size={10} fill="currentColor" /> {habit.streak}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onReflect(habit); }}
                                        className="w-10 h-10 rounded-xl border border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors"
                                        title="Log Reflection"
                                    >
                                        <PenLine size={18} />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onToggle(habit.id, todayStr); }}
                                        className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                                            isCompleted 
                                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-md scale-100' 
                                            : 'bg-white border-gray-200 text-transparent hover:border-violet-500 hover:text-violet-200 scale-95 hover:scale-100'
                                        }`}
                                    >
                                        <Check size={20} strokeWidth={4} />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                    
                    {todaysHabits.length === 0 && (
                        <div className="py-16 flex flex-col items-center justify-center text-gray-400 bg-gray-50/30">
                            <Target size={56} className="mb-4 opacity-20 text-violet-500" />
                            <p className="text-base font-medium text-gray-500">All systems quiet.</p>
                            <p className="text-sm">No habits scheduled for today.</p>
                        </div>
                    )}
                </div>
            </div>
          </motion.div>

          {/* Side Panel: Achievements Preview & Mini Stats */}
          <motion.div variants={itemVariants} className="space-y-6">
                
                {/* Achievement Showcase */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
                        <Award size={16} className="text-amber-500" />
                        Recent Badges
                    </h3>
                    
                    {user.badges.length > 0 ? (
                        <div className="grid grid-cols-4 gap-2">
                            {user.badges.slice(-4).reverse().map((badge) => (
                                <div key={badge.id} className="aspect-square rounded-xl bg-amber-50 border border-amber-100 flex flex-col items-center justify-center text-center p-1 group relative cursor-help">
                                    <span className="text-2xl mb-1">{badge.icon}</span>
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-32 bg-gray-900 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                        <p className="font-bold">{badge.name}</p>
                                        <p className="text-[10px] text-gray-300">{badge.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-xs text-gray-400">No badges yet.</p>
                            <p className="text-xs text-gray-400">Complete tasks to unlock!</p>
                        </div>
                    )}
                </div>

                {/* Level Progress */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
                        <TrendingUp size={16} className="text-violet-500" />
                        Level Progress
                    </h3>
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-3xl font-black text-gray-900">Lvl {user.level}</span>
                        <span className="text-sm text-gray-500 font-medium mb-1">{user.xp} XP</span>
                    </div>
                    {/* XP Logic: Level N requires roughly (N-1)^2 * 100 XP. Progress to next level logic simplified for UI */}
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-full rounded-full transition-all duration-1000" 
                            style={{ width: `${Math.min((user.xp % 100), 100)}%` }} // Simplified visual progress
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                        Earn 10 XP for every completed habit. 50 XP for focus sessions.
                    </p>
                </div>
          </motion.div>
      </div>
    </motion.div>
  );
};