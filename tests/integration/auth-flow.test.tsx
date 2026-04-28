import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: mockPush }),
}));

import SignupForm from '@/components/auth/SignupForm';
import LoginForm from '@/components/auth/LoginForm';
import { addUser, getSession } from '@/lib/storage';

beforeEach(() => {
  localStorage.clear();
  mockPush.mockClear();
});

describe('auth flow', () => {
  it('submits the signup form and creates a session', async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByTestId('auth-signup-email'), 'test@example.com');
    await user.type(screen.getByTestId('auth-signup-password'), 'password123');
    await user.click(screen.getByTestId('auth-signup-submit'));

    await waitFor(() => {
      const session = getSession();
      expect(session).not.toBeNull();
      expect(session?.email).toBe('test@example.com');
    });
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('shows an error for duplicate signup email', async () => {
    const user = userEvent.setup();
    addUser({ id: 'u1', email: 'dup@example.com', password: 'pass', createdAt: new Date().toISOString() });
    render(<SignupForm />);

    await user.type(screen.getByTestId('auth-signup-email'), 'dup@example.com');
    await user.type(screen.getByTestId('auth-signup-password'), 'newpass');
    await user.click(screen.getByTestId('auth-signup-submit'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('User already exists');
    });
  });

  it('submits the login form and stores the active session', async () => {
    const user = userEvent.setup();
    addUser({ id: 'u2', email: 'login@example.com', password: 'securepass', createdAt: new Date().toISOString() });
    render(<LoginForm />);

    await user.type(screen.getByTestId('auth-login-email'), 'login@example.com');
    await user.type(screen.getByTestId('auth-login-password'), 'securepass');
    await user.click(screen.getByTestId('auth-login-submit'));

    await waitFor(() => {
      const session = getSession();
      expect(session?.email).toBe('login@example.com');
    });
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('shows an error for invalid login credentials', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByTestId('auth-login-email'), 'nobody@example.com');
    await user.type(screen.getByTestId('auth-login-password'), 'wrong');
    await user.click(screen.getByTestId('auth-login-submit'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid email or password');
    });
  });
});