import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Ôn tập" };

export default function Page() {
  return (
    <ComingSoon
      href="/review"
      planned={["Flashcard hai mặt", "Lịch ôn ngắt quãng SM-2", "Đánh giá độ khó sau mỗi thẻ", "Hàng đợi ôn tập mỗi ngày", "Thống kê ghi nhớ"]}
    />
  );
}
