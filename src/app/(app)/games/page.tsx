import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Trò chơi" };

export default function Page() {
  return (
    <ComingSoon
      href="/games"
      planned={["Trò chơi ôn từ vựng", "Thi đấu từ vựng theo lượt", "Điểm thưởng giữ chuỗi ngày"]}
    />
  );
}
