import "server-only";
import { env } from "@/lib/env";
import { createMockRepositories } from "./mock/mock-repository";
import type { Repositories } from "./repositories";

let instance: Repositories | null = null;

/** Single entry point for data access on the server. */
export function getRepositories(): Repositories {
  if (instance) return instance;

  switch (env.DATA_SOURCE) {
    case "mock":
      instance = createMockRepositories(env.MOCK_LATENCY_MS);
      return instance;
    case "supabase":
      // Implemented in step 7 (SupabaseRepository). Same interface, no UI changes.
      throw new Error("DATA_SOURCE=supabase is not implemented yet. Use DATA_SOURCE=mock.");
  }
}

export type { Repositories } from "./repositories";
