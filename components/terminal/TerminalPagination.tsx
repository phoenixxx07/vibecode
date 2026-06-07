import Link from "next/link";
import { buildPagedHref } from "@/lib/pagination";

export function TerminalPagination({
  basePath,
  params,
  page,
  totalPages,
}: {
  basePath: string;
  params: Record<string, string | undefined>;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex flex-wrap justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={buildPagedHref(basePath, params, p)}
          className={`border px-3 py-1 text-sm uppercase ${
            p === page
              ? "border-primary bg-primary text-background-dark"
              : "border-muted text-muted hover:border-primary"
          }`}
        >
          {p}
        </Link>
      ))}
    </div>
  );
}
