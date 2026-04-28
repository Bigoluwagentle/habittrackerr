'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      const raw = localStorage.getItem('habit-tracker-session');
      const session = raw ? JSON.parse(raw) : null;
      if (session && session.userId) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      data-testid="splash-screen"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #7c3aed 0%, #4338ca 100%)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem' }}>
          Habit Tracker
        </h1>
        <p style={{ color: '#ddd6fe', fontSize: '1.1rem', margin: 0 }}>
          Building better days, one habit at a time
        </p>
      </div>
    </div>
  );
}