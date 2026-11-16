import { Headphones, Mic, Minus, TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import { formatMinutes } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { DashboardSummary, SkillProgress } from "@/types/domain";

function Delta({ value }: { value: number | null }) {
  if (value === null) return <span className="text-xs text-muted-foreground">chưa đủ dữ liệu so sánh</span>;
  const Icon = value > 0 ? TrendingUp : value < 0 ? TrendingDown : Minus;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium tabular",
        value > 0 ? "text-success" : value < 0 ? "text-destructive" : "text-muted-foreground",
      )}
    >
      <Icon className="size-3.5" />
      {value > 0 ? "+" : ""}
      {value} điểm so với 2 tuần trước
    </span>
  );
}

function Skill({
  icon: Icon,
  label,
  hint,
  skill,
  bar,
}: {
  icon: LucideIcon;
  label: string;
  hint: string;
  skill: SkillProgress;
  bar: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-xl bg-muted text-foreground/80">
          <Icon className="size-[18px]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
        <p className="text-right">
          <span className="text-2xl font-semibold tabular">{skill.score ?? "–"}</span>
          <span className="text-xs text-muted-foreground">/100</span>
        </p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted" aria-hidden>
        <div className={cn("h-full rounded-full", bar)} style={{ width: `${skill.score ?? 0}%` }} />
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <Delta value={skill.delta} />
        <span className="text-xs text-muted-foreground">{formatMinutes(skill.minutes)} luyện</span>
      </div>
    </div>
  );
}

export function SkillsCard({ skills }: { skills: DashboardSummary["skills"] }) {
  return (
    <section aria-labelledby="skills-heading" className="rounded-2xl border bg-card p-5 md:p-6">
      <h2 id="skills-heading" className="font-semibold">
        Kỹ năng
      </h2>
      <p className="mt-0.5 text-sm text-muted-foreground">Điểm trung bình 14 ngày gần nhất</p>
      <div className="mt-6 space-y-7">
        <Skill icon={Headphones} label="Nghe" hint="Độ chính xác nghe chép" skill={skills.listening} bar="bg-chart-1" />
        <Skill icon={Mic} label="Nói" hint="Điểm phát âm shadowing" skill={skills.speaking} bar="bg-chart-2" />
      </div>
    </section>
  );
}
