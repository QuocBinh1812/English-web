import type { LearningMethod } from "@/types/domain";
import { serializeLessonQuery, type LessonQuery } from "@/lib/domain/lesson-query";

/**
 * Central place for app URLs so modules don't hand-build paths.
 * The practice player routes (/dictation/[slug], /shadowing/[slug]) arrive
 * with step 8; until then lesson links land on the module page.
 */
export const routes = {
  dashboard: "/dashboard",
  library: (query?: Partial<LessonQuery>) => {
    const qs = query ? serializeLessonQuery(query).toString() : "";
    return qs ? `/topics?${qs}` : "/topics";
  },
  practice: (method: LearningMethod, slug: string) =>
    `/${method}?lesson=${encodeURIComponent(slug)}`,
} as const;
