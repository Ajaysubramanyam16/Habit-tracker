import { User, Habit, Badge } from '../types';
import { AVAILABLE_BADGES } from '../constants';

export const checkBadges = (user: User, habits: Habit[]): Badge[] => {
    const unlockedBadges: Badge[] = [];
    const existingBadgeIds = new Set(user.badges.map(b => b.id));

    // Helper to award
    const award = (badgeId: string) => {
        if (!existingBadgeIds.has(badgeId)) {
            const template = AVAILABLE_BADGES.find(b => b.id === badgeId);
            if (template) {
                unlockedBadges.push({
                    ...template,
                    unlockedAt: new Date().toISOString()
                });
            }
        }
    };

    // 1. First Step: Any completion
    const totalCompletions = habits.reduce((acc, h) => acc + Object.keys(h.logs).length, 0);
    if (totalCompletions >= 1) award('first_step');

    // 2. Week Warrior: 7 day streak
    const maxStreak = Math.max(...habits.map(h => h.streak), 0);
    if (maxStreak >= 7) award('week_warrior');

    // 3. Polymath: 3 categories with at least 1 habit
    const categories = new Set(habits.filter(h => !h.archived).map(h => h.category));
    if (categories.size >= 3) award('polymath');

    // 4. Dedicated: Level 5
    if (user.level >= 5) award('dedicated');

    // 5. Centurion: 100 completions
    if (totalCompletions >= 100) award('centurion');

    return unlockedBadges;
};