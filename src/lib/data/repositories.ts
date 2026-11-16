import type { LessonQuery } from "@/lib/domain/lesson-query";
import type {
  DashboardSummary,
  LessonFacets,
  LessonListItem,
  Paginated,
  UserProfile,
} from "@/types/domain";

/**
 * Storage contract. The API routes only ever talk to these interfaces, so
 * swapping the mock implementation for Supabase does not touch the frontend.
 */

export interface LessonRepository {
  /** `userId` is used to attach the caller's progress to each lesson. */
  list(query: LessonQuery, userId: string | null): Promise<Paginated<LessonListItem>>;
  facets(): Promise<LessonFacets>;
  getBySlug(slug: string, userId: string | null): Promise<LessonListItem | null>;
}

export interface UserRepository {
  getProfile(userId: string): Promise<UserProfile | null>;
}

export interface ProgressRepository {
  getDashboard(userId: string, now: Date): Promise<DashboardSummary>;
}

export interface Repositories {
  lessons: LessonRepository;
  users: UserRepository;
  progress: ProgressRepository;
}
