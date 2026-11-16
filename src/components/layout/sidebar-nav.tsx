"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Logo } from "@/components/shared/logo";
import { ACCOUNT_NAV, NAV_GROUPS, isActivePath, type NavItem } from "@/config/nav";
import { cn } from "@/lib/utils";

function NavLink({
  item,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = isActivePath(pathname, item.href);
  const Icon = item.icon;

  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group/nav relative flex h-9 items-center gap-3 rounded-lg px-2.5 text-[13.5px] font-medium text-sidebar-foreground transition-colors",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none",
        active && "bg-sidebar-accent text-sidebar-accent-foreground",
        collapsed && "justify-center px-0",
      )}
    >
      {active && (
        <span aria-hidden className="absolute top-2 bottom-2 -left-3 w-[3px] rounded-r-full bg-primary" />
      )}
      <Icon
        className={cn(
          "size-[18px] shrink-0 text-muted-foreground transition-colors group-hover/nav:text-sidebar-accent-foreground",
          active && "text-primary group-hover/nav:text-primary",
        )}
      />
      {!collapsed && (
        <>
          <span className="truncate">{item.title}</span>
          {!item.ready && (
            <span className="ml-auto text-[10px] font-medium tracking-wide text-muted-foreground/70 uppercase">
              Sớm
            </span>
          )}
        </>
      )}
    </Link>
  );

  if (!collapsed) return link;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={10}>
        {item.title}
        {!item.ready && <span className="opacity-60">· sắp có</span>}
      </TooltipContent>
    </Tooltip>
  );
}

export function SidebarNav({
  collapsed = false,
  onToggleCollapsed,
  onNavigate,
}: {
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full w-full flex-col">
      <div className={cn("flex h-16 shrink-0 items-center px-5", collapsed && "justify-center px-0")}>
        <Link href="/dashboard" onClick={onNavigate} aria-label="Trang tổng quan">
          <Logo collapsed={collapsed} />
        </Link>
      </div>

      <nav aria-label="Điều hướng chính" className="scrollbar-none flex-1 overflow-y-auto px-3 pb-4">
        {NAV_GROUPS.map((group, i) => (
          <div key={group.label} className={cn(i > 0 && "mt-5")}>
            {collapsed ? (
              i > 0 && <div aria-hidden className="mx-auto mb-3 h-px w-6 bg-sidebar-border" />
            ) : (
              <p className="mb-1.5 px-2.5 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground/80 uppercase">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.href}>
                  <NavLink item={item} collapsed={collapsed} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-sidebar-border px-3 py-3">
        <ul className="space-y-0.5">
          {ACCOUNT_NAV.map((item) => (
            <li key={item.href}>
              <NavLink item={item} collapsed={collapsed} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
        {onToggleCollapsed && (
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
            className={cn(
              "mt-1 flex h-9 w-full items-center gap-3 rounded-lg px-2.5 text-[13.5px] text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              collapsed && "justify-center px-0",
            )}
          >
            {collapsed ? <PanelLeftOpen className="size-[18px]" /> : <PanelLeftClose className="size-[18px]" />}
            {!collapsed && <span>Thu gọn</span>}
          </button>
        )}
      </div>
    </div>
  );
}
