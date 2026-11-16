import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "TOEIC" };

export default function Page() {
  return (
    <ComingSoon
      href="/exams/toeic"
      planned={["Đề 7 phần", "Đồng hồ đếm ngược", "Quy đổi điểm TOEIC", "Phân tích lỗi theo phần"]}
    />
  );
}
