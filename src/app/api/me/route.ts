import { getRepositories } from "@/lib/data";
import { ApiError } from "@/lib/api/errors";
import { handle, requireUserId } from "@/lib/api/route-handler";

export async function GET() {
  return handle(async () => {
    const userId = await requireUserId();
    const profile = await getRepositories().users.getProfile(userId);
    if (!profile) throw new ApiError(404, "not_found", "Không tìm thấy hồ sơ.");
    const { id, displayName, avatarUrl, level, dailyGoalMinutes, isPro } = profile;
    return { id, displayName, avatarUrl, level, dailyGoalMinutes, isPro };
  });
}
