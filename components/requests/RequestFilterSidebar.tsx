"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PROJECT_REQUEST_STATUS_LABELS } from "@/lib/project-request-labels";

const STATUS_OPTIONS = [
  { value: "published", label: PROJECT_REQUEST_STATUS_LABELS.published },
  { value: "in_progress", label: PROJECT_REQUEST_STATUS_LABELS.in_progress },
  { value: "completed", label: PROJECT_REQUEST_STATUS_LABELS.completed },
] as const;

type Category = { id: string; name: string; slug: string };
type MetadataOption = { value: string; label: string };

export function RequestFilterSidebar({
  categories,
  projectTypes,
}: {
  categories: Category[];
  projectTypes: MetadataOption[];
}) {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "published";
  const type = searchParams.get("type") ?? "";
  const category = searchParams.get("category") ?? "";

  function buildHref(overrides: { status?: string; type?: string; category?: string }) {
    const params = new URLSearchParams();
    params.set("status", overrides.status ?? status);
    const nextType = overrides.type !== undefined ? overrides.type : type;
    const nextCategory = overrides.category !== undefined ? overrides.category : category;
    if (nextType) params.set("type", nextType);
    if (nextCategory) params.set("category", nextCategory);
    return `/catalog/requests?${params.toString()}`;
  }

  return (
    <aside className="w-full shrink-0 border border-muted bg-surface p-4 lg:w-64">
      <h2 className="text-xs font-bold uppercase text-primary">&gt; FILTER</h2>

      <div className="mt-6">
        <p className="text-xs font-bold uppercase text-muted">Status</p>
        <ul className="mt-2 space-y-1">
          {STATUS_OPTIONS.map((opt) => (
            <li key={opt.value}>
              <Link
                href={buildHref({ status: opt.value })}
                className={`block px-2 py-1.5 text-xs uppercase ${
                  status === opt.value
                    ? "border-l-2 border-primary bg-page text-primary"
                    : "text-muted hover:text-primary"
                }`}
              >
                {opt.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {projectTypes.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-bold uppercase text-muted">Jenis proyek</p>
          <ul className="mt-2 space-y-1">
            <li>
              <Link
                href={buildHref({ type: "" })}
                className={`block px-2 py-1.5 text-xs uppercase ${
                  !type
                    ? "border-l-2 border-primary bg-page text-primary"
                    : "text-muted hover:text-primary"
                }`}
              >
                Semua
              </Link>
            </li>
            {projectTypes.map((opt) => (
              <li key={opt.value}>
                <Link
                  href={buildHref({ type: opt.value })}
                  className={`block px-2 py-1.5 text-xs uppercase ${
                    type === opt.value
                      ? "border-l-2 border-primary bg-page text-primary"
                      : "text-muted hover:text-primary"
                  }`}
                >
                  {opt.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {categories.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-bold uppercase text-muted">Kategori</p>
          <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto">
            <li>
              <Link
                href={buildHref({ category: "" })}
                className={`block px-2 py-1.5 text-xs uppercase ${
                  !category
                    ? "border-l-2 border-primary bg-page text-primary"
                    : "text-muted hover:text-primary"
                }`}
              >
                Semua
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={buildHref({ category: cat.slug })}
                  className={`block px-2 py-1.5 text-xs uppercase ${
                    category === cat.slug
                      ? "border-l-2 border-primary bg-page text-primary"
                      : "text-muted hover:text-primary"
                  }`}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 border-t border-muted pt-4">
        <Link
          href="/requests/new"
          className="block border border-primary px-3 py-2 text-center text-xs font-bold uppercase text-primary hover:bg-primary hover:text-background-dark"
        >
          [AJUKAN REQUEST]
        </Link>
      </div>
    </aside>
  );
}
