import Link from "next/link";
import { CircleCheck } from "lucide-react";
import { LevelBadge } from "@/components/shared/level-badge";
import { DIFFICULTY_LABELS, METHOD_LABELS } from "@/lib/domain/cefr";
import { formatNumber } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { LessonListItem } from "@/types/domain";
import { LessonCover } from "./lesson-cover";

const ACCENT_LABEL = { us: "Giọng Mỹ", uk: "Giọng Anh", au: "Giọng Úc" } as const;

export function LessonCard({ lesson, className }: { lesson: LessonListItem; className?: string }) {
  const started = lesson.progress.filter((p) => p.ratio > 0);
  const primary =
    started.find((p) => !p.completed)?.method ?? lesson.methods[0];
  const allDone = lesson.progress.length > 0 && lesson.progress.every((p) => p.completed);
  const best = started.reduce<number | null>(
    (m, p) => (p.bestScore !== null && (m === null || p.bestScore > m) ? p.bestScore : m),
    null,
  );
  const ratio = started.length
    ? started.reduce((s, p) => s + p.ratio, 0) / lesson.progress.length
    : 0;

  return (
    <article className={cn("group/card relative flex flex-col", className)}>
      <LessonCover lesson={lesson} className="transition-transform duration-300 ease-out-soft group-hover/card:-translate-y-0.5" />

      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <LevelBadge level={lesson.level} />
        <span>{DIFFICULTY_LABELS[lesson.difficulty]}</span>
        <span aria-hidden>·</span>
        <span>{ACCENT_LABEL[lesson.accent]}</span>
      </div>

      <h3 className="mt-1.5 line-clamp-2 text-[15px] leading-snug font-semibold">
        <Link
          href={routes.practice(primary, lesson.slug)}
          className="outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-ring"
        >
          {lesson.title}
        </Link>
      </h3>
      <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{lesson.description}</p>

      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-3">
        {lesson.methods.map((m) => (
          <span key={m} className="rounded-md border px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap text-muted-foreground">
            {METHOD_LABELS[m]}
          </span>
        ))}
        <span className="ml-auto text-[11px] whitespace-nowrap text-muted-foreground tabular">
          {formatNumber(lesson.learnerCount)} lượt học
        </span>
      </div>

      {started.length > 0 && (
        <div className="mt-3 flex items-center gap-2.5">
          {allDone ? (
            <span className="flex items-center gap-1 text-xs font-medium text-success">
              <CircleCheck className="size-3.5" /> Đã hoàn thành
            </span>
          ) : (
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted" aria-label={`Tiến độ ${Math.round(ratio * 100)}%`}>
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(4, ratio * 100)}%` }} />
            </div>
          )}
          {best !== null && (
            <span className="ml-auto text-xs font-medium tabular text-muted-foreground">
              Điểm cao nhất {best}
            </span>
          )}
        </div>
      )}
    </article>
  );
}
