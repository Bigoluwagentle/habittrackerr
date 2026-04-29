import { describe, it, expect } from 'vitest';
import { toggleHabitCompletion } from '@/src/lib/habits';
import type { Habit } from '@/src/types/habit';

const baseHabit: Habit = {
  id: 'habit-1',
  userId: 'user-1',
  name: 'Drink Water',
  description: 'Stay hydrated',
  frequency: 'daily',
  createdAt: '2025-01-01T00:00:00.000Z',
  completions: [],
};

describe('toggleHabitCompletion', () => {
  it('adds a completion date when the date is not present', () => {
    const result = toggleHabitCompletion(baseHabit, '2025-01-10');
    expect(result.completions).toContain('2025-01-10');
    expect(result.completions).toHaveLength(1);
  });

  it('removes a completion date when the date already exists', () => {
    const habit: Habit = { ...baseHabit, completions: ['2025-01-10'] };
    const result = toggleHabitCompletion(habit, '2025-01-10');
    expect(result.completions).not.toContain('2025-01-10');
    expect(result.completions).toHaveLength(0);
  });

  it('does not mutate the original habit object', () => {
    const original: Habit = { ...baseHabit, completions: [] };
    toggleHabitCompletion(original, '2025-01-10');
    expect(original.completions).toHaveLength(0);
  });

  it('does not return duplicate completion dates', () => {
    const habit: Habit = { ...baseHabit, completions: ['2025-01-10', '2025-01-10'] };
    const result = toggleHabitCompletion(habit, '2025-01-09');
    const unique = new Set(result.completions);
    expect(unique.size).toBe(result.completions.length);
  });
});