import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { LessonGridSkeleton } from "@/features/lessons/components/lesson-grid";
import { LessonLibrary } from "@/features/lessons/components/lesson-library";

export const metadata: Metadata = { title: "Thư viện bài học" };

export default function TopicsPage() {
  return (
    <>
      <PageHeader
        title="Thư viện bài học"
        description="Chọn bài theo trình độ, chủ đề và cách học. Mỗi bài luyện được bằng nghe chép, shadowing hoặc cả hai."
      />
      {/* Filters are read from the URL on the client; stream them in behind a boundary. */}
      <Suspense fallback={<LessonGridSkeleton className="mt-40" />}>
        <LessonLibrary />
      </Suspense>
    </>
  );
}
