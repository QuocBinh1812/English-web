import Link from "next/link";
import { ArrowRight, Hourglass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { findNavItem } from "@/config/nav";
import { PageHeader } from "./page-header";

/** Placeholder for modules that are routed but not built yet. */
export function ComingSoon({ href, planned }: { href: string; planned: string[] }) {
  const item = findNavItem(href);
  const Icon = item?.icon ?? Hourglass;

  return (
    <>
      <PageHeader title={item?.title ?? "Sắp ra mắt"} description={item?.description} />
      <section className="relative overflow-hidden rounded-2xl border bg-card p-6 md:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-16 size-64 rounded-full bg-accent/70 blur-3xl"
        />
        <div className="relative flex flex-col gap-8 md:flex-row md:items-start">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground">
            <Icon className="size-7" />
          </span>
          <div className="max-w-xl">
            <p className="text-sm font-medium text-primary">Đang xây dựng</p>
            <h2 className="mt-1 text-xl font-semibold">Module này sẽ có trong các bản tiếp theo</h2>
            <p className="mt-2 text-muted-foreground">Những gì đã được lên kế hoạch:</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {planned.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  {p}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8" size="lg">
              <Link href="/topics">
                Khám phá thư viện bài học <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
