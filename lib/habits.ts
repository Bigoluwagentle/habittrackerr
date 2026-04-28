import type { Habit } from '@/types/habit';

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const completions = [...habit.completions];
  const idx = completions.indexOf(date);

  if (idx >= 0) {
    completions.splice(idx, 1);
  } else {
    completions.push(date);
  }

  return { ...habit, completions: Array.from(new Set(completions)) };
}