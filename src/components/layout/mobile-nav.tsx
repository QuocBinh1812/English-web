"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_NAV_HREFS, findNavItem, isActivePath } from "@/config/nav";
import { cn } from "@/lib/utils";

const SHORT_TITLES: Record<string, string> = {
  "/dashboard": "Tổng quan",
  "/topics": "Thư viện",
  "/dictation": "Nghe chép",
  "/shadowing": "Shadowing",
  "/review": "Ôn tập",
};

export function MobileNav() {
  const pathname = usePathname();
  const items = MOBILE_NAV_HREFS.map(findNavItem).filter((i) => i !== undefined);

  return (
    <nav
      aria-label="Điều hướng nhanh"
      className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="grid grid-cols-5">
        {items.map((item) => {
          const active = isActivePath(pathname, item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-14 flex-col items-center justify-center gap-1 text-[10.5px] font-medium text-muted-foreground transition-colors",
                  active && "text-primary",
                )}
              >
                <Icon className="size-5" />
                {SHORT_TITLES[item.href] ?? item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
