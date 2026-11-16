import "server-only";
import { unstable_rethrow } from "next/navigation";
import { connection, NextResponse } from "next/server";
import { ZodError } from "zod";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { ApiError, type ApiErrorBody } from "./errors";

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json<ApiErrorBody>({ error: { code, message } }, { status });
}

/**
 * Wraps a route handler: JSON success responses, consistent error bodies,
 * and no internal error details leaked to the client.
 *
 * API data is always request-time (per user, live content), so we opt out of
 * prerendering up front — outside the try, so the framework's prerender
 * signal is never caught here.
 */
export async function handle<T>(fn: () => Promise<T>): Promise<NextResponse> {
  await connection();
  try {
    const data = await fn();
    return NextResponse.json(data, { headers: { "Cache-Control": "private, no-store" } });
  } catch (err) {
    unstable_rethrow(err); // let Next.js control-flow errors (redirect, notFound…) through
    if (err instanceof ApiError) return errorResponse(err.status, err.code, err.message);
    if (err instanceof ZodError) {
      return errorResponse(400, "invalid_request", err.issues[0]?.message ?? "Invalid request");
    }
    console.error("[api] unexpected error", err);
    return errorResponse(500, "internal_error", "Đã có lỗi xảy ra. Vui lòng thử lại.");
  }
}

/** Throws 401 when there is no signed-in user. */
export async function requireUserId(): Promise<string> {
  const userId = await getCurrentUserId();
  if (!userId) throw new ApiError(401, "unauthorized", "Bạn cần đăng nhập.");
  return userId;
}
