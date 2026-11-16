import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Từ vựng" };

export default function Page() {
  return (
    <ComingSoon
      href="/vocabulary"
      planned={["Từ vựng theo chủ đề", "Phiên âm IPA và phát âm", "Câu ví dụ trong ngữ cảnh bài học", "Nghĩa tiếng Việt", "Lưu từ vào sổ tay"]}
    />
  );
}
