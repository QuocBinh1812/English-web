import { Flame } from "lucide-react";
import { weekdayShort } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { DashboardSummary } from "@/types/domain";

export function StreakCard({ streak }: { streak: DashboardSummary["streak"] }) {
  const activeToday = streak.week.at(-1)?.active ?? false;

  return (
    <section
      aria-labelledby="streak-heading"
      className="relative flex flex-col overflow-hidden rounded-2xl border bg-card p-5 md:p-6"
    >
      <div aria-hidden className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full bg-streak-soft blur-2xl" />
      <div className="relative flex items-start justify-between">
        <div>
          <h2 id="streak-heading" className="text-sm font-medium text-muted-foreground">
            Chuỗi ngày học
          </h2>
          <p className="mt-1 flex items-baseline gap-1.5">
            <span className="text-4xl leading-none font-semibold tabular">{streak.current}</span>
            <span className="text-muted-foreground">ngày</span>
          </p>
        </div>
        <span
          className={cn(
            "grid size-11 place-items-center rounded-2xl",
            activeToday ? "bg-streak text-white" : "bg-muted text-muted-foreground",
          )}
        >
          <Flame className={cn("size-6", activeToday && "fill-white/30")} />
        </span>
      </div>

      <p className="relative mt-2 text-sm text-muted-foreground">
        {activeToday
          ? "Bạn đã học hôm nay. Giữ vững nhé!"
          : streak.current > 0
            ? "Học ít nhất một bài hôm nay để không mất chuỗi."
            : "Học hôm nay để bắt đầu chuỗi mới."}
      </p>

      <ol className="relative mt-auto grid grid-cols-7 gap-1.5 pt-5" aria-label="7 ngày gần nhất">
        {streak.week.map((d, i) => {
          const isToday = i === streak.week.length - 1;
          return (
            <li key={d.date} className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "grid size-7 place-items-center rounded-full border",
                  d.active ? "border-transparent bg-streak text-white" : "bg-background",
                  isToday && !d.active && "border-dashed border-streak",
                )}
              >
                {d.active && <Flame className="size-3.5" />}
                <span className="sr-only">{d.active ? "Có học" : "Không học"}</span>
              </span>
              <span className={cn("text-[11px] text-muted-foreground", isToday && "font-semibold text-foreground")}>
                {isToday ? "Nay" : weekdayShort(d.date)}
              </span>
            </li>
          );
        })}
      </ol>

      <p className="relative mt-4 border-t pt-3 text-xs text-muted-foreground">
        Kỷ lục: <span className="font-medium text-foreground tabular">{streak.longest} ngày</span>
      </p>
    </section>
  );
}
