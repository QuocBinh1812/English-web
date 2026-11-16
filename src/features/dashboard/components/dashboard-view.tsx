"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/states";
import { LevelBadge } from "@/components/shared/level-badge";
import { CEFR_LABELS } from "@/lib/domain/cefr";
import { formatMinutes, formatNumber } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { DashboardSummary } from "@/types/domain";
import { LessonGrid, LessonGridSkeleton } from "@/features/lessons/components/lesson-grid";
import { useDashboardSummary } from "../hooks";
import { RecentHistory } from "./recent-history";
import { SkillsCard } from "./skills-card";
import { StreakCard } from "./streak-card";
import { TodayPanel } from "./today-panel";
import { WeeklyActivityChart } from "./weekly-activity-chart";

function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 11) return "Chào buổi sáng";
  if (h < 14) return "Chào buổi trưa";
  if (h < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}

function TotalsStrip({ totals }: { totals: DashboardSummary["totals"] }) {
  const items = [
    { label: "Tổng thời gian học", value: formatMinutes(totals.minutes) },
    { label: "Bài đã hoàn thành", value: formatNumber(totals.lessonsCompleted) },
    { label: "Buổi luyện tập", value: formatNumber(totals.sessions) },
    { label: "Ngày có học", value: formatNumber(totals.activeDays) },
  ];
  return (
    <dl className="grid grid-cols-2 rounded-2xl border bg-card lg:grid-cols-4">
      {items.map((it, i) => (
        <div
          key={it.label}
          className={[
            "px-5 py-4 md:px-6",
            i % 2 === 1 ? "border-l" : "",
            i >= 2 ? "border-t lg:border-t-0" : "",
            i === 2 ? "lg:border-l" : "",
          ].join(" ")}
        >
          <dt className="text-xs text-muted-foreground">{it.label}</dt>
          <dd className="mt-1 text-lg font-semibold tabular sm:text-xl">{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function SectionHeading({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {action}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Đang tải tổng quan">
      <Skeleton className="h-9 w-72" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
      <Skeleton className="h-20 rounded-2xl" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
      <LessonGridSkeleton count={4} />
    </div>
  );
}

export function DashboardView() {
  const { data, isPending, isError, error, refetch } = useDashboardSummary();

  if (isPending) return <DashboardSkeleton />;
  if (isError) return <ErrorState error={error} onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <header className="mb-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{greeting()},</p>
          <h1 className="text-2xl font-semibold md:text-[28px]">{data.user.displayName}</h1>
        </div>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          Trình độ hiện tại <LevelBadge level={data.user.level} /> {CEFR_LABELS[data.user.level]}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
        <TodayPanel data={data} />
        <StreakCard streak={data.streak} />
      </div>

      <TotalsStrip totals={data.totals} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
        <section className="rounded-2xl border bg-card p-5 md:p-6">
          <WeeklyActivityChart data={data.weekly} goalMinutes={data.today.goalMinutes} />
        </section>
        <SkillsCard skills={data.skills} />
      </div>

      <section className="pt-4">
        <SectionHeading
          title="Gợi ý cho bạn"
          action={
            <Button variant="ghost" size="sm" asChild>
              <Link href={routes.library()}>
                Xem thư viện <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          }
        />
        {data.recommended.length ? (
          <LessonGrid lessons={data.recommended} className="lg:grid-cols-2 xl:grid-cols-4" />
        ) : (
          <p className="text-sm text-muted-foreground">Bạn đã thử hết bài quanh trình độ hiện tại. Hãy khám phá thư viện!</p>
        )}
      </section>

      <div className="pt-4">
        <RecentHistory entries={data.recent} />
      </div>
    </div>
  );
}
