import React, { useState, useEffect } from 'react';
import { Habit, User } from '../types';
import { Check, Zap, Target, ArrowRight, Calendar, Grip, TrendingUp, Award, Activity, PenLine, Clock } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { getAIInsight } from '../services/aiService';

interface DashboardProps {
  user: User;
  habits: Habit[];
  onToggle: (id: string, date: string) => void;
  onEdit: (habit: Habit) => void;
  onOpenFocus: () => void;
  onReflect: (habit: Habit) => void;
}

const MOTIVATIONAL_QUOTES = [
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
  "Discipline is choosing between what you want now and what you want most.",
  "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.",
  "Your future is created by what you do today, not tomorrow.",
  "Do something today that your future self will thank you for."
];

export const Dashboard: React.FC<DashboardProps> = ({ user, habits, onToggle, onEdit, onOpenFocus, onReflect }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [quote, setQuote] = useState('');

  useEffect(() => {
    setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
  }, []);
  
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysHabits = habits.filter(h => !h.archived);
  const completedCount = todaysHabits.filter(h => h.logs[todayStr]).length;
  const progress = todaysHabits.length > 0 ? Math.round((completedCount / todaysHabits.length) * 100) : 0;
  
  const handleGetInsight = async () => {
    setLoadingInsight(true);
    const text = await getAIInsight(habits);
    setInsight(text);
    setLoadingInsight(false);
  };

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
        className="relative overflow-hidden rounded-xl bg-white shadow-lg border border-gray-200 group"
      >
        <div className="absolute inset-0 z-0">
             <img 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
                className="w-full h-full object-cover opacity-10 group-hover:scale-105 transition-transform duration-700"
                alt="Abstract Background"
             />
             <div className="absolute inset-0 bg-gradient-to-r from-violet-900/10 to-transparent"></div>
        </div>

        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 rounded bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-wider">
                        Command Center
                    </span>
                    <span className="text-gray-400 text-xs font-mono">{todayStr}</span>
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
                    Welcome back, {user.name.split(' ')[0]}.
                </h1>
                <p className="text-gray-600 font-medium italic max-w-xl text-lg opacity-80 border-l-4 border-violet-500 pl-4 mt-4">
                    "{quote}"
                </p>
            </div>
            
            <div className="hidden md:block text-right">
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * progress) / 100} className="text-violet-600 transition-all duration-1000 ease-out" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold text-gray-900">{progress}%</span>
                        <span className="text-[10px] uppercase text-gray-500 font-bold">Done</span>
                    </div>
                </div>
            </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="p-4 rounded-full bg-blue-50 text-blue-600">
                <Target size={28} />
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Remaining</p>
                <p className="text-3xl font-bold text-gray-800">{todaysHabits.length - completedCount}</p>
                <p className="text-xs text-blue-600 font-medium mt-1">Focus required</p>
            </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="p-4 rounded-full bg-emerald-50 text-emerald-600">
                <Check size={28} />
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Completed</p>
                <p className="text-3xl font-bold text-gray-800">{completedCount}</p>
                <p className="text-xs text-emerald-600 font-medium mt-1">Keep pushing</p>
            </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="p-4 rounded-full bg-amber-50 text-amber-600">
                <Award size={28} />
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Level {user.level || 1}</p>
                <p className="text-3xl font-bold text-gray-800">
                    {user.xp || 0} <span className="text-sm font-normal text-gray-400">XP</span>
                </p>
                <p className="text-xs text-amber-600 font-medium mt-1">Next Level: 100 XP</p>
            </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Habits List */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/80 backdrop-blur-sm">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Activity size={20} className="text-violet-600" />
                        Active Protocols
                    </h2>
                    <Button size="sm" onClick={onOpenFocus} className="bg-violet-600 text-white">
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
                                className={`group flex items-center justify-between p-5 hover:bg-gray-50 transition-all cursor-pointer border-l-4 ${isCompleted ? 'bg-gray-50/50 border-green-500' : 'border-transparent hover:border-violet-500'}`}
                                onClick={() => onEdit(habit)}
                            >
                                <div className="flex items-center gap-5 flex-1">
                                    <div 
                                        className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg shadow-sm transition-transform group-hover:scale-105 ${isCompleted ? 'bg-gray-200 text-gray-400' : 'text-white'}`} 
                                        style={{ backgroundColor: isCompleted ? undefined : habit.color }}
                                    >
                                        {habit.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-base ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                            {habit.name}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm font-bold bg-gray-100 text-gray-600`}>
                                                {habit.category}
                                            </span>
                                            {habit.streak > 0 && (
                                                <span className="text-[10px] font-bold text-orange-600 flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded-sm">
                                                    <Zap size={10} fill="currentColor" /> {habit.streak} DAY STREAK
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onReflect(habit); }}
                                        className="w-10 h-10 rounded-lg border border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors"
                                        title="Log Reflection"
                                    >
                                        <PenLine size={18} />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onToggle(habit.id, todayStr); }}
                                        className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                                            isCompleted 
                                            ? 'bg-green-500 border-green-500 text-white shadow-md scale-100' 
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

          {/* AI Side Panel */}
          <motion.div variants={itemVariants} className="space-y-6">
               {/* Insight Widget */}
                <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Zap size={20} className="text-amber-300" fill="currentColor" />
                            <h3 className="font-bold text-sm uppercase tracking-wider">Tactical Insight</h3>
                        </div>
                        <p className="text-sm leading-relaxed font-medium text-violet-50 min-h-[60px]">
                            {insight || "Analyze your performance trends to unlock efficiency gains."}
                        </p>
                        <Button 
                            size="sm" 
                            onClick={handleGetInsight} 
                            isLoading={loadingInsight}
                            className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm"
                        >
                            {insight ? 'Refresh Analysis' : 'Generate Report'}
                        </Button>
                    </div>
                </div>

                {/* Mini Motivation */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
                        <TrendingUp size={16} className="text-emerald-500" />
                        Momentum
                    </h3>
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-3xl font-black text-gray-900">{progress}%</span>
                        <span className="text-sm text-gray-500 font-medium mb-1">Daily Goal</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                        <div className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Consistent action creates consistent results. You are currently {progress >= 80 ? 'crushing it!' : 'on track, keep going.'}
                    </p>
                </div>
          </motion.div>
      </div>
    </motion.div>
  );
};