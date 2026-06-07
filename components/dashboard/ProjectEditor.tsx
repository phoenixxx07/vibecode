"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { TerminalButton } from "../terminal/TerminalButton";
import { useConfirmDialog } from "../terminal/TerminalConfirmDialog";
import { TerminalInput, TerminalSelect } from "../terminal/TerminalInput";
import { ProductWithRelations } from "@/types/product";
import { ScreenshotUploader } from "./ScreenshotUploader";

type Category = { id: string; name: string };
type AiTool = { id: string; name: string };
type MetadataOption = { value: string; label: string };

export function ProjectEditor({
  product,
  categories,
  aiTools,
  platforms,
  projectTypes,
  pricingTypes,
}: {
  product: ProductWithRelations;
  categories: Category[];
  aiTools: AiTool[];
  platforms: MetadataOption[];
  projectTypes: MetadataOption[];
  pricingTypes: MetadataOption[];
}) {
  const router = useRouter();
  const { confirm, dialogNode } = useConfirmDialog();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const selectedPlatforms = platforms
      .filter((p) => form.get(`platform_${p.value}`))
      .map((p) => p.value);
    const categoryIds = categories.filter((c) => form.get(`cat_${c.id}`)).map((c) => c.id);
    const aiToolIds = aiTools.filter((t) => form.get(`tool_${t.id}`)).map((t) => t.id);

    const payload = {
      name: form.get("name"),
      tagline: form.get("tagline"),
      url: form.get("url"),
      githubUrl: form.get("githubUrl") || "",
      projectType: form.get("projectType"),
      highlight1: form.get("highlight1"),
      highlight2: form.get("highlight2"),
      highlight3: form.get("highlight3"),
      categoryIds,
      platforms: selectedPlatforms,
      aiToolIds,
      developerContact: form.get("developerContact"),
      pricingType: form.get("pricingType") || null,
      pricingNote: form.get("pricingNote") || null,
    };

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Update failed");
      }
      router.push("/dashboard/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (
      !(await confirm({
        title: "HAPUS_PROYEK",
        message: "Hapus proyek ini?",
        confirmLabel: "HAPUS",
        variant: "danger",
      }))
    ) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      router.push("/dashboard/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setLoading(false);
    }
  }

  const selectedCategories = new Set(product.categories.map((c) => c.categoryId));
  const selectedTools = new Set(product.aiTools.map((t) => t.aiToolId));

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="border border-red-500 p-3 text-sm text-red-400">{error}</div>}

      <TerminalInput name="name" label="Nama Proyek" defaultValue={product.name} required />
      <TerminalSelect name="projectType" label="Tipe Proyek" defaultValue={product.projectType} required>
        {projectTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </TerminalSelect>
      <TerminalInput name="url" label="URL" type="url" defaultValue={product.url} required />
      <TerminalInput name="githubUrl" label="GitHub URL" type="url" defaultValue={product.githubUrl ?? ""} />
      <TerminalInput name="tagline" label="Tagline" defaultValue={product.tagline} required />
      <TerminalInput name="highlight1" label="Highlight 1" defaultValue={product.highlight1} required />
      <TerminalInput name="highlight2" label="Highlight 2" defaultValue={product.highlight2} required />
      <TerminalInput name="highlight3" label="Highlight 3" defaultValue={product.highlight3} required />
      <TerminalInput
        name="developerContact"
        label="Kontak Developer"
        defaultValue={product.developerContact}
        required
      />

      <fieldset className="border border-muted p-4">
        <legend className="px-2 text-xs uppercase text-muted">Kategori</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name={`cat_${cat.id}`}
                defaultChecked={selectedCategories.has(cat.id)}
              />
              {cat.name}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="border border-muted p-4">
        <legend className="px-2 text-xs uppercase text-muted">AI Tools</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {aiTools.map((tool) => (
            <label key={tool.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name={`tool_${tool.id}`}
                defaultChecked={selectedTools.has(tool.id)}
              />
              {tool.name}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="border border-muted p-4">
        <legend className="px-2 text-xs uppercase text-muted">Platform</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {platforms.map((p) => (
            <label key={p.value} className="flex items-center gap-2 text-sm uppercase">
              <input
                type="checkbox"
                name={`platform_${p.value}`}
                defaultChecked={product.platforms.includes(p.value)}
              />
              {p.label}
            </label>
          ))}
        </div>
      </fieldset>

      <TerminalSelect name="pricingType" label="Tipe Harga (opsional)" defaultValue={product.pricingType ?? ""}>
        <option value="">—</option>
        {pricingTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </TerminalSelect>
      <TerminalInput name="pricingNote" label="Catatan Harga" defaultValue={product.pricingNote ?? ""} />

      <ScreenshotUploader
        productId={product.id}
        productName={product.name}
        screenshotUrl={product.screenshotUrl}
        isApproved={product.status === "approved"}
      />

      <div className="flex gap-4">
        <TerminalButton type="submit" variant="primary" disabled={loading}>
          {loading ? "[SAVING...]" : "[SAVE]"}
        </TerminalButton>
        <TerminalButton type="button" variant="danger" onClick={handleDelete} disabled={loading}>
          [DELETE]
        </TerminalButton>
      </div>
    </form>
    {dialogNode}
    </>
  );
}
