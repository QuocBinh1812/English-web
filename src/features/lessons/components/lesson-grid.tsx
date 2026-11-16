import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { LessonListItem } from "@/types/domain";
import { LessonCard } from "./lesson-card";

const GRID = "grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4";

export function LessonGrid({ lessons, className }: { lessons: LessonListItem[]; className?: string }) {
  return (
    <div className={cn(GRID, className)}>
      {lessons.map((l) => (
        <LessonCard key={l.id} lesson={l} />
      ))}
    </div>
  );
}

export function LessonCardSkeleton() {
  return (
    <div aria-hidden>
      <Skeleton className="aspect-video w-full rounded-xl" />
      <Skeleton className="mt-3 h-4 w-24" />
      <Skeleton className="mt-2.5 h-5 w-11/12" />
      <Skeleton className="mt-1.5 h-4 w-2/3" />
      <Skeleton className="mt-4 h-5 w-32" />
    </div>
  );
}

export function LessonGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
  return (
    <div className={cn(GRID, className)} role="status" aria-label="Đang tải bài học">
      {Array.from({ length: count }, (_, i) => (
        <LessonCardSkeleton key={i} />
      ))}
    </div>
  );
}
