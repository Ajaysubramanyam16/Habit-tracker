import React from 'react';
import { Habit } from '../../types';

interface ActivityHeatmapProps {
  habits: Habit[];
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ habits }) => {
  // Generate last 365 days (or fewer for mobile responsiveness, let's do last 90 days/13 weeks)
  // We want to aggregate completion across ALL habits for a "Total Activity" view
  
  const generateDays = () => {
    const days = [];
    const today = new Date();
    // 16 weeks * 7 days
    for (let i = 0; i < 112; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - (111 - i));
        days.push(d);
    }
    return days;
  };

  const days = generateDays();

  const getIntensity = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    let completedCount = 0;
    let activeHabits = 0;

    habits.forEach(h => {
        // Only count if habit started before this date
        if (new Date(h.startDate) <= date) {
            activeHabits++;
            if (h.logs[dateStr]) completedCount++;
        }
    });

    if (activeHabits === 0) return 0;
    return completedCount / activeHabits;
  };

  const getColor = (intensity: number) => {
    if (intensity === 0) return 'bg-slate-100';
    if (intensity < 0.25) return 'bg-indigo-200';
    if (intensity < 0.5) return 'bg-indigo-300';
    if (intensity < 0.75) return 'bg-indigo-400';
    return 'bg-indigo-600';
  };

  return (
    <div className="w-full overflow-x-auto pb-2">
        <div className="min-w-max">
            <div className="flex text-xs text-slate-400 mb-2 gap-10 px-1">
                <span>3 months ago</span>
                <span>Today</span>
            </div>
            <div className="grid grid-rows-7 grid-flow-col gap-1 w-fit">
                {days.map((day, i) => {
                    const intensity = getIntensity(day);
                    return (
                        <div 
                            key={i}
                            title={`${day.toLocaleDateString()}: ${Math.round(intensity * 100)}% completed`}
                            className={`w-3 h-3 rounded-sm ${getColor(intensity)} transition-colors hover:ring-1 ring-slate-400`}
                        />
                    );
                })}
            </div>
        </div>
    </div>
  );
};
