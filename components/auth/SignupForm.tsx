'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserByEmail, addUser, saveSession } from '@/lib/storage';

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    if (getUserByEmail(trimmedEmail)) {
      setError('User already exists');
      setLoading(false);
      return;
    }

    const newUser = {
      id: generateId(),
      email: trimmedEmail,
      password,
      createdAt: new Date().toISOString(),
    };

    addUser(newUser);
    saveSession({ userId: newUser.id, email: newUser.email });
    router.push('/dashboard');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error && (
        <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      <div className="space-y-1">
        <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          id="signup-email"
          type="email"
          data-testid="auth-signup-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900"
          placeholder="you@example.com"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          data-testid="auth-signup-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900"
          placeholder="Create a password"
        />
      </div>
      <button
        type="submit"
        data-testid="auth-signup-submit"
        disabled={loading}
        className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  );
}