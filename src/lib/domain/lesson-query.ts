import { z } from "zod";
import {
  CEFR_LEVELS,
  DIFFICULTIES,
  LEARNING_METHODS,
  type CefrLevel,
  type Lesson,
} from "@/types/domain";

export const LESSON_SORTS = ["popular", "newest", "shortest"] as const;
export type LessonSort = (typeof LESSON_SORTS)[number];

export const SORT_LABELS: Record<LessonSort, string> = {
  popular: "Phổ biến",
  newest: "Mới nhất",
  shortest: "Ngắn nhất",
};

export const DEFAULT_PAGE_SIZE = 12;

export const lessonQuerySchema = z.object({
  q: z.string().trim().max(100).default(""),
  levels: z.array(z.enum(CEFR_LEVELS)).default([]),
  topic: z.string().regex(/^[a-z0-9-]+$/).max(40).optional(),
  difficulty: z.enum(DIFFICULTIES).optional(),
  method: z.enum(LEARNING_METHODS).optional(),
  sort: z.enum(LESSON_SORTS).default("popular"),
  page: z.coerce.number().int().min(1).max(500).default(1),
  pageSize: z.coerce.number().int().min(1).max(48).default(DEFAULT_PAGE_SIZE),
});

export type LessonQuery = z.infer<typeof lessonQuerySchema>;

/**
 * Lenient URL parser: unknown or invalid values are dropped instead of
 * failing, so a hand-edited URL still renders a sensible library.
 */
export function parseLessonQuery(params: URLSearchParams): LessonQuery {
  const pick = <T>(schema: z.ZodType<T>, value: unknown): T | undefined => {
    const r = schema.safeParse(value);
    return r.success ? r.data : undefined;
  };
  const shape = lessonQuerySchema.shape;
  const requested = new Set(
    (params.get("level") ?? "").split(",").map((s) => s.trim().toUpperCase()),
  );
  // Canonical CEFR order, so equal filters always produce equal query keys.
  const levels: CefrLevel[] = CEFR_LEVELS.filter((l) => requested.has(l));

  return {
    q: pick(shape.q, params.get("q") ?? "") ?? "",
    levels,
    topic: pick(shape.topic, params.get("topic") ?? undefined),
    difficulty: pick(shape.difficulty, params.get("difficulty") ?? undefined),
    method: pick(shape.method, params.get("method") ?? undefined),
    sort: pick(shape.sort, params.get("sort") ?? undefined) ?? "popular",
    page: pick(shape.page, params.get("page") ?? undefined) ?? 1,
    pageSize: pick(shape.pageSize, params.get("pageSize") ?? undefined) ?? DEFAULT_PAGE_SIZE,
  };
}

/** Inverse of parseLessonQuery. Defaults are omitted to keep URLs short. */
export function serializeLessonQuery(
  query: Partial<LessonQuery>,
  options: { includePaging?: boolean } = {},
): URLSearchParams {
  const p = new URLSearchParams();
  if (query.q) p.set("q", query.q);
  if (query.levels?.length) {
    const set = new Set(query.levels);
    p.set("level", CEFR_LEVELS.filter((l) => set.has(l)).join(","));
  }
  if (query.topic) p.set("topic", query.topic);
  if (query.difficulty) p.set("difficulty", query.difficulty);
  if (query.method) p.set("method", query.method);
  if (query.sort && query.sort !== "popular") p.set("sort", query.sort);
  if (options.includePaging) {
    if (query.page && query.page !== 1) p.set("page", String(query.page));
    if (query.pageSize && query.pageSize !== DEFAULT_PAGE_SIZE) {
      p.set("pageSize", String(query.pageSize));
    }
  }
  return p;
}

export function hasActiveFilters(query: LessonQuery): boolean {
  return Boolean(
    query.q || query.levels.length || query.topic || query.difficulty || query.method,
  );
}

/** Lowercase and strip Vietnamese diacritics so "cà phê" matches "ca phe". */
export function normalizeSearch(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .trim();
}

/**
 * In-memory implementation of the lesson query. The mock repository uses it;
 * the Supabase repository translates the same LessonQuery into SQL.
 */
export function applyLessonQuery<T extends Lesson>(
  lessons: readonly T[],
  query: LessonQuery,
  searchText: (lesson: T) => string = (l) => `${l.title} ${l.description}`,
): { items: T[]; total: number } {
  const terms = normalizeSearch(query.q).split(/\s+/).filter(Boolean);

  const filtered = lessons.filter((l) => {
    if (query.levels.length && !query.levels.includes(l.level)) return false;
    if (query.topic && !l.topicSlugs.includes(query.topic)) return false;
    if (query.difficulty && l.difficulty !== query.difficulty) return false;
    if (query.method && !l.methods.includes(query.method)) return false;
    if (terms.length) {
      const haystack = normalizeSearch(searchText(l));
      if (!terms.every((t) => haystack.includes(t))) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (query.sort) {
      case "newest":
        return b.publishedAt.localeCompare(a.publishedAt);
      case "shortest":
        return a.durationSec - b.durationSec;
      case "popular":
      default:
        return b.learnerCount - a.learnerCount;
    }
  });

  const start = (query.page - 1) * query.pageSize;
  return { items: sorted.slice(start, start + query.pageSize), total: sorted.length };
}
