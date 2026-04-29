import type { Metadata } from 'next';
import './globals.css';
import ServiceWorkerRegistration from '@/src/components/shared/ServiceWorkerRegistration';

export const metadata: Metadata = {
  title: 'Habit Tracker',
  description: 'Build better days, one habit at a time',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#7c3aed" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="antialiased">
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}