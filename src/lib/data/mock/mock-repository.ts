import "server-only";
import { siteConfig } from "@/config/site";
import { toDateKey } from "@/lib/domain/dates";
import { applyLessonQuery } from "@/lib/domain/lesson-query";
import { buildDashboard, withProgress } from "@/lib/domain/progress";
import { CEFR_LEVELS, type StudySession } from "@/types/domain";
import type { Repositories } from "../repositories";
import { COLLECTIONS, LESSONS, MOCK_USER, TOPICS } from "./seed-content";
import { generateStudySessions } from "./seed-activity";

/**
 * In-memory repository backed by seed data. Behaves like the real one
 * (async, latency, per-user filtering) so the UI is exercised realistically.
 */

const topicNames = new Map(TOPICS.map((t) => [t.slug, t.name]));
const searchText = (l: (typeof LESSONS)[number]) =>
  [l.title, l.description, ...l.topicSlugs.map((s) => topicNames.get(s) ?? s)].join(" ");

let sessionCache: { dayKey: string; sessions: StudySession[] } | null = null;

function sessionsFor(userId: string | null, now = new Date()): StudySession[] {
  if (userId !== MOCK_USER.id) return [];
  const dayKey = toDateKey(now, siteConfig.timeZone);
  if (sessionCache?.dayKey !== dayKey) {
    sessionCache = {
      dayKey,
      sessions: generateStudySessions({
        user: MOCK_USER,
        lessons: LESSONS,
        now,
        timeZone: siteConfig.timeZone,
      }),
    };
  }
  return sessionCache.sessions;
}

export function createMockRepositories(latencyMs: number): Repositories {
  const delay = () =>
    latencyMs > 0
      ? new Promise<void>((r) => setTimeout(r, latencyMs * (0.6 + Math.random() * 0.8)))
      : Promise.resolve();

  return {
    lessons: {
      async list(query, userId) {
        await delay();
        const sessions = sessionsFor(userId);
        const { items, total } = applyLessonQuery(LESSONS, query, searchText);
        return {
          items: items.map((l) => withProgress(l, sessions)),
          total,
          page: query.page,
          pageSize: query.pageSize,
          hasMore: query.page * query.pageSize < total,
        };
      },

      async facets() {
        await delay();
        return {
          topics: TOPICS.map((t) => ({
            ...t,
            lessonCount: LESSONS.filter((l) => l.topicSlugs.includes(t.slug)).length,
          })),
          collections: COLLECTIONS,
          levels: CEFR_LEVELS.map((level) => ({
            level,
            lessonCount: LESSONS.filter((l) => l.level === level).length,
          })),
        };
      },

      async getBySlug(slug, userId) {
        await delay();
        const lesson = LESSONS.find((l) => l.slug === slug);
        return lesson ? withProgress(lesson, sessionsFor(userId)) : null;
      },
    },

    users: {
      async getProfile(userId) {
        await delay();
        return userId === MOCK_USER.id ? MOCK_USER : null;
      },
    },

    progress: {
      async getDashboard(userId, now) {
        await delay();
        if (userId !== MOCK_USER.id) throw new Error(`Unknown user ${userId}`);
        return buildDashboard({
          user: MOCK_USER,
          lessons: LESSONS,
          sessions: sessionsFor(userId, now),
          now,
          timeZone: siteConfig.timeZone,
        });
      },
    },
  };
}
