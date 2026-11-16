"use client";

import { useState } from "react";
import { BarChart3, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dayMonth, weekdayShort } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { DailyActivity } from "@/types/domain";

/**
 * Stacked column chart, hand-built for exact mark specs:
 * ≤24px columns, 2px surface gap between segments, 4px rounded data-end on the
 * top segment only (square at the baseline), 1px solid recessive gridlines,
 * legend + per-column tooltip + table view. Colors: chart-1 / chart-2 (validated).
 */

const SERIES = [
  { key: "listeningMinutes", label: "Nghe (nghe chép)", color: "bg-chart-1" },
  { key: "speakingMinutes", label: "Nói (shadowing)", color: "bg-chart-2" },
] as const;

/** Plot height in px; must match the h-48 class on the plot and y-axis. */
const PLOT_PX = 192;

function niceScale(max: number) {
  const steps = [5, 10, 15, 20, 30, 60, 120];
  const step = steps.find((s) => max / s <= 4) ?? 120;
  const top = Math.max(step, Math.ceil(max / step) * step);
  const ticks = Array.from({ length: top / step + 1 }, (_, i) => i * step);
  return { top, ticks };
}

export function WeeklyActivityChart({ data, goalMinutes }: { data: DailyActivity[]; goalMinutes: number }) {
  const [view, setView] = useState<"chart" | "table">("chart");
  const [active, setActive] = useState<number | null>(null);

  const totals = data.map((d) => d.listeningMinutes + d.speakingMinutes);
  const { top, ticks } = niceScale(Math.max(goalMinutes, ...totals));
  const pct = (v: number) => `${(v / top) * 100}%`;
  const weekTotal = totals.reduce((a, b) => a + b, 0);
  const daysOnGoal = totals.filter((t) => t >= goalMinutes).length;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">Hoạt động 7 ngày</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            <span className="font-medium text-foreground tabular">{weekTotal} phút</span> · đạt mục tiêu{" "}
            <span className="font-medium text-foreground tabular">{daysOnGoal}/7</span> ngày
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ul className="flex items-center gap-3.5 text-xs text-muted-foreground" aria-label="Chú thích">
            {SERIES.map((s) => (
              <li key={s.key} className="flex items-center gap-1.5">
                <span aria-hidden className={cn("size-2.5 rounded-[3px]", s.color)} />
                {s.label}
              </li>
            ))}
          </ul>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setView(view === "chart" ? "table" : "chart")}
            aria-label={view === "chart" ? "Xem dạng bảng" : "Xem biểu đồ"}
            title={view === "chart" ? "Xem dạng bảng" : "Xem biểu đồ"}
          >
            {view === "chart" ? <Table2 /> : <BarChart3 />}
          </Button>
        </div>
      </div>

      {view === "table" ? (
        <table className="mt-5 w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th className="py-2 font-medium">Ngày</th>
              <th className="py-2 text-right font-medium">Nghe</th>
              <th className="py-2 text-right font-medium">Nói</th>
              <th className="py-2 text-right font-medium">Tổng</th>
            </tr>
          </thead>
          <tbody className="tabular">
            {data.map((d, i) => (
              <tr key={d.date} className="border-b last:border-0">
                <td className="py-2">
                  {weekdayShort(d.date)} {dayMonth(d.date)}
                </td>
                <td className="py-2 text-right">{d.listeningMinutes}</td>
                <td className="py-2 text-right">{d.speakingMinutes}</td>
                <td className="py-2 text-right font-medium">{totals[i]} phút</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="mt-6 flex gap-3">
          {/* Y axis */}
          <div className="relative h-48 w-6 shrink-0 text-right text-[11px] text-muted-foreground tabular" aria-hidden>
            {ticks.map((t) => (
              <span key={t} className="absolute right-0 translate-y-1/2" style={{ bottom: pct(t) }}>
                {t}
              </span>
            ))}
          </div>

          <div className="relative flex-1">
            {/* Plot */}
            <div className="relative h-48">
              {ticks.map((t) => (
                <div key={t} aria-hidden className="absolute inset-x-0 h-px bg-border" style={{ bottom: pct(t) }} />
              ))}
              <div
                aria-hidden
                className="absolute inset-x-0 z-10 h-px bg-foreground/40"
                style={{ bottom: pct(goalMinutes) }}
              >
                <span className="absolute -top-4.5 right-0 rounded bg-card px-1 text-[10.5px] font-medium text-muted-foreground">
                  Mục tiêu {goalMinutes}p
                </span>
              </div>

              <div className="absolute inset-0 grid grid-cols-7">
                {data.map((d, i) => {
                  const segments = SERIES.map((s) => ({ ...s, value: d[s.key] })).filter((s) => s.value > 0);
                  const isToday = i === data.length - 1;
                  return (
                    <button
                      key={d.date}
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onMouseLeave={() => setActive(null)}
                      onFocus={() => setActive(i)}
                      onBlur={() => setActive(null)}
                      aria-label={`${weekdayShort(d.date)} ${dayMonth(d.date)}: nghe ${d.listeningMinutes} phút, nói ${d.speakingMinutes} phút`}
                      className="group/col relative flex h-full cursor-default flex-col items-center justify-end outline-none"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "absolute inset-y-0 inset-x-1 rounded-md transition-colors",
                          active === i ? "bg-muted/80" : "group-focus-visible/col:bg-muted",
                        )}
                      />
                      <span className="relative flex w-full max-w-6 flex-col-reverse gap-[2px]">
                        {segments.map((s, j) => (
                          <span
                            key={s.key}
                            className={cn(s.color, j === segments.length - 1 && "rounded-t-[4px]")}
                            // Upper segments give up the 2px gap so the stack top stays on scale.
                            style={{ height: `${Math.max(2, (s.value / top) * PLOT_PX - (j > 0 ? 2 : 0))}px` }}
                          />
                        ))}
                      </span>
                      {active === i && (
                        <span
                          role="tooltip"
                          className="absolute bottom-full left-1/2 z-20 mb-2 w-40 -translate-x-1/2 rounded-lg border bg-popover px-3 py-2 text-left text-xs shadow-lg"
                        >
                          <span className="block font-medium text-foreground">
                            {isToday ? "Hôm nay" : weekdayShort(d.date)}, {dayMonth(d.date)}
                          </span>
                          {SERIES.map((s) => (
                            <span key={s.key} className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                              <span aria-hidden className={cn("size-2 rounded-[2px]", s.color)} />
                              {s.label.split(" ")[0]}
                              <span className="ml-auto font-medium text-foreground tabular">{d[s.key]} phút</span>
                            </span>
                          ))}
                          <span className="mt-1.5 flex border-t pt-1.5 text-muted-foreground">
                            Tổng
                            <span className="ml-auto font-semibold text-foreground tabular">{totals[i]} phút</span>
                          </span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* X axis */}
            <div className="mt-2 grid grid-cols-7 text-center text-[11px] text-muted-foreground" aria-hidden>
              {data.map((d, i) => (
                <span key={d.date} className={cn(i === data.length - 1 && "font-semibold text-foreground")}>
                  {i === data.length - 1 ? "Nay" : weekdayShort(d.date)}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
