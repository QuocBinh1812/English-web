import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Nghe chép" };

export default function Page() {
  return (
    <ComingSoon
      href="/dictation"
      planned={["Phát video theo từng câu", "Đồng bộ transcript", "Chấm lỗi từng từ", "Gợi ý chữ cái, nghe lại, chỉnh tốc độ", "Phím tắt luyện nhanh", "Lịch sử điểm theo bài"]}
    />
  );
}
