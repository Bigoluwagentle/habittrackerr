export function calculateCurrentStreak(completions: string[], today?: string): number {
  const todayStr = today ?? new Date().toISOString().slice(0, 10);

  const unique = Array.from(new Set(completions));
  unique.sort();

  if (!unique.includes(todayStr)) return 0;

  let streak = 0;
  const current = new Date(todayStr);

  while (true) {
    const dateStr = current.toISOString().slice(0, 10);
    if (unique.includes(dateStr)) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}