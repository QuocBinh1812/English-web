import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Truyện" };

export default function Page() {
  return (
    <ComingSoon
      href="/stories"
      planned={["Truyện có giọng đọc", "Highlight theo câu", "Tra từ khi chạm"]}
    />
  );
}
