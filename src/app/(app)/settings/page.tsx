import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Cài đặt" };

export default function Page() {
  return (
    <ComingSoon
      href="/settings"
      planned={["Mục tiêu phút mỗi ngày", "Trình độ hiện tại", "Giao diện sáng/tối", "Quản lý tài khoản"]}
    />
  );
}
