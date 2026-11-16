import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "IELTS" };

export default function Page() {
  return (
    <ComingSoon
      href="/exams/ielts"
      planned={["Ngân hàng câu hỏi Listening & Reading", "Đồng hồ đếm ngược", "Chấm điểm tự động theo band", "Giải thích đáp án chi tiết"]}
    />
  );
}
