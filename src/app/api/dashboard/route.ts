import { getRepositories } from "@/lib/data";
import { handle, requireUserId } from "@/lib/api/route-handler";

export async function GET() {
  return handle(async () => {
    const userId = await requireUserId();
    return getRepositories().progress.getDashboard(userId, new Date());
  });
}
