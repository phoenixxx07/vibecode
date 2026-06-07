"use client";

import { type ReactNode, useState } from "react";
import { TerminalDisclosure } from "../terminal/TerminalDisclosure";

type Category = { id: string; name: string; slug: string; icon: string | null };
type AiTool = { id: string; name: string; website: string | null };
type MetadataOption = { value: string; label: string };

type Tab = "categories" | "ai_tools" | "platforms" | "project_types" | "pricing_types";

const TABS: { id: Tab; label: string }[] = [
  { id: "categories", label: "Kategori" },
  { id: "ai_tools", label: "AI Tools" },
  { id: "platforms", label: "Platform" },
  { id: "project_types", label: "Tipe Proyek" },
  { id: "pricing_types", label: "Tipe Harga" },
];

function ItemBadge({ children }: { children: ReactNode }) {
  return (
    <span className="border border-muted bg-page px-2 py-1 text-xs uppercase text-primary">
      {children}
    </span>
  );
}

export function MetadataCatalogPanel({
  categories,
  aiTools,
  platforms,
  projectTypes,
  pricingTypes,
}: {
  categories: Category[];
  aiTools: AiTool[];
  platforms: MetadataOption[];
  projectTypes: MetadataOption[];
  pricingTypes: MetadataOption[];
}) {
  const [tab, setTab] = useState<Tab>("categories");

  const counts: Record<Tab, number> = {
    categories: categories.length,
    ai_tools: aiTools.length,
    platforms: platforms.length,
    project_types: projectTypes.length,
    pricing_types: pricingTypes.length,
  };

  const total =
    categories.length +
    aiTools.length +
    platforms.length +
    projectTypes.length +
    pricingTypes.length;

  function renderItems() {
    switch (tab) {
      case "categories":
        return categories.length === 0 ? (
          <p className="text-xs text-muted">Belum ada kategori.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <ItemBadge key={cat.id}>{cat.name}</ItemBadge>
            ))}
          </div>
        );
      case "ai_tools":
        return aiTools.length === 0 ? (
          <p className="text-xs text-muted">Belum ada AI tool.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {aiTools.map((tool) => (
              <ItemBadge key={tool.id}>{tool.name}</ItemBadge>
            ))}
          </div>
        );
      case "platforms":
        return platforms.length === 0 ? (
          <p className="text-xs text-muted">Belum ada platform.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {platforms.map((p) => (
              <ItemBadge key={p.value}>{p.label}</ItemBadge>
            ))}
          </div>
        );
      case "project_types":
        return projectTypes.length === 0 ? (
          <p className="text-xs text-muted">Belum ada tipe proyek.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {projectTypes.map((t) => (
              <ItemBadge key={t.value}>{t.label}</ItemBadge>
            ))}
          </div>
        );
      case "pricing_types":
        return pricingTypes.length === 0 ? (
          <p className="text-xs text-muted">Belum ada tipe harga.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {pricingTypes.map((t) => (
              <ItemBadge key={t.value}>{t.label}</ItemBadge>
            ))}
          </div>
        );
    }
  }

  return (
    <TerminalDisclosure title={`Metadata tersedia saat ini (${total})`}>
      <div className="space-y-4">
          <p className="text-xs text-muted">
            Daftar kategori, AI tool, dan metadata yang bisa dipilih saat submit atau edit proyek.
          </p>

          <div className="flex flex-wrap gap-2 border-b border-muted pb-4">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`border px-3 py-1 text-xs uppercase transition-colors ${
                  tab === t.id
                    ? "border-primary text-primary"
                    : "border-muted text-muted hover:border-primary hover:text-primary"
                }`}
              >
                {t.label} ({counts[t.id]})
              </button>
            ))}
          </div>

          {renderItems()}
      </div>
    </TerminalDisclosure>
  );
}
