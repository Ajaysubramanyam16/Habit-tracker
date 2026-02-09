import { Habit, JournalEntry } from '../types';
import { DEFAULT_HABITS_SEED } from '../constants';

const STORAGE_KEY = 'lumina_habits_data';

// Helper to generate some fake history for the demo
const generateMockLogs = () => {
    const logs: Record<string, boolean> = {};
    const today = new Date();
    for(let i = 0; i < 30; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        // Random completion 70% chance
        if (Math.random() > 0.3) {
            logs[dateStr] = true;
        }
    }
    return logs;
}

export const getHabits = (): Habit[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    // Seed initial data
    const seed = DEFAULT_HABITS_SEED.map(h => ({
        ...h,
        logs: generateMockLogs(),
        journal: {}
    })) as unknown as Habit[];
    saveHabits(seed);
    return seed;
  }
  return JSON.parse(data);
};

export const saveHabits = (habits: Habit[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
};

export const toggleHabitCompletion = (habits: Habit[], habitId: string, date: string): Habit[] => {
  return habits.map(habit => {
    if (habit.id !== habitId) return habit;

    const newLogs = { ...habit.logs };
    if (newLogs[date]) {
      delete newLogs[date];
    } else {
      newLogs[date] = true;
    }

    // Recalculate streak
    const streak = calculateStreak(newLogs);
    
    return {
      ...habit,
      logs: newLogs,
      streak: streak,
      bestStreak: Math.max(habit.bestStreak, streak)
    };
  });
};

export const addJournalEntry = (habits: Habit[], habitId: string, date: string, entry: JournalEntry): Habit[] => {
    return habits.map(habit => {
        if (habit.id !== habitId) return habit;
        return {
            ...habit,
            journal: {
                ...habit.journal,
                [date]: entry
            }
        };
    });
};

const calculateStreak = (logs: Record<string, boolean>): number => {
  let streak = 0;
  const today = new Date();
  // Check today or yesterday to start streak (allow checking in late for today)
  let current = new Date(today);
  let dateStr = current.toISOString().split('T')[0];

  if (!logs[dateStr]) {
     // If not done today, check yesterday. If yesterday done, streak is active.
     // If neither, streak is broken (0), unless we are strictly counting from today backwards.
     // For this simple logic: if today is not done, we check if yesterday was done to decide if we continue counting from yesterday.
     const yesterday = new Date(today);
     yesterday.setDate(yesterday.getDate() - 1);
     const yStr = yesterday.toISOString().split('T')[0];
     if (logs[yStr]) {
         current = yesterday;
     } else {
         return 0; 
     }
  }

  // Count backwards
  while (true) {
      const dStr = current.toISOString().split('T')[0];
      if (logs[dStr]) {
          streak++;
          current.setDate(current.getDate() - 1);
      } else {
          break;
      }
  }
  return streak;
};