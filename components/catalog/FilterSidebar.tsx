"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type Category = { id: string; name: string; slug: string };
type AiTool = { id: string; name: string };
type MetadataOption = { value: string; label: string };

export function FilterSidebar({
  categories,
  aiTools,
  projectTypes,
  platforms,
}: {
  categories: Category[];
  aiTools: AiTool[];
  projectTypes: MetadataOption[];
  platforms: MetadataOption[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function getActiveValues(key: string): string[] {
    const raw = searchParams.get(key);
    if (!raw) return [];
    return raw.split(",").map((v) => v.trim()).filter(Boolean);
  }

  function isActive(key: string, value: string) {
    return getActiveValues(key).includes(value);
  }

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`/catalog?${params.toString()}`);
  }

  function toggleParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const current = new Set(getActiveValues(key));

    if (current.has(value)) current.delete(value);
    else current.add(value);

    if (current.size === 0) params.delete(key);
    else params.set(key, [...current].join(","));

    params.delete("page");
    router.push(`/catalog?${params.toString()}`);
  }

  const activeSort = searchParams.get("sort") ?? "newest";

  return (
    <aside className="flex w-full shrink-0 flex-col border border-muted bg-surface lg:w-64">
      <div className="border-b border-muted p-4">
        <h2 className="text-sm font-bold uppercase text-muted">Filters //</h2>
      </div>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4 terminal-scrollbar">
        <section>
          <h3 className="mb-2 text-xs uppercase text-muted">Tipe Proyek</h3>
          <div className="flex max-h-40 flex-col gap-1 overflow-y-auto terminal-scrollbar">
            {projectTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => toggleParam("type", type.value)}
                className={`flex items-center gap-3 px-2 py-1.5 text-left text-sm uppercase ${
                  isActive("type", type.value)
                    ? "border border-primary bg-primary/10 text-primary"
                    : "border border-transparent text-text-main hover:border-muted"
                }`}
              >
                <span className="w-6 font-bold">
                  {isActive("type", type.value) ? "[X]" : "[ ]"}
                </span>
                {type.label.toUpperCase()}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-xs uppercase text-muted">Kategori</h3>
          <div className="flex max-h-40 flex-col gap-1 overflow-y-auto terminal-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => toggleParam("category", cat.slug)}
                className={`flex items-center gap-3 px-2 py-1.5 text-left text-sm uppercase ${
                  isActive("category", cat.slug)
                    ? "border border-primary bg-primary/10 text-primary"
                    : "border border-transparent text-text-main hover:border-muted"
                }`}
              >
                <span className="w-6 font-bold">
                  {isActive("category", cat.slug) ? "[X]" : "[ ]"}
                </span>
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-xs uppercase text-muted">AI Tools</h3>
          <div className="flex max-h-40 flex-col gap-1 overflow-y-auto terminal-scrollbar">
            {aiTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => toggleParam("aiTool", tool.id)}
                className={`flex items-center gap-3 px-2 py-1.5 text-left text-sm uppercase ${
                  isActive("aiTool", tool.id)
                    ? "border border-primary bg-primary/10 text-primary"
                    : "border border-transparent text-text-main hover:border-muted"
                }`}
              >
                <span className="w-6 font-bold">
                  {isActive("aiTool", tool.id) ? "[X]" : "[ ]"}
                </span>
                {tool.name}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-xs uppercase text-muted">Platform</h3>
          <div className="flex max-h-40 flex-col gap-1 overflow-y-auto terminal-scrollbar">
            {platforms.map((p) => (
              <button
                key={p.value}
                onClick={() => toggleParam("platform", p.value)}
                className={`flex items-center gap-3 px-2 py-1.5 text-left text-sm uppercase ${
                  isActive("platform", p.value)
                    ? "border border-primary bg-primary/10 text-primary"
                    : "border border-transparent text-text-main hover:border-muted"
                }`}
              >
                <span className="w-6 font-bold">
                  {isActive("platform", p.value) ? "[X]" : "[ ]"}
                </span>
                {p.label.toUpperCase()}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-xs uppercase text-muted">Sort</h3>
          <select
            value={activeSort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="w-full border border-muted bg-page px-2 py-2 text-sm uppercase"
          >
            <option value="newest">TERBARU</option>
            <option value="popular">TERPOPULER</option>
          </select>
        </section>
      </div>

      <div className="border-t border-muted p-4">
        <Link
          href="/submit"
          className="flex h-10 w-full items-center justify-center border border-primary bg-primary text-sm font-bold uppercase text-background-dark hover:bg-background-dark hover:text-primary"
        >
          &gt; APPEND_DB
        </Link>
      </div>
    </aside>
  );
}
