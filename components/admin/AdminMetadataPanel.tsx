"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { TerminalButton } from "../terminal/TerminalButton";
import { useConfirmDialog } from "../terminal/TerminalConfirmDialog";
import { TerminalDisclosure } from "../terminal/TerminalDisclosure";
import { TerminalInput } from "../terminal/TerminalInput";

type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  _count: { products: number };
};

type AiTool = {
  id: string;
  name: string;
  website: string | null;
  isApproved: boolean;
  _count: { products: number };
};

type MetadataOption = {
  id: string;
  type: "platform" | "project_type" | "pricing_type";
  value: string;
  label: string;
  sortOrder: number;
  isActive: boolean;
};

type Tab = "categories" | "ai_tools" | "platforms" | "project_types" | "pricing_types";

const TABS: { id: Tab; label: string }[] = [
  { id: "categories", label: "Kategori" },
  { id: "ai_tools", label: "AI Tools" },
  { id: "platforms", label: "Platform" },
  { id: "project_types", label: "Tipe Proyek" },
  { id: "pricing_types", label: "Tipe Harga" },
];

export function AdminMetadataPanel({
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
  const router = useRouter();
  const { confirm, dialogNode } = useConfirmDialog();
  const [tab, setTab] = useState<Tab>("categories");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  async function apiCall(url: string, method: string, body?: object) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(url, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Request failed");
      setEditingId(null);
      router.refresh();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function handleCategorySubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    await apiCall("/api/admin/categories", "POST", {
      name: form.get("name"),
      slug: form.get("slug") || undefined,
      icon: form.get("icon") || undefined,
    });
    formEl.reset();
  }

  async function handleCategoryEdit(e: FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await apiCall(`/api/admin/categories/${id}`, "PATCH", {
      name: form.get("name"),
      slug: form.get("slug") || undefined,
      icon: form.get("icon") || null,
    });
  }

  async function handleAiToolSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    await apiCall("/api/admin/ai-tools", "POST", {
      name: form.get("name"),
      website: form.get("website") || undefined,
    });
    formEl.reset();
  }

  async function handleAiToolEdit(e: FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await apiCall(`/api/admin/ai-tools/${id}`, "PATCH", {
      name: form.get("name"),
      website: form.get("website") || null,
    });
  }

  async function handleMetadataSubmit(
    e: FormEvent<HTMLFormElement>,
    type: MetadataOption["type"]
  ) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    await apiCall("/api/admin/metadata", "POST", {
      type,
      label: form.get("label"),
      value: form.get("value") || undefined,
    });
    formEl.reset();
  }

  async function handleMetadataEdit(e: FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await apiCall(`/api/admin/metadata/${id}`, "PATCH", {
      label: form.get("label"),
      value: form.get("value") || undefined,
      sortOrder: form.get("sortOrder") ? Number(form.get("sortOrder")) : undefined,
    });
  }

  function renderMetadataList(options: MetadataOption[]) {
    return (
      <ul className="mt-4 divide-y divide-muted border border-muted">
        {options.map((opt) => (
          <li key={opt.id} className="px-4 py-3 text-sm">
            {editingId === opt.id ? (
              <form
                onSubmit={(e) => handleMetadataEdit(e, opt.id)}
                className="grid gap-3 sm:grid-cols-2"
              >
                <TerminalInput
                  name="label"
                  label="Label"
                  defaultValue={opt.label}
                  required
                />
                <TerminalInput
                  name="value"
                  label="Value"
                  defaultValue={opt.value}
                  required
                />
                <TerminalInput
                  name="sortOrder"
                  label="Urutan"
                  type="number"
                  defaultValue={String(opt.sortOrder)}
                />
                <div className="flex items-end gap-2 sm:col-span-2">
                  <TerminalButton type="submit" variant="primary" disabled={loading}>
                    [SAVE]
                  </TerminalButton>
                  <TerminalButton
                    type="button"
                    variant="ghost"
                    disabled={loading}
                    onClick={() => setEditingId(null)}
                  >
                    [CANCEL]
                  </TerminalButton>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-bold uppercase">{opt.label}</span>
                  <span className="ml-2 text-xs text-muted">({opt.value})</span>
                  <span className="ml-2 text-xs text-muted">· order {opt.sortOrder}</span>
                  {!opt.isActive && (
                    <span className="ml-2 border border-red-500 px-1 text-xs text-red-400">
                      NONAKTIF
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <TerminalButton
                    variant="ghost"
                    disabled={loading}
                    onClick={() => setEditingId(opt.id)}
                  >
                    [EDIT]
                  </TerminalButton>
                  {!opt.isActive && (
                    <TerminalButton
                      variant="ghost"
                      disabled={loading}
                      onClick={() =>
                        apiCall(`/api/admin/metadata/${opt.id}`, "PATCH", {
                          isActive: true,
                        })
                      }
                    >
                      [AKTIFKAN]
                    </TerminalButton>
                  )}
                  <TerminalButton
                    variant="danger"
                    disabled={loading}
                    onClick={async () => {
                      if (
                        !(await confirm({
                          title: "HAPUS_METADATA",
                          message: `Hapus/nonaktifkan "${opt.label}"?`,
                          confirmLabel: "HAPUS",
                          variant: "danger",
                        }))
                      ) {
                        return;
                      }
                      apiCall(`/api/admin/metadata/${opt.id}`, "DELETE");
                    }}
                  >
                    [HAPUS]
                  </TerminalButton>
                </div>
              </div>
            )}
          </li>
        ))}
        {options.length === 0 && (
          <li className="px-4 py-6 text-center text-muted">Belum ada data.</li>
        )}
      </ul>
    );
  }

  return (
    <TerminalDisclosure title="Master Data">
      <p className="text-xs text-muted">
        Kelola kategori, AI tools, platform, tipe proyek, dan tipe harga dari database.
      </p>

      {error && (
        <div className="mt-4 border border-red-500 p-3 text-sm text-red-400">{error}</div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setTab(t.id);
              setEditingId(null);
            }}
            className={`border px-3 py-1.5 text-xs font-bold uppercase ${
              tab === t.id
                ? "border-primary bg-primary/10 text-primary"
                : "border-muted text-muted hover:border-primary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "categories" && (
        <div className="mt-6">
          <form onSubmit={handleCategorySubmit} className="grid gap-4 sm:grid-cols-3">
            <TerminalInput name="name" label="Nama Kategori" required />
            <TerminalInput name="slug" label="Slug (opsional)" hint="auto dari nama" />
            <TerminalInput name="icon" label="Icon (opsional)" placeholder="smart_toy" />
            <TerminalButton type="submit" variant="primary" disabled={loading}>
              [TAMBAH_KATEGORI]
            </TerminalButton>
          </form>
          <ul className="mt-4 divide-y divide-muted border border-muted">
            {categories.map((cat) => (
              <li key={cat.id} className="px-4 py-3 text-sm">
                {editingId === cat.id ? (
                  <form
                    onSubmit={(e) => handleCategoryEdit(e, cat.id)}
                    className="grid gap-3 sm:grid-cols-3"
                  >
                    <TerminalInput name="name" label="Nama" defaultValue={cat.name} required />
                    <TerminalInput name="slug" label="Slug" defaultValue={cat.slug} required />
                    <TerminalInput
                      name="icon"
                      label="Icon"
                      defaultValue={cat.icon ?? ""}
                    />
                    <div className="flex items-end gap-2 sm:col-span-3">
                      <TerminalButton type="submit" variant="primary" disabled={loading}>
                        [SAVE]
                      </TerminalButton>
                      <TerminalButton
                        type="button"
                        variant="ghost"
                        disabled={loading}
                        onClick={() => setEditingId(null)}
                      >
                        [CANCEL]
                      </TerminalButton>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <span className="font-bold uppercase">{cat.name}</span>
                      <span className="ml-2 text-xs text-muted">/{cat.slug}</span>
                      {cat.icon && (
                        <span className="ml-2 text-xs text-muted">· {cat.icon}</span>
                      )}
                      <span className="ml-2 text-xs text-muted">
                        · {cat._count.products} proyek
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <TerminalButton
                        variant="ghost"
                        disabled={loading}
                        onClick={() => setEditingId(cat.id)}
                      >
                        [EDIT]
                      </TerminalButton>
                      <TerminalButton
                        variant="danger"
                        disabled={loading || cat._count.products > 0}
                        onClick={async () => {
                          if (
                            !(await confirm({
                              title: "HAPUS_KATEGORI",
                              message: `Hapus kategori "${cat.name}"?`,
                              confirmLabel: "HAPUS",
                              variant: "danger",
                            }))
                          ) {
                            return;
                          }
                          apiCall(`/api/admin/categories/${cat.id}`, "DELETE");
                        }}
                      >
                        [HAPUS]
                      </TerminalButton>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "ai_tools" && (
        <div className="mt-6">
          <form onSubmit={handleAiToolSubmit} className="grid gap-4 sm:grid-cols-2">
            <TerminalInput name="name" label="Nama AI Tool" required />
            <TerminalInput name="website" label="Website (opsional)" type="url" />
            <TerminalButton type="submit" variant="primary" disabled={loading}>
              [TAMBAH_AI_TOOL]
            </TerminalButton>
          </form>
          <ul className="mt-4 divide-y divide-muted border border-muted">
            {aiTools.map((tool) => (
              <li key={tool.id} className="px-4 py-3 text-sm">
                {editingId === tool.id ? (
                  <form
                    onSubmit={(e) => handleAiToolEdit(e, tool.id)}
                    className="grid gap-3 sm:grid-cols-2"
                  >
                    <TerminalInput name="name" label="Nama" defaultValue={tool.name} required />
                    <TerminalInput
                      name="website"
                      label="Website"
                      type="url"
                      defaultValue={tool.website ?? ""}
                    />
                    <div className="flex items-end gap-2 sm:col-span-2">
                      <TerminalButton type="submit" variant="primary" disabled={loading}>
                        [SAVE]
                      </TerminalButton>
                      <TerminalButton
                        type="button"
                        variant="ghost"
                        disabled={loading}
                        onClick={() => setEditingId(null)}
                      >
                        [CANCEL]
                      </TerminalButton>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <span className="font-bold uppercase">{tool.name}</span>
                      {!tool.isApproved && (
                        <span className="ml-2 text-xs text-red-400">PENDING</span>
                      )}
                      {tool.website && (
                        <span className="ml-2 text-xs text-muted">· {tool.website}</span>
                      )}
                      <span className="ml-2 text-xs text-muted">
                        · {tool._count.products} proyek
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <TerminalButton
                        variant="ghost"
                        disabled={loading}
                        onClick={() => setEditingId(tool.id)}
                      >
                        [EDIT]
                      </TerminalButton>
                      {!tool.isApproved && (
                        <TerminalButton
                          variant="ghost"
                          disabled={loading}
                          onClick={() =>
                            apiCall(`/api/admin/ai-tools/${tool.id}`, "PATCH", {
                              isApproved: true,
                            })
                          }
                        >
                          [APPROVE]
                        </TerminalButton>
                      )}
                      <TerminalButton
                        variant="danger"
                        disabled={loading || tool._count.products > 0}
                        onClick={async () => {
                          if (
                            !(await confirm({
                              title: "HAPUS_AI_TOOL",
                              message: `Hapus AI tool "${tool.name}"?`,
                              confirmLabel: "HAPUS",
                              variant: "danger",
                            }))
                          ) {
                            return;
                          }
                          apiCall(`/api/admin/ai-tools/${tool.id}`, "DELETE");
                        }}
                      >
                        [HAPUS]
                      </TerminalButton>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "platforms" && (
        <div className="mt-6">
          <form
            onSubmit={(e) => handleMetadataSubmit(e, "platform")}
            className="grid gap-4 sm:grid-cols-2"
          >
            <TerminalInput name="label" label="Label Platform" required />
            <TerminalInput
              name="value"
              label="Value (opsional)"
              hint="contoh: web, mobile"
            />
            <TerminalButton type="submit" variant="primary" disabled={loading}>
              [TAMBAH_PLATFORM]
            </TerminalButton>
          </form>
          {renderMetadataList(platforms)}
        </div>
      )}

      {tab === "project_types" && (
        <div className="mt-6">
          <form
            onSubmit={(e) => handleMetadataSubmit(e, "project_type")}
            className="grid gap-4 sm:grid-cols-2"
          >
            <TerminalInput name="label" label="Label Tipe Proyek" required />
            <TerminalInput name="value" label="Value (opsional)" hint="contoh: live" />
            <TerminalButton type="submit" variant="primary" disabled={loading}>
              [TAMBAH_TIPE]
            </TerminalButton>
          </form>
          {renderMetadataList(projectTypes)}
        </div>
      )}

      {tab === "pricing_types" && (
        <div className="mt-6">
          <form
            onSubmit={(e) => handleMetadataSubmit(e, "pricing_type")}
            className="grid gap-4 sm:grid-cols-2"
          >
            <TerminalInput name="label" label="Label Tipe Harga" required />
            <TerminalInput name="value" label="Value (opsional)" hint="contoh: free" />
            <TerminalButton type="submit" variant="primary" disabled={loading}>
              [TAMBAH_HARGA]
            </TerminalButton>
          </form>
          {renderMetadataList(pricingTypes)}
        </div>
      )}
      {dialogNode}
    </TerminalDisclosure>
  );
}
