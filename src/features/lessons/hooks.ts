"use client";

import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api/client";
import { serializeLessonQuery, type LessonQuery } from "@/lib/domain/lesson-query";
import type { LessonFacets, LessonListItem, Paginated } from "@/types/domain";

export const lessonKeys = {
  all: ["lessons"] as const,
  list: (filters: string) => ["lessons", "list", filters] as const,
  facets: ["lessons", "facets"] as const,
};

/** Paged lesson list for the current filters ("Xem thêm" loads the next page). */
export function useLessonList(query: LessonQuery) {
  const filters = serializeLessonQuery({ ...query, page: 1 }).toString();
  return useInfiniteQuery({
    queryKey: lessonKeys.list(filters),
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) => {
      const params = new URLSearchParams(filters);
      params.set("page", String(pageParam));
      params.set("pageSize", String(query.pageSize));
      return apiGet<Paginated<LessonListItem>>("/api/lessons", params, signal);
    },
    getNextPageParam: (last) => (last.hasMore ? last.page + 1 : undefined),
    // Keep showing the previous results while a new filter combination loads.
    placeholderData: keepPreviousData,
  });
}

export function useLessonFacets() {
  return useQuery({
    queryKey: lessonKeys.facets,
    queryFn: ({ signal }) => apiGet<LessonFacets>("/api/lessons/facets", undefined, signal),
    staleTime: 10 * 60_000,
  });
}
