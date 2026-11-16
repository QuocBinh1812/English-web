/**
 * Domain types shared by the UI, the API layer and every repository
 * implementation (mock today, Supabase later). Keep them storage-agnostic.
 */

export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type CefrLevel = (typeof CEFR_LEVELS)[number];

export const DIFFICULTIES = ["easy", "medium", "hard"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const LEARNING_METHODS = ["dictation", "shadowing"] as const;
export type LearningMethod = (typeof LEARNING_METHODS)[number];

export const MEDIA_TYPES = ["youtube", "audio"] as const;
export type MediaType = (typeof MEDIA_TYPES)[number];

export const ACCENTS = ["us", "uk", "au"] as const;
export type Accent = (typeof ACCENTS)[number];

export interface Topic {
  slug: string;
  name: string;
  /** lucide icon name, resolved in the UI */
  icon: string;
}

export interface Collection {
  slug: string;
  name: string;
  description: string;
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: CefrLevel;
  difficulty: Difficulty;
  topicSlugs: string[];
  collectionSlug: string;
  methods: LearningMethod[];
  mediaType: MediaType;
  /** YouTube video id or storage path. Null while the lesson media is not curated yet. */
  mediaId: string | null;
  thumbnailUrl: string | null;
  durationSec: number;
  segmentCount: number;
  accent: Accent;
  isPro: boolean;
  /** Lifetime number of learners who opened the lesson (content metric, not user progress). */
  learnerCount: number;
  publishedAt: string;
}

export interface Segment {
  id: string;
  lessonId: string;
  idx: number;
  startMs: number;
  endMs: number;
  text: string;
}

/** One practice session of a user on a lesson with one method. */
export interface StudySession {
  id: string;
  userId: string;
  lessonId: string;
  method: LearningMethod;
  startedAt: string;
  durationSec: number;
  segmentsCompleted: number;
  /** 0-100. Dictation: word accuracy. Shadowing: pronunciation score. */
  score: number;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  level: CefrLevel;
  dailyGoalMinutes: number;
  isPro: boolean;
}

/* ---------- Read models returned by the API ---------- */

/** Public subset of the profile returned by GET /api/me. */
export type CurrentUser = Pick<
  UserProfile,
  "id" | "displayName" | "avatarUrl" | "level" | "dailyGoalMinutes" | "isPro"
>;

export interface LessonProgress {
  method: LearningMethod;
  /** 0-1 */
  ratio: number;
  completed: boolean;
  bestScore: number | null;
}

export interface LessonListItem extends Lesson {
  progress: LessonProgress[];
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface TopicWithCount extends Topic {
  lessonCount: number;
}

export interface LessonFacets {
  topics: TopicWithCount[];
  collections: Collection[];
  levels: { level: CefrLevel; lessonCount: number }[];
}

export interface DailyActivity {
  /** YYYY-MM-DD in the app timezone */
  date: string;
  listeningMinutes: number;
  speakingMinutes: number;
}

export interface SkillProgress {
  /** Average score over the last 14 days, 0-100, null when no data */
  score: number | null;
  /** Difference vs the previous 14 days, null when not comparable */
  delta: number | null;
  minutes: number;
}

export interface HistoryEntry {
  sessionId: string;
  lesson: Pick<Lesson, "id" | "slug" | "title" | "level" | "thumbnailUrl" | "topicSlugs">;
  method: LearningMethod;
  startedAt: string;
  durationSec: number;
  score: number;
}

export interface DashboardSummary {
  user: Pick<UserProfile, "displayName" | "level" | "dailyGoalMinutes">;
  today: {
    date: string;
    minutes: number;
    goalMinutes: number;
    segments: number;
  };
  streak: {
    current: number;
    longest: number;
    /** Last 7 days, oldest first */
    week: { date: string; active: boolean }[];
  };
  totals: {
    minutes: number;
    sessions: number;
    lessonsCompleted: number;
    activeDays: number;
  };
  weekly: DailyActivity[];
  skills: {
    listening: SkillProgress;
    speaking: SkillProgress;
  };
  continueLesson: (LessonListItem & { lastMethod: LearningMethod }) | null;
  recommended: LessonListItem[];
  recent: HistoryEntry[];
}
