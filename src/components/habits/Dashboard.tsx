'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Habit } from '@/src/types/habit';
import type { Session } from '@/src/types/auth';
import { getSession, clearSession, getHabitsForUser, upsertHabit, deleteHabit as removeHabit } from '@/src/lib/storage';
import HabitCard from '@/src/components/habits/HabitCard';
import HabitForm from '@/src/components/habits/HabitForm';

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function Dashboard() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const today = getToday();

  useEffect(() => {
    try {
      const raw = localStorage.getItem('habit-tracker-session');
      const s = raw ? JSON.parse(raw) : null;
      if (!s || !s.userId) {
        router.replace('/login');
        return;
      }
      setSession(s);
      const raw2 = localStorage.getItem('habit-tracker-habits');
      const allHabits = raw2 ? JSON.parse(raw2) : [];
      setHabits(allHabits.filter((h: Habit) => h.userId === s.userId));
    } catch {
      router.replace('/login');
    }
  }, [router]);

  function handleLogout() {
    clearSession();
    router.push('/login');
  }

  function handleCreate(data: { name: string; description: string; frequency: 'daily' }) {
    if (!session) return;
    const newHabit: Habit = {
      id: generateId(),
      userId: session.userId,
      name: data.name,
      description: data.description,
      frequency: 'daily',
      createdAt: new Date().toISOString(),
      completions: [],
    };
    upsertHabit(newHabit);
    setHabits((prev) => [...prev, newHabit]);
    setShowForm(false);
  }

  function handleEdit(data: { name: string; description: string; frequency: 'daily' }) {
    if (!editingHabit) return;
    const updated: Habit = { ...editingHabit, name: data.name, description: data.description };
    upsertHabit(updated);
    setHabits((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
    setEditingHabit(null);
  }

  function handleUpdate(updated: Habit) {
    upsertHabit(updated);
    setHabits((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
  }

  function handleDelete(habit: Habit) {
    removeHabit(habit.id);
    setHabits((prev) => prev.filter((h) => h.id !== habit.id));
  }

  if (!session) return null;

  return (
    <div data-testid="dashboard-page" className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Habit Tracker</h1>
            <p className="text-xs text-gray-500">{session.email}</p>
          </div>
          <button
            data-testid="auth-logout-button"
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-red-600 font-medium py-1.5 px-3 rounded-lg hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {!showForm && !editingHabit && (
          <button
            data-testid="create-habit-button"
            onClick={() => setShowForm(true)}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            <span className="text-xl leading-none">+</span> New habit
          </button>
        )}

        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">New habit</h2>
            <HabitForm onSave={handleCreate} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {editingHabit && (
          <div className="bg-white rounded-xl border border-violet-300 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Edit habit</h2>
            <HabitForm
              initial={editingHabit}
              onSave={handleEdit}
              onCancel={() => setEditingHabit(null)}
            />
          </div>
        )}

        {habits.length === 0 ? (
          <div data-testid="empty-state" className="text-center py-16 space-y-3">
            <div className="text-5xl">🌱</div>
            <h2 className="text-xl font-semibold text-gray-700">No habits yet</h2>
            <p className="text-gray-500 text-sm">Create your first habit to start tracking.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                today={today}
                onUpdate={handleUpdate}
                onEdit={(h) => { setEditingHabit(h); setShowForm(false); }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}