import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Shadowing" };

export default function Page() {
  return (
    <ComingSoon
      href="/shadowing"
      planned={["Phát câu mẫu và ghi âm", "Xin quyền micro an toàn", "Chấm phát âm, độ trôi chảy, ngữ điệu", "Tô màu từng âm phát âm sai", "So sánh bản ghi với giọng mẫu", "Lịch sử luyện tập"]}
    />
  );
}
