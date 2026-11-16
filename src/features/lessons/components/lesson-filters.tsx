"use client";

import { Search, X } from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { TopicIcon } from "@/components/shared/topic-icon";
import { CEFR_LABELS, DIFFICULTY_LABELS, METHOD_LABELS } from "@/lib/domain/cefr";
import {
  LESSON_SORTS,
  SORT_LABELS,
  hasActiveFilters,
  type LessonQuery,
} from "@/lib/domain/lesson-query";
import { cn } from "@/lib/utils";
import {
  CEFR_LEVELS,
  DIFFICULTIES,
  LEARNING_METHODS,
  type CefrLevel,
  type LessonFacets,
} from "@/types/domain";

const ALL = "all";

/** Select trigger: fills its grid cell on mobile, truncates instead of overflowing. */
const TRIGGER =
  "h-10! w-full min-w-0 rounded-xl bg-card px-3 text-[13px] sm:text-sm [&>span]:truncate";

/** Horizontal chip row: scrolls on small screens, fades at the right edge. */
const CHIP_ROW =
  "scrollbar-none -mx-4 flex gap-1.5 overflow-x-auto px-4 [mask-image:linear-gradient(to_right,black_calc(100%-2rem),transparent)] sm:mx-0 sm:px-0 sm:pr-8";

/** Keep the selected chip visible when the page opens with a filter applied. */
function useScrollActiveIntoView(dep: string) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const row = ref.current;
    const active = row?.querySelector<HTMLElement>("[aria-pressed='true']");
    if (!row || !active) return;
    const left = active.offsetLeft - row.offsetLeft;
    if (left + active.offsetWidth > row.clientWidth || left < row.scrollLeft) {
      row.scrollTo({ left: Math.max(0, left - 16) });
    }
  }, [dep]);
  return ref;
}

function Chip({
  active,
  onClick,
  children,
  className,
  ...rest
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
  title?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium whitespace-nowrap transition-colors",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "bg-card text-foreground/80 hover:border-foreground/20 hover:text-foreground",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

function SearchBox({ value, onChange }: { value: string; onChange: (q: string) => void }) {
  const [text, setText] = useState(value);
  const [synced, setSynced] = useState(value);
  const [sent, setSent] = useState(value);

  // URL changed from outside (back/forward, reset): adopt it — but never
  // overwrite what the user is still typing with our own debounced echo.
  if (value !== synced) {
    setSynced(value);
    if (value !== sent) {
      setText(value);
      setSent(value);
    }
  }

  const emit = useEffectEvent((q: string) => {
    setSent(q);
    onChange(q);
  });

  useEffect(() => {
    const q = text.trim();
    if (q === sent) return;
    const t = setTimeout(() => emit(q), 300);
    return () => clearTimeout(t);
  }, [text, sent]);

  return (
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={text}
        maxLength={100}
        onChange={(e) => setText(e.target.value)}
        placeholder="Tìm theo tên bài, chủ đề… (gõ không dấu cũng được)"
        aria-label="Tìm bài học"
        className="h-10 w-full rounded-xl border bg-card pr-10 pl-10 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/20 [&::-webkit-search-cancel-button]:hidden"
      />
      {text && (
        <button
          type="button"
          onClick={() => {
            setText("");
            setSent("");
            onChange("");
          }}
          aria-label="Xóa từ khóa"
          className="absolute top-1/2 right-2.5 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}

export function LessonFilters({
  query,
  facets,
  onChange,
  onReset,
}: {
  query: LessonQuery;
  facets: LessonFacets | undefined;
  onChange: (patch: Partial<LessonQuery>) => void;
  onReset: () => void;
}) {
  const toggleLevel = (level: CefrLevel) => {
    const set = new Set(query.levels);
    if (set.has(level)) set.delete(level);
    else set.add(level);
    onChange({ levels: CEFR_LEVELS.filter((l) => set.has(l)) });
  };
  const levelCount = (level: CefrLevel) =>
    facets?.levels.find((l) => l.level === level)?.lessonCount;
  const levelRow = useScrollActiveIntoView(query.levels.join(","));
  const topicRow = useScrollActiveIntoView(`${query.topic ?? ""}:${facets ? 1 : 0}`);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBox value={query.q} onChange={(q) => onChange({ q })} />
        <div className="grid grid-cols-[1fr_1.25fr_1fr] gap-2 sm:flex">
          <Select
            value={query.difficulty ?? ALL}
            onValueChange={(v) => onChange({ difficulty: v === ALL ? undefined : (v as LessonQuery["difficulty"]) })}
          >
            <SelectTrigger className={TRIGGER + " sm:w-36"} aria-label="Độ khó">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Mọi độ khó</SelectItem>
              {DIFFICULTIES.map((d) => (
                <SelectItem key={d} value={d}>
                  {DIFFICULTY_LABELS[d]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={query.method ?? ALL}
            onValueChange={(v) => onChange({ method: v === ALL ? undefined : (v as LessonQuery["method"]) })}
          >
            <SelectTrigger className={TRIGGER + " sm:w-44"} aria-label="Phương pháp học">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Mọi phương pháp</SelectItem>
              {LEARNING_METHODS.map((m) => (
                <SelectItem key={m} value={m}>
                  {METHOD_LABELS[m]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={query.sort} onValueChange={(v) => onChange({ sort: v as LessonQuery["sort"] })}>
            <SelectTrigger className={TRIGGER + " sm:w-36"} aria-label="Sắp xếp">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {LESSON_SORTS.map((s) => (
                <SelectItem key={s} value={s}>
                  {SORT_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden w-16 shrink-0 text-xs font-medium text-muted-foreground sm:block">Trình độ</span>
        <div ref={levelRow} className={CHIP_ROW} role="group" aria-label="Lọc theo trình độ">
          <Chip active={query.levels.length === 0} onClick={() => onChange({ levels: [] })}>
            Tất cả
          </Chip>
          {CEFR_LEVELS.map((level) => (
            <Chip
              key={level}
              active={query.levels.includes(level)}
              onClick={() => toggleLevel(level)}
              title={CEFR_LABELS[level]}
            >
              {level}
              {levelCount(level) !== undefined && (
                <span className="text-[11px] opacity-60 tabular">{levelCount(level)}</span>
              )}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden w-16 shrink-0 text-xs font-medium text-muted-foreground sm:block">Chủ đề</span>
        <div ref={topicRow} className={CHIP_ROW} role="group" aria-label="Lọc theo chủ đề">
          <Chip active={!query.topic} onClick={() => onChange({ topic: undefined })}>
            Tất cả
          </Chip>
          {facets
            ? facets.topics
                .filter((t) => t.lessonCount > 0)
                .map((t) => (
                  <Chip
                    key={t.slug}
                    active={query.topic === t.slug}
                    onClick={() => onChange({ topic: query.topic === t.slug ? undefined : t.slug })}
                  >
                    <TopicIcon name={t.icon} className="size-3.5" />
                    {t.name}
                    <span className="text-[11px] opacity-60 tabular">{t.lessonCount}</span>
                  </Chip>
                ))
            : Array.from({ length: 7 }, (_, i) => <Skeleton key={i} className="h-8 w-24 shrink-0 rounded-full" />)}
        </div>
      </div>

      {hasActiveFilters(query) && (
        <div className="sm:pl-19">
          <Button variant="ghost" size="sm" onClick={onReset} className="-ml-2 text-muted-foreground">
            <X /> Xóa bộ lọc
          </Button>
        </div>
      )}
    </div>
  );
}
