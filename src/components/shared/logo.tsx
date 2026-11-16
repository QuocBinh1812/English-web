import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

/** Brand mark: a small waveform, the core "listen & repeat" idea. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-[10px] bg-primary text-primary-foreground shadow-sm",
        className,
      )}
    >
      <svg viewBox="0 0 20 20" className="size-[18px]" fill="currentColor">
        <rect x="2.5" y="8" width="2.4" height="4" rx="1.2" />
        <rect x="6.6" y="5" width="2.4" height="10" rx="1.2" />
        <rect x="10.7" y="2.5" width="2.4" height="15" rx="1.2" opacity="0.92" />
        <rect x="14.8" y="6.5" width="2.4" height="7" rx="1.2" opacity="0.75" />
      </svg>
    </span>
  );
}

export function Logo({ collapsed = false, className }: { collapsed?: boolean; className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      {!collapsed && (
        <span className="text-[17px] font-semibold tracking-tight text-foreground">
          {siteConfig.name}
        </span>
      )}
    </span>
  );
}
