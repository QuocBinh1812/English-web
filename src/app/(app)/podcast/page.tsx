import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Podcast" };

export default function Page() {
  return (
    <ComingSoon
      href="/podcast"
      planned={["Podcast theo trình độ", "Transcript song song", "Nghe chép từng đoạn"]}
    />
  );
}
