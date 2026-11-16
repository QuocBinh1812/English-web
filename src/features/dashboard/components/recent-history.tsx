import Link from "next/link";
import { History } from "lucide-react";
import { LevelBadge } from "@/components/shared/level-badge";
import { EmptyState } from "@/components/shared/states";
import { METHOD_LABELS } from "@/lib/domain/cefr";
import { formatMinutes, formatRelative } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { HistoryEntry } from "@/types/domain";
import { LessonCover } from "@/features/lessons/components/lesson-cover";

function ScorePill({ score }: { score: number }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 min-w-10 items-center justify-center rounded-md px-1.5 text-xs font-semibold tabular",
        score >= 85 ? "bg-success/12 text-success" : score >= 65 ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground",
      )}
    >
      {score}
    </span>
  );
}

export function RecentHistory({ entries }: { entries: HistoryEntry[] }) {
  return (
    <section aria-labelledby="history-heading" className="rounded-2xl border bg-card p-5 md:p-6">
      <h2 id="history-heading" className="font-semibold">
        Lịch sử gần đây
      </h2>
      {entries.length === 0 ? (
        <EmptyState icon={History} title="Chưa có buổi học nào" description="Các buổi luyện tập sẽ xuất hiện ở đây." className="mt-4 py-10" />
      ) : (
        <ul className="mt-3 divide-y">
          {entries.map((e) => (
            <li key={e.sessionId}>
              <Link
                href={routes.practice(e.method, e.lesson.slug)}
                className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <LessonCover lesson={e.lesson} compact className="w-16 shrink-0 rounded-md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{e.lesson.title}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <LevelBadge level={e.lesson.level} className="h-4 px-1 text-[10px]" />
                    {METHOD_LABELS[e.method]} · {formatMinutes(Math.max(1, Math.round(e.durationSec / 60)))}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <ScorePill score={e.score} />
                  <time dateTime={e.startedAt} className="text-[11px] whitespace-nowrap text-muted-foreground">
                    {formatRelative(e.startedAt)}
                  </time>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
