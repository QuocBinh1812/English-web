import "server-only";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import { MOCK_USER } from "@/lib/data/mock/seed-content";

/**
 * Resolves the signed-in user's id for the current request.
 * Mock mode: always the demo user. Supabase mode (step 7): read the auth
 * session from cookies via @supabase/ssr and return auth.uid().
 *
 * Reading cookies() also marks every caller as request-time, so per-user
 * data is never prerendered into a shared static response.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  if (env.DATA_SOURCE === "mock") return MOCK_USER.id;
  void cookieStore; // used by the Supabase session lookup in step 7
  return null;
}
