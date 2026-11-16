"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/shared/states";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      title="Trang này gặp sự cố"
      error={new Error("Đã có lỗi không mong muốn. Bạn có thể thử tải lại.")}
      onRetry={reset}
      className="mt-10"
    />
  );
}
