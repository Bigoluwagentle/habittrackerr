'use client';

import { useState } from 'react';
import type { Habit } from '@/src/types/habit';
import { validateHabitName } from '@/src/lib/validators';

interface HabitFormProps {
  initial?: Habit;
  onSave: (data: { name: string; description: string; frequency: 'daily' }) => void;
  onCancel: () => void;
}

export default function HabitForm({ initial, onSave, onCancel }: HabitFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [nameError, setNameError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = validateHabitName(name);
    if (!result.valid) {
      setNameError(result.error);
      return;
    }
    setNameError(null);
    onSave({ name: result.value, description: description.trim(), frequency: 'daily' });
  }

  return (
    <form data-testid="habit-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-1">
        <label htmlFor="habit-name" className="block text-sm font-medium text-gray-700">
          Habit name <span className="text-red-500">*</span>
        </label>
        <input
          id="habit-name"
          type="text"
          data-testid="habit-name-input"
          value={name}
          onChange={(e) => { setName(e.target.value); setNameError(null); }}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900"
          placeholder="e.g. Drink Water"
        />
        {nameError && (
          <p role="alert" className="text-red-600 text-sm mt-1">{nameError}</p>
        )}
      </div>
      <div className="space-y-1">
        <label htmlFor="habit-description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="habit-description"
          data-testid="habit-description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 resize-none"
          placeholder="Optional description…"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="habit-frequency" className="block text-sm font-medium text-gray-700">
          Frequency
        </label>
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          value="daily"
          onChange={() => {}}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 bg-white"
        >
          <option value="daily">Daily</option>
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          data-testid="habit-save-button"
          className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
        >
          {initial ? 'Save changes' : 'Create habit'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}