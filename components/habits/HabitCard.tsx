'use client';

import { useState } from 'react';
import type { Habit } from '@/types/habit';
import { getHabitSlug } from '@/lib/slug';
import { calculateCurrentStreak } from '@/lib/streaks';
import { toggleHabitCompletion } from '@/lib/habits';

interface HabitCardProps {
  habit: Habit;
  today: string;
  onUpdate: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
}

export default function HabitCard({ habit, today, onUpdate, onEdit, onDelete }: HabitCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const slug = getHabitSlug(habit.name);
  const streak = calculateCurrentStreak(habit.completions, today);
  const isCompleted = habit.completions.includes(today);

  function handleToggle() {
    onUpdate(toggleHabitCompletion(habit, today));
  }

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className={`rounded-xl border-2 p-4 transition-all ${
        isCompleted ? 'border-violet-400 bg-violet-50' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-lg truncate ${isCompleted ? 'text-violet-700' : 'text-gray-800'}`}>
            {habit.name}
          </h3>
          {habit.description && (
            <p className="text-gray-500 text-sm mt-0.5">{habit.description}</p>
          )}
          <div data-testid={`habit-streak-${slug}`} className="flex items-center gap-1 mt-2">
            <span className="text-orange-400">🔥</span>
            <span className="text-sm font-medium text-gray-600">
              {streak} day{streak !== 1 ? 's' : ''} streak
            </span>
          </div>
        </div>
        <button
          data-testid={`habit-complete-${slug}`}
          onClick={handleToggle}
          aria-label={isCompleted ? `Unmark ${habit.name}` : `Mark ${habit.name} complete`}
          className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${
            isCompleted
              ? 'bg-violet-500 border-violet-500 text-white'
              : 'border-gray-300 hover:border-violet-400 text-transparent'
          }`}
        >
          ✓
        </button>
      </div>

      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
        <button
          data-testid={`habit-edit-${slug}`}
          onClick={() => onEdit(habit)}
          className="flex-1 text-sm text-gray-600 hover:text-violet-600 font-medium py-1.5 px-3 rounded-lg hover:bg-violet-50 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400"
        >
          Edit
        </button>
        <button
          data-testid={`habit-delete-${slug}`}
          onClick={() => setConfirmDelete(true)}
          className="flex-1 text-sm text-gray-600 hover:text-red-600 font-medium py-1.5 px-3 rounded-lg hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Delete
        </button>
      </div>

      {confirmDelete && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Delete habit?</h2>
            <p className="text-gray-600 text-sm mb-6">
              &quot;<strong>{habit.name}</strong>&quot; will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                data-testid="confirm-delete-button"
                onClick={() => { onDelete(habit); setConfirmDelete(false); }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}