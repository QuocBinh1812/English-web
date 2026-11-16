"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Collapsed state of the desktop sidebar, remembered per browser.
 * Storage can be unavailable (private mode, blocked site data): we then keep
 * the value in memory for the session so the toggle still works.
 */
const KEY = "lumen:sidebar-collapsed";
const listeners = new Set<() => void>();
let memory: boolean | null = null;

function read(): boolean {
  if (memory !== null) return memory;
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      memory = null;
      callback();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function useSidebarCollapsed() {
  const collapsed = useSyncExternalStore(subscribe, read, () => false);
  const setCollapsed = useCallback((value: boolean) => {
    memory = value;
    try {
      window.localStorage.setItem(KEY, value ? "1" : "0");
    } catch {
      // keep in-memory value only
    }
    listeners.forEach((l) => l());
  }, []);
  return [collapsed, setCollapsed] as const;
}
