import { cn } from "@/lib/utils";
import { CEFR_LABELS } from "@/lib/domain/cefr";
import type { CefrLevel } from "@/types/domain";

/** Single-hue ramp: A1 lightest → C2 darkest (inverted in dark mode). */
const LEVEL_CLASS: Record<CefrLevel, string> = {
  A1: "bg-level-1 text-foreground",
  A2: "bg-level-2 text-foreground",
  B1: "bg-level-3 text-foreground",
  B2: "bg-level-4 text-white dark:text-background",
  C1: "bg-level-5 text-white dark:text-background",
  C2: "bg-level-6 text-white dark:text-background",
};

export function LevelBadge({
  level,
  showLabel = false,
  className,
}: {
  level: CefrLevel;
  showLabel?: boolean;
  className?: string;
}) {
  return (
    <span
      title={CEFR_LABELS[level]}
      className={cn(
        "inline-flex h-5 items-center rounded-md px-1.5 text-[11px] font-semibold tabular tracking-wide",
        LEVEL_CLASS[level],
        className,
      )}
    >
      {level}
      {showLabel && <span className="ml-1 font-medium opacity-80">· {CEFR_LABELS[level]}</span>}
    </span>
  );
}
