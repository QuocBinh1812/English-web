"use client";

import { Loader2, SearchX } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { formatNumber } from "@/lib/format";
import {
  hasActiveFilters,
  parseLessonQuery,
  serializeLessonQuery,
  type LessonQuery,
} from "@/lib/domain/lesson-query";
import { cn } from "@/lib/utils";
import { useLessonFacets, useLessonList } from "../hooks";
import { LessonFilters } from "./lesson-filters";
import { LessonGrid, LessonGridSkeleton } from "./lesson-grid";

/** Lesson library. Filters live in the URL so results are shareable and survive reloads. */
export function LessonLibrary() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = useMemo(
    () => parseLessonQuery(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const navigate = useCallback(
    (next: LessonQuery) => {
      const qs = serializeLessonQuery(next).toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const update = useCallback(
    (patch: Partial<LessonQuery>) => navigate({ ...query, ...patch, page: 1 }),
    [navigate, query],
  );
  const reset = useCallback(() => navigate(parseLessonQuery(new URLSearchParams())), [navigate]);

  const facets = useLessonFacets();
  const list = useLessonList(query);

  const lessons = list.data?.pages.flatMap((p) => p.items) ?? [];
  const total = list.data?.pages[0]?.total ?? 0;
  const refreshing = list.isPlaceholderData && list.isFetching;

  return (
    <div className="space-y-8">
      <LessonFilters query={query} facets={facets.data} onChange={update} onReset={reset} />

      <section aria-labelledby="results-heading" aria-busy={list.isFetching}>
        <div className="mb-5 flex h-6 items-center gap-2">
          <h2 id="results-heading" className="text-sm font-medium text-muted-foreground">
            {list.isPending ? "Đang tải…" : `${formatNumber(total)} bài học`}
          </h2>
          {refreshing && <Loader2 className="size-3.5 animate-spin text-muted-foreground" aria-hidden />}
        </div>

        {list.isPending ? (
          <LessonGridSkeleton />
        ) : list.isError && lessons.length === 0 ? (
          <ErrorState error={list.error} onRetry={() => list.refetch()} />
        ) : lessons.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="Không có bài học phù hợp"
            description={
              hasActiveFilters(query)
                ? "Thử bỏ bớt bộ lọc hoặc tìm bằng từ khóa khác."
                : "Thư viện chưa có bài học nào."
            }
            action={
              hasActiveFilters(query) && (
                <Button variant="outline" onClick={reset}>
                  Xóa bộ lọc
                </Button>
              )
            }
          />
        ) : (
          <>
            <LessonGrid
              lessons={lessons}
              className={cn("transition-opacity duration-200", refreshing && "opacity-60")}
            />
            <div className="mt-10 flex flex-col items-center gap-2">
              {list.hasNextPage ? (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => list.fetchNextPage()}
                  disabled={list.isFetchingNextPage}
                  className="min-w-44"
                >
                  {list.isFetchingNextPage && <Loader2 className="animate-spin" />}
                  Xem thêm bài học
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">Đã hiển thị tất cả {formatNumber(total)} bài học</p>
              )}
              {list.isFetchNextPageError && (
                <p className="text-sm text-destructive">Không tải thêm được. Hãy thử lại.</p>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
