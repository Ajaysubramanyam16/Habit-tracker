import React from 'react';
import { Habit } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from 'recharts';
import { ActivityHeatmap } from '../components/charts/ActivityHeatmap';
import { Trophy, TrendingUp, Target } from 'lucide-react';

interface AnalyticsPageProps {
  habits: Habit[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ habits }) => {
  // Aggregate data for charts
  const today = new Date();
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const weeklyData = last7Days.map(date => {
    const activeCount = habits.length; // Simplified
    const completedCount = habits.filter(h => h.logs[date]).length;
    return {
        date: date.slice(5), // MM-DD
        completion: activeCount > 0 ? Math.round((completedCount / activeCount) * 100) : 0
    };
  });

  const bestStreaks = habits
    .sort((a, b) => b.bestStreak - a.bestStreak)
    .slice(0, 5)
    .map(h => ({ name: h.name, streak: h.bestStreak, color: h.color }));

  const totalCompletions = habits.reduce((acc, h) => acc + Object.keys(h.logs).length, 0);
  const avgConsistency = habits.length ? Math.round(weeklyData.reduce((a, b) => a + b.completion, 0) / 7) : 0;

  return (
    <div className="space-y-8 animate-fade-in">
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Analytics</h1>
            <p className="text-slate-500">Deep dive into your performance metrics.</p>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Trophy size={24} />
                </div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Total Check-ins</p>
                    <p className="text-2xl font-bold text-slate-800">{totalCompletions}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <TrendingUp size={24} />
                </div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Weekly Consistency</p>
                    <p className="text-2xl font-bold text-slate-800">{avgConsistency}%</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                    <Target size={24} />
                </div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Longest Streak</p>
                    <p className="text-2xl font-bold text-slate-800">{bestStreaks[0]?.streak || 0} <span className="text-sm font-normal text-slate-400">days</span></p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Trend Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Completion Trend (Last 7 Days)</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={weeklyData}>
                            <defs>
                                <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                            />
                            <Area type="monotone" dataKey="completion" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCompletion)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Best Streaks Bar Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Top Streaks</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={bestStreaks} layout="vertical" margin={{ left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={100} tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                            <Bar dataKey="streak" radius={[0, 4, 4, 0]} barSize={20}>
                                {bestStreaks.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Heatmap Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Activity Map</h3>
            <ActivityHeatmap habits={habits} />
        </div>
    </div>
  );
};
