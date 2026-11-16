import { getRepositories } from "@/lib/data";
import { handle } from "@/lib/api/route-handler";

export async function GET() {
  return handle(() => getRepositories().lessons.facets());
}
