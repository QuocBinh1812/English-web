import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Bảng xếp hạng" };

export default function Page() {
  return (
    <ComingSoon
      href="/leaderboard"
      planned={["Xếp hạng theo tuần", "Xếp hạng theo trình độ", "Huy hiệu thành tích"]}
    />
  );
}
