"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api/client";
import type { CurrentUser, DashboardSummary } from "@/types/domain";

export const dashboardKeys = {
  summary: ["dashboard", "summary"] as const,
  me: ["me"] as const,
};

export function useDashboardSummary() {
  return useQuery({
    queryKey: dashboardKeys.summary,
    queryFn: ({ signal }) => apiGet<DashboardSummary>("/api/dashboard", undefined, signal),
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: dashboardKeys.me,
    queryFn: ({ signal }) => apiGet<CurrentUser>("/api/me", undefined, signal),
    staleTime: 5 * 60_000,
  });
}
