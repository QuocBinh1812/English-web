import { addDays } from "./dates";

export interface StreakResult {
  current: number;
  longest: number;
}

/**
 * Streak over active calendar days.
 * The current streak stays alive through today: if the learner studied
 * yesterday but not yet today, the streak is not broken until today ends.
 */
export function computeStreak(activeDays: Iterable<string>, todayKey: string): StreakResult {
  const days = new Set(activeDays);
  if (days.size === 0) return { current: 0, longest: 0 };

  let cursor = days.has(todayKey) ? todayKey : addDays(todayKey, -1);
  let current = 0;
  while (days.has(cursor)) {
    current += 1;
    cursor = addDays(cursor, -1);
  }

  const sorted = [...days].sort();
  let longest = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    run = addDays(sorted[i - 1], 1) === sorted[i] ? run + 1 : 1;
    if (run > longest) longest = run;
  }

  return { current, longest: Math.max(longest, current) };
}
