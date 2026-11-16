"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Flame, LogOut, Menu, Search, Settings, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LogoMark } from "@/components/shared/logo";
import { useCurrentUser, useDashboardSummary } from "@/features/dashboard/hooks";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : parts[0].slice(0, 2)).toUpperCase();
}

function HeaderSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.push(routes.library({ q: value.trim() }));
  };
  return (
    <form role="search" onSubmit={onSubmit} className={cn("relative w-full max-w-sm", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tìm bài học, chủ đề…"
        aria-label="Tìm bài học"
        className="h-9 w-full rounded-lg border border-transparent bg-muted pr-3 pl-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:bg-card"
      />
    </form>
  );
}

function StreakChip() {
  const { data } = useDashboardSummary();
  if (!data) return <Skeleton className="h-8 w-14 rounded-full" />;
  const { current } = data.streak;
  const activeToday = data.streak.week.at(-1)?.active ?? false;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href="/dashboard"
          className={cn(
            "flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-semibold tabular transition-colors",
            activeToday
              ? "bg-streak-soft text-streak-foreground dark:text-streak"
              : "bg-muted text-muted-foreground",
          )}
        >
          <Flame className={cn("size-4", activeToday ? "fill-streak text-streak" : "")} />
          {current}
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        {activeToday ? `Chuỗi ${current} ngày học liên tiếp` : "Học hôm nay để giữ chuỗi ngày"}
      </TooltipContent>
    </Tooltip>
  );
}

function UserMenu() {
  const { data: user } = useCurrentUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Tài khoản"
          className="rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <Avatar className="size-8">
            <AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">
              {user ? initials(user.displayName) : ""}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="text-sm font-medium text-foreground">{user?.displayName ?? "…"}</div>
          <div className="text-xs text-muted-foreground">
            Trình độ {user?.level ?? "–"} · {user?.isPro ? "Pro" : "Gói miễn phí"}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <UserRound /> Hồ sơ
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings /> Cài đặt
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <LogOut /> Đăng xuất
          <span className="ml-auto text-[10px] text-muted-foreground">bản demo</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppHeader({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const pathname = usePathname();
  const onLibrary = pathname.startsWith("/topics");

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur-md supports-backdrop-filter:bg-background/70 md:px-8">
      <Button
        variant="ghost"
        size="icon"
        className="-ml-1.5 md:hidden"
        onClick={onOpenMobileNav}
        aria-label="Mở menu"
      >
        <Menu />
      </Button>
      <Link href="/dashboard" className="md:hidden" aria-label="Trang tổng quan">
        <LogoMark className="size-7" />
      </Link>

      {!onLibrary && <HeaderSearch className="hidden sm:block" />}

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        {!onLibrary && (
          <Button variant="ghost" size="icon" className="sm:hidden" asChild>
            <Link href="/topics" aria-label="Tìm bài học">
              <Search />
            </Link>
          </Button>
        )}
        <StreakChip />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
