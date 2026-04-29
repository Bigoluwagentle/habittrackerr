import type { User, Session } from '@/src/types/auth';
import type { Habit } from '@/src/types/habit';

const KEYS = {
  USERS: 'habit-tracker-users',
  SESSION: 'habit-tracker-session',
  HABITS: 'habit-tracker-habits',
} as const;

export function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEYS.USERS);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email === email);
}

export function addUser(user: User): void {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEYS.SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveSession(session: Session): void {
  localStorage.setItem(KEYS.SESSION, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(KEYS.SESSION);
}

export function getHabits(): Habit[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEYS.HABITS);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveHabits(habits: Habit[]): void {
  localStorage.setItem(KEYS.HABITS, JSON.stringify(habits));
}

export function getHabitsForUser(userId: string): Habit[] {
  return getHabits().filter((h) => h.userId === userId);
}

export function upsertHabit(habit: Habit): void {
  const habits = getHabits();
  const idx = habits.findIndex((h) => h.id === habit.id);
  if (idx >= 0) {
    habits[idx] = habit;
  } else {
    habits.push(habit);
  }
  saveHabits(habits);
}

export function deleteHabit(habitId: string): void {
  saveHabits(getHabits().filter((h) => h.id !== habitId));
}