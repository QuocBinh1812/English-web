import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Cộng đồng" };

export default function Page() {
  return (
    <ComingSoon
      href="/community"
      planned={["Diễn đàn thảo luận", "Phòng luyện nói", "Ghép cặp theo trình độ"]}
    />
  );
}
