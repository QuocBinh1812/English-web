import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LevelBadge } from "@/components/shared/level-badge";
import { METHOD_LABELS } from "@/lib/domain/cefr";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { DashboardSummary } from "@/types/domain";
import { LessonCover } from "@/features/lessons/components/lesson-cover";

function GoalRing({ value, goal }: { value: number; goal: number }) {
  const ratio = goal > 0 ? Math.min(1, value / goal) : 0;
  const done = ratio >= 1;
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-34 shrink-0">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden>
        <circle cx="60" cy="60" r={r} fill="none" strokeWidth="10" className="stroke-muted" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - ratio)}
          className={cn(
            "transition-[stroke-dashoffset] duration-700 ease-out-soft",
            done ? "stroke-success" : "stroke-primary",
          )}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {done ? (
          <span className="mb-0.5 grid size-6 place-items-center rounded-full bg-success text-success-foreground">
            <Check className="size-4" strokeWidth={3} />
          </span>
        ) : null}
        <span className="text-3xl leading-none font-semibold tabular">{value}</span>
        <span className="mt-1 text-xs text-muted-foreground tabular">/ {goal} phút</span>
      </div>
    </div>
  );
}

export function TodayPanel({ data }: { data: DashboardSummary }) {
  const { today, continueLesson } = data;
  const remaining = Math.max(0, today.goalMinutes - today.minutes);
  const cont = continueLesson;
  const contProgress = cont?.progress.find((p) => p.method === cont.lastMethod);

  return (
    <section
      aria-labelledby="today-heading"
      className="flex flex-col gap-6 rounded-2xl border bg-card p-5 sm:flex-row sm:items-stretch md:p-6"
    >
      <div className="flex items-center gap-5 sm:w-[42%] sm:flex-col sm:items-start 2xl:flex-row 2xl:items-center">
        <GoalRing value={today.minutes} goal={today.goalMinutes} />
        <div>
          <h2 id="today-heading" className="text-sm font-medium text-muted-foreground">
            Mục tiêu hôm nay
          </h2>
          <p className="mt-1 text-lg leading-snug font-semibold">
            {remaining === 0 ? "Đã hoàn thành mục tiêu!" : `Còn ${remaining} phút nữa`}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {today.segments > 0 ? `${today.segments} câu đã luyện hôm nay` : "Chưa luyện câu nào hôm nay"}
          </p>
        </div>
      </div>

      <div className="hidden w-px bg-border sm:block" aria-hidden />

      <div className="flex min-w-0 flex-1 flex-col">
        <h2 className="text-sm font-medium text-muted-foreground">
          {cont ? "Tiếp tục bài đang học" : "Bắt đầu bài đầu tiên"}
        </h2>
        {cont ? (
          <div className="mt-3 flex flex-1 flex-col gap-4">
            <div className="flex gap-3.5">
              <LessonCover lesson={cont} compact className="w-28 shrink-0 rounded-lg" />
              <div className="min-w-0">
                <p className="line-clamp-2 leading-snug font-semibold">{cont.title}</p>
                <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <LevelBadge level={cont.level} />
                  {METHOD_LABELS[cont.lastMethod]}
                </div>
              </div>
            </div>
            <div>
              <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                <span>Tiến độ</span>
                <span className="font-medium text-foreground tabular">
                  {Math.round((contProgress?.ratio ?? 0) * 100)}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out-soft"
                  style={{ width: `${(contProgress?.ratio ?? 0) * 100}%` }}
                />
              </div>
            </div>
            <Button asChild size="lg" className="mt-auto self-start">
              <Link href={routes.practice(cont.lastMethod, cont.slug)}>
                Học tiếp <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="mt-3 flex flex-1 flex-col items-start gap-4">
            <p className="text-sm text-muted-foreground">
              Chọn một bài ngắn đúng trình độ để bắt đầu chuỗi ngày học.
            </p>
            <Button asChild size="lg" className="mt-auto">
              <Link href={routes.library({ levels: [data.user.level] })}>
                Chọn bài học <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
