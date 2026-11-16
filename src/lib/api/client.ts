import { ApiError, type ApiErrorBody } from "./errors";

/** Typed GET against our own /api routes. Throws ApiError on non-2xx. */
export async function apiGet<T>(
  path: string,
  params?: URLSearchParams,
  signal?: AbortSignal,
): Promise<T> {
  const qs = params?.toString();
  const res = await fetch(qs ? `${path}?${qs}` : path, {
    signal,
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    let body: ApiErrorBody | null = null;
    try {
      body = (await res.json()) as ApiErrorBody;
    } catch {
      // non-JSON error (e.g. proxy/HTML); fall through to a generic message
    }
    throw new ApiError(
      res.status,
      body?.error.code ?? "http_error",
      body?.error.message ?? "Không tải được dữ liệu. Vui lòng thử lại.",
    );
  }
  return (await res.json()) as T;
}
