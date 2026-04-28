'use client';

export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-700"
    >
      <div className="text-center space-y-4">
        <div className="text-6xl">✅</div>
        <h1 className="text-4xl font-bold text-white tracking-tight">Habit Tracker</h1>
        <p className="text-violet-200 text-lg">Building better days, one habit at a time</p>
      </div>
    </div>
  );
}