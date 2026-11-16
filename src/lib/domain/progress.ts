import type {
  DailyActivity,
  DashboardSummary,
  HistoryEntry,
  LearningMethod,
  Lesson,
  LessonListItem,
  LessonProgress,
  SkillProgress,
  StudySession,
  UserProfile,
} from "@/types/domain";
import { nearbyLevels, levelIndex } from "./cefr";
import { addDays, lastNDays, toDateKey } from "./dates";
import { computeStreak } from "./streak";

/**
 * Everything on the dashboard is derived from the user's study sessions.
 * Nothing about progress is stored pre-computed or hardcoded, so the mock
 * and Supabase repositories produce identical numbers from identical rows.
 */

const minutes = (seconds: number) => Math.round(seconds / 60);

const average = (values: number[]) =>
  values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;

export function lessonProgress(lesson: Lesson, sessions: readonly StudySession[]): LessonProgress[] {
  return lesson.methods.map((method) => {
    const own = sessions.filter((s) => s.lessonId === lesson.id && s.method === method);
    const done = own.reduce((sum, s) => sum + s.segmentsCompleted, 0);
    const ratio = lesson.segmentCount ? Math.min(1, done / lesson.segmentCount) : 0;
    return {
      method,
      ratio,
      completed: ratio >= 1,
      bestScore: own.length ? Math.max(...own.map((s) => s.score)) : null,
    };
  });
}

export function withProgress(lesson: Lesson, sessions: readonly StudySession[]): LessonListItem {
  return { ...lesson, progress: lessonProgress(lesson, sessions) };
}

function skillProgress(
  sessions: readonly StudySession[],
  method: LearningMethod,
  todayKey: string,
  timeZone: string,
): SkillProgress {
  const recentStart = addDays(todayKey, -13);
  const previousStart = addDays(todayKey, -27);
  const recent: number[] = [];
  const previous: number[] = [];
  let seconds = 0;

  for (const s of sessions) {
    if (s.method !== method) continue;
    const key = toDateKey(s.startedAt, timeZone);
    if (key >= recentStart && key <= todayKey) {
      recent.push(s.score);
      seconds += s.durationSec;
    } else if (key >= previousStart && key < recentStart) {
      previous.push(s.score);
    }
  }

  const score = average(recent);
  const prev = average(previous);
  return {
    score: score === null ? null : Math.round(score),
    delta: score === null || prev === null ? null : Math.round(score - prev),
    minutes: minutes(seconds),
  };
}

export interface DashboardInput {
  user: UserProfile;
  lessons: readonly Lesson[];
  sessions: readonly StudySession[];
  now: Date;
  timeZone: string;
  recommendedCount?: number;
  recentCount?: number;
}

export function buildDashboard({
  user,
  lessons,
  sessions,
  now,
  timeZone,
  recommendedCount = 4,
  recentCount = 6,
}: DashboardInput): DashboardSummary {
  const todayKey = toDateKey(now, timeZone);
  const lessonById = new Map(lessons.map((l) => [l.id, l]));
  const byNewest = [...sessions].sort((a, b) => b.startedAt.localeCompare(a.startedAt));

  // Per-day aggregation
  const perDay = new Map<string, { listening: number; speaking: number; segments: number }>();
  for (const s of sessions) {
    const key = toDateKey(s.startedAt, timeZone);
    const day = perDay.get(key) ?? { listening: 0, speaking: 0, segments: 0 };
    if (s.method === "dictation") day.listening += s.durationSec;
    else day.speaking += s.durationSec;
    day.segments += s.segmentsCompleted;
    perDay.set(key, day);
  }

  const today = perDay.get(todayKey);
  const streak = computeStreak(perDay.keys(), todayKey);
  const last7 = lastNDays(todayKey, 7);

  const weekly: DailyActivity[] = last7.map((date) => {
    const d = perDay.get(date);
    return {
      date,
      listeningMinutes: d ? minutes(d.listening) : 0,
      speakingMinutes: d ? minutes(d.speaking) : 0,
    };
  });

  // Progress per lesson the user has touched
  const touchedIds = new Set(sessions.map((s) => s.lessonId));
  const progressById = new Map<string, LessonListItem>();
  for (const id of touchedIds) {
    const lesson = lessonById.get(id);
    if (lesson) progressById.set(id, withProgress(lesson, sessions));
  }
  const isCompleted = (item: LessonListItem) => item.progress.some((p) => p.completed);

  // Continue: most recent session whose lesson/method is unfinished
  let continueLesson: DashboardSummary["continueLesson"] = null;
  for (const s of byNewest) {
    const item = progressById.get(s.lessonId);
    const p = item?.progress.find((x) => x.method === s.method);
    if (item && p && !p.completed) {
      continueLesson = { ...item, lastMethod: s.method };
      break;
    }
  }

  // Recommended: around the user's level, untouched first, popular first
  const allowed = new Set(nearbyLevels(user.level, 1));
  const userLevel = levelIndex(user.level);
  const recommended = lessons
    .filter((l) => allowed.has(l.level) && l.id !== continueLesson?.id)
    .filter((l) => !touchedIds.has(l.id))
    .sort(
      (a, b) =>
        Math.abs(levelIndex(a.level) - userLevel) - Math.abs(levelIndex(b.level) - userLevel) ||
        b.learnerCount - a.learnerCount,
    )
    .slice(0, recommendedCount)
    .map((l) => withProgress(l, sessions));

  const recent: HistoryEntry[] = byNewest.slice(0, recentCount).flatMap((s) => {
    const l = lessonById.get(s.lessonId);
    if (!l) return [];
    return [
      {
        sessionId: s.id,
        lesson: {
          id: l.id,
          slug: l.slug,
          title: l.title,
          level: l.level,
          thumbnailUrl: l.thumbnailUrl,
          topicSlugs: l.topicSlugs,
        },
        method: s.method,
        startedAt: s.startedAt,
        durationSec: s.durationSec,
        score: s.score,
      },
    ];
  });

  return {
    user: {
      displayName: user.displayName,
      level: user.level,
      dailyGoalMinutes: user.dailyGoalMinutes,
    },
    today: {
      date: todayKey,
      minutes: today ? minutes(today.listening + today.speaking) : 0,
      goalMinutes: user.dailyGoalMinutes,
      segments: today?.segments ?? 0,
    },
    streak: {
      current: streak.current,
      longest: streak.longest,
      week: last7.map((date) => ({ date, active: perDay.has(date) })),
    },
    totals: {
      minutes: minutes(sessions.reduce((sum, s) => sum + s.durationSec, 0)),
      sessions: sessions.length,
      lessonsCompleted: [...progressById.values()].filter(isCompleted).length,
      activeDays: perDay.size,
    },
    weekly,
    skills: {
      listening: skillProgress(sessions, "dictation", todayKey, timeZone),
      speaking: skillProgress(sessions, "shadowing", todayKey, timeZone),
    },
    continueLesson,
    recommended,
    recent,
  };
}
