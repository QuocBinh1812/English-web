import { addDays, toDateKey } from "@/lib/domain/dates";
import { nearbyLevels } from "@/lib/domain/cefr";
import type { LearningMethod, Lesson, StudySession, UserProfile } from "@/types/domain";

/**
 * Generates a believable practice history (study sessions) for the demo user.
 * Deterministic for a given seed and "today", so numbers don't jump between
 * requests. These rows are the *only* source of progress: every dashboard
 * figure is computed from them, exactly as it will be from database rows.
 */

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const VN_OFFSET_HOURS = 7;

/** ISO timestamp for `hour:minute` local (UTC+7) time on a date key. */
function atLocalTime(dateKey: string, hour: number, minute: number): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, hour - VN_OFFSET_HOURS, minute)).toISOString();
}

export interface ActivityOptions {
  user: UserProfile;
  lessons: readonly Lesson[];
  now: Date;
  timeZone: string;
  days?: number;
  seed?: number;
}

export function generateStudySessions({
  user,
  lessons,
  now,
  timeZone,
  days = 60,
  seed = 20261116,
}: ActivityOptions): StudySession[] {
  const rand = mulberry32(seed);
  const between = (min: number, max: number) => Math.floor(min + rand() * (max - min + 1));
  const todayKey = toDateKey(now, timeZone);

  // A learner works through lessons near their level, one at a time.
  const levels = new Set(nearbyLevels(user.level, 1));
  const pool = lessons
    .filter((l) => levels.has(l.level) && (!l.isPro || user.isPro))
    .map((l) => ({ l, k: rand() }))
    .sort((a, b) => a.k - b.k)
    .map((x) => x.l);

  const done = new Map<string, number>(); // `${lessonId}:${method}` -> segments
  let cursor = 0;
  const sessions: StudySession[] = [];

  for (let offset = days - 1; offset >= 0; offset--) {
    const dateKey = addDays(todayKey, -offset);
    // Recent 9 days form an unbroken streak; one rest day before it; older days ~65%.
    const active = offset <= 8 ? true : offset === 9 ? false : rand() < 0.65;
    if (!active || cursor >= pool.length) continue;

    const count = offset === 0 ? 1 : between(1, 2);
    for (let i = 0; i < count && cursor < pool.length; i++) {
      const lesson = pool[cursor];
      const main: LearningMethod = lesson.methods[0];
      const method: LearningMethod =
        lesson.methods.length > 1 && rand() < 0.3 ? lesson.methods[1] : main;
      const key = `${lesson.id}:${method}`;
      const already = done.get(key) ?? 0;
      const segments = Math.min(between(3, 7), lesson.segmentCount - already);
      if (segments <= 0) {
        cursor++;
        continue;
      }
      done.set(key, already + segments);

      const progressBoost = (days - offset) * 0.22; // learners improve over time
      const base = method === "dictation" ? 66 : 60;
      const score = Math.max(35, Math.min(99, Math.round(base + progressBoost + (rand() - 0.5) * 18)));

      let startedAt: string;
      if (offset === 0) {
        startedAt = new Date(now.getTime() - between(25, 90) * 60_000).toISOString();
      } else {
        startedAt = atLocalTime(dateKey, between(6, 22), between(0, 59));
      }

      sessions.push({
        id: `ses_${String(sessions.length + 1).padStart(4, "0")}`,
        userId: user.id,
        lessonId: lesson.id,
        method,
        startedAt,
        // Replays, typing and retries: ~1.5–3 minutes per sentence.
        durationSec: segments * between(95, 185),
        segmentsCompleted: segments,
        score,
      });

      if ((done.get(`${lesson.id}:${main}`) ?? 0) >= lesson.segmentCount) cursor++;
    }
  }

  return sessions;
}
