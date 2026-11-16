import type { NextRequest } from "next/server";
import { getRepositories } from "@/lib/data";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { handle } from "@/lib/api/route-handler";
import { parseLessonQuery } from "@/lib/domain/lesson-query";

export async function GET(request: NextRequest) {
  return handle(async () => {
    const query = parseLessonQuery(request.nextUrl.searchParams);
    const userId = await getCurrentUserId();
    return getRepositories().lessons.list(query, userId);
  });
}
