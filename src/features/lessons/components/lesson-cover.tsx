import Image from "next/image";
import { Headphones, Lock, Play } from "lucide-react";
import { TopicIcon } from "@/components/shared/topic-icon";
import { formatClock } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Lesson } from "@/types/domain";
import { TOPIC_ICON_BY_SLUG } from "../topic-meta";

/** Small deterministic hash so each lesson keeps the same generated cover. */
function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Bar heights (18–81%) from a seeded LCG: same lesson, same waveform. */
function waveform(seed: number, count: number): number[] {
  const out: number[] = [];
  let s = seed;
  for (let i = 0; i < count; i++) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    out.push(18 + (s % 64));
  }
  return out;
}

const TINTS = [
  "bg-accent text-accent-foreground",
  "bg-level-2/70 text-foreground",
  "bg-streak-soft text-streak-foreground dark:text-streak",
  "bg-muted text-foreground/70",
] as const;

/**
 * Lesson thumbnail. Uses the real thumbnail when the media is curated,
 * otherwise a generated cover: topic icon over a waveform unique to the lesson.
 */
export function LessonCover({
  lesson,
  className,
  compact = false,
}: {
  lesson: Pick<Lesson, "slug" | "title" | "thumbnailUrl" | "topicSlugs"> &
    Partial<Pick<Lesson, "durationSec" | "mediaType" | "isPro">>;
  className?: string;
  compact?: boolean;
}) {
  const h = hash(lesson.slug);
  const tint = TINTS[h % TINTS.length];
  const bars = waveform(h, 28);
  const icon = TOPIC_ICON_BY_SLUG[lesson.topicSlugs[0]];

  return (
    <div className={cn("relative aspect-video overflow-hidden rounded-xl", tint, className)}>
      {lesson.thumbnailUrl ? (
        <Image
          src={lesson.thumbnailUrl}
          alt=""
          fill
          sizes="(min-width: 1280px) 300px, (min-width: 640px) 45vw, 100vw"
          className="object-cover"
        />
      ) : (
        <>
          <div aria-hidden className="absolute inset-x-4 bottom-0 flex h-1/2 items-end gap-[3px] opacity-25">
            {bars.map((b, i) => (
              <span key={i} className="flex-1 rounded-t-full bg-current" style={{ height: `${b}%` }} />
            ))}
          </div>
          <TopicIcon
            name={icon}
            aria-hidden
            strokeWidth={1.5}
            className={cn("absolute opacity-80", compact ? "top-2 left-2 size-5" : "top-3.5 left-3.5 size-7")}
          />
        </>
      )}

      {!compact && (
        <span className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-200 group-hover/card:opacity-100">
          <span className="grid size-11 place-items-center rounded-full bg-background/90 text-foreground shadow-md backdrop-blur">
            <Play className="ml-0.5 size-5 fill-current" />
          </span>
        </span>
      )}

      {!compact && lesson.isPro && (
        <span className="absolute top-2.5 right-2.5 flex h-5 items-center gap-1 rounded-md bg-foreground/85 px-1.5 text-[10px] font-semibold tracking-wide text-background">
          <Lock className="size-3" /> PRO
        </span>
      )}

      {!compact && lesson.durationSec !== undefined && (
        <span className="absolute right-2.5 bottom-2.5 flex h-5 items-center gap-1 rounded-md bg-foreground/80 px-1.5 text-[11px] font-medium tabular text-background">
          {lesson.mediaType === "audio" && <Headphones className="size-3" />}
          {formatClock(lesson.durationSec)}
        </span>
      )}
    </div>
  );
}
