import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Hồ sơ" };

export default function Page() {
  return (
    <ComingSoon
      href="/profile"
      planned={["Thống kê học tập", "Lịch sử học", "Thành tích & huy hiệu"]}
    />
  );
}
