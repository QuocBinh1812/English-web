import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/shared/logo";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <div className="text-center">
        <LogoMark className="mx-auto size-10" />
        <p className="mt-6 text-sm font-medium text-primary">404</p>
        <h1 className="mt-1 text-2xl font-semibold">Không tìm thấy trang</h1>
        <p className="mt-2 text-muted-foreground">Đường dẫn có thể đã thay đổi hoặc không tồn tại.</p>
        <Button asChild className="mt-6">
          <Link href="/dashboard">Về trang tổng quan</Link>
        </Button>
      </div>
    </main>
  );
}
