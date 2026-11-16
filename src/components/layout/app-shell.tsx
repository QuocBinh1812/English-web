"use client";

import { usePathname } from "next/navigation";
import { useState, type CSSProperties, type ReactNode } from "react";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { useSidebarCollapsed } from "@/hooks/use-sidebar-collapsed";
import { AppHeader } from "./app-header";
import { MobileNav } from "./mobile-nav";
import { SidebarNav } from "./sidebar-nav";

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useSidebarCollapsed();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);

  // Close the mobile drawer whenever the route changes (state adjusted during render).
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (mobileOpen) setMobileOpen(false);
  }

  return (
    <div
      className="min-h-dvh"
      style={{ "--sidebar-w": collapsed ? "4.5rem" : "16rem" } as CSSProperties}
    >
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-(--sidebar-w) border-r border-sidebar-border bg-sidebar transition-[width] duration-300 ease-out-soft md:flex">
        <SidebarNav collapsed={collapsed} onToggleCollapsed={() => setCollapsed(!collapsed)} />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 gap-0 bg-sidebar p-0" showCloseButton={false}>
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SheetDescription className="sr-only">Điều hướng giữa các mục học</SheetDescription>
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="transition-[padding] duration-300 ease-out-soft md:pl-(--sidebar-w)">
        <AppHeader onOpenMobileNav={() => setMobileOpen(true)} />
        <main className="mx-auto w-full max-w-[1280px] px-4 pt-6 pb-24 md:px-8 md:pt-8 md:pb-14">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
