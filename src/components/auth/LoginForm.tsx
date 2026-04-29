'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserByEmail, saveSession } from '@/src/lib/storage';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const user = getUserByEmail(email.trim());

    if (!user || user.password !== password) {
      setError('Invalid email or password');
      setLoading(false);
      return;
    }

    saveSession({ userId: user.id, email: user.email });
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
        <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          id="login-email"
          type="email"
          data-testid="auth-login-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900"
          placeholder="you@example.com"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          data-testid="auth-login-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        data-testid="auth-login-submit"
        disabled={loading}
        className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}