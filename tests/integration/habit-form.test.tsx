import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: mockPush }),
}));

import HabitForm from '@/components/habits/HabitForm';
import HabitCard from '@/components/habits/HabitCard';
import { saveSession, upsertHabit } from '@/lib/storage';
import type { Habit } from '@/types/habit';

const TODAY = new Date().toISOString().slice(0, 10);

const baseHabit: Habit = {
  id: 'h1',
  userId: 'u1',
  name: 'Drink Water',
  description: 'Stay hydrated',
  frequency: 'daily',
  createdAt: new Date().toISOString(),
  completions: [],
};

beforeEach(() => {
  localStorage.clear();
  mockPush.mockClear();
  saveSession({ userId: 'u1', email: 'test@example.com' });
});

describe('habit form', () => {
  it('shows a validation error when habit name is empty', async () => {
    const user = userEvent.setup();
    render(<HabitForm onSave={vi.fn()} onCancel={vi.fn()} />);

    await user.click(screen.getByTestId('habit-save-button'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Habit name is required');
    });
  });

  it('creates a new habit and renders it in the list', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<HabitForm onSave={onSave} onCancel={vi.fn()} />);

    await user.type(screen.getByTestId('habit-name-input'), 'Drink Water');
    await user.type(screen.getByTestId('habit-description-input'), 'Stay hydrated');
    await user.click(screen.getByTestId('habit-save-button'));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({ name: 'Drink Water', description: 'Stay hydrated', frequency: 'daily' });
    });

    upsertHabit(baseHabit);
    render(<HabitCard habit={baseHabit} today={TODAY} onUpdate={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByTestId('habit-card-drink-water')).toBeInTheDocument();
  });

  it('edits an existing habit and preserves immutable fields', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<HabitForm initial={baseHabit} onSave={onSave} onCancel={vi.fn()} />);

    const nameInput = screen.getByTestId('habit-name-input');
    await user.clear(nameInput);
    await user.type(nameInput, 'Read Books');
    await user.click(screen.getByTestId('habit-save-button'));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({ name: 'Read Books', description: 'Stay hydrated', frequency: 'daily' });
    });

    // The form only passes name/description/frequency — id, userId, createdAt, completions stay with caller
    const call = onSave.mock.calls[0][0];
    expect(call).not.toHaveProperty('id');
    expect(call).not.toHaveProperty('userId');
    expect(call).not.toHaveProperty('createdAt');
    expect(call).not.toHaveProperty('completions');
  });

  it('deletes a habit only after explicit confirmation', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<HabitCard habit={baseHabit} today={TODAY} onUpdate={vi.fn()} onEdit={vi.fn()} onDelete={onDelete} />);

    await user.click(screen.getByTestId('habit-delete-drink-water'));
    expect(onDelete).not.toHaveBeenCalled();

    await waitFor(() => screen.getByTestId('confirm-delete-button'));
    await user.click(screen.getByTestId('confirm-delete-button'));

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith(baseHabit);
    });
  });

  it('toggles completion and updates the streak display', async () => {
    const user = userEvent.setup();
    let currentHabit: Habit = { ...baseHabit, completions: [] as string[] };
    const onUpdate = vi.fn((updated: Habit) => { currentHabit = updated; });

    const { rerender } = render(
      <HabitCard habit={currentHabit} today={TODAY} onUpdate={onUpdate} onEdit={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByTestId('habit-streak-drink-water')).toHaveTextContent('0');

    await user.click(screen.getByTestId('habit-complete-drink-water'));
    expect(onUpdate).toHaveBeenCalled();

    rerender(
      <HabitCard habit={onUpdate.mock.calls[0][0]} today={TODAY} onUpdate={onUpdate} onEdit={vi.fn()} onDelete={vi.fn()} />
    );

    await waitFor(() => {
      expect(screen.getByTestId('habit-streak-drink-water')).toHaveTextContent('1');
    });
  });
});