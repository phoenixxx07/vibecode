"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { TerminalButton } from "../terminal/TerminalButton";
import { TerminalInput, TerminalSelect } from "../terminal/TerminalInput";

type Category = { id: string; name: string };
type AiTool = { id: string; name: string };
type MetadataOption = { value: string; label: string };

export function SubmitForm({
  categories,
  aiTools,
  platforms,
  projectTypes,
  pricingTypes,
  defaultContact = "",
}: {
  categories: Category[];
  aiTools: AiTool[];
  platforms: MetadataOption[];
  projectTypes: MetadataOption[];
  pricingTypes: MetadataOption[];
  defaultContact?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [projectType, setProjectType] = useState(projectTypes[0]?.value ?? "live");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const selectedPlatforms = platforms
      .filter((p) => form.get(`platform_${p.value}`))
      .map((p) => p.value);
    const categoryIds = categories
      .filter((c) => form.get(`cat_${c.id}`))
      .map((c) => c.id);
    const aiToolIds = aiTools
      .filter((t) => form.get(`tool_${t.id}`))
      .map((t) => t.id);

    if (categoryIds.length === 0) {
      setError("Pilih minimal 1 kategori");
      setLoading(false);
      return;
    }
    if (selectedPlatforms.length === 0) {
      setError("Pilih minimal 1 platform");
      setLoading(false);
      return;
    }
    if (aiToolIds.length === 0) {
      setError("Pilih minimal 1 AI tool");
      setLoading(false);
      return;
    }

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
      techStack: String(form.get("techStack") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      pricingType: form.get("pricingType") || null,
      priceAmount: form.get("priceAmount") ? Number(form.get("priceAmount")) : null,
      priceCurrency: form.get("priceCurrency") || "IDR",
      pricingNote: form.get("pricingNote") || null,
      developerContact: form.get("developerContact"),
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submit failed");

      setSuccess(true);
      setTimeout(() => router.push("/dashboard/projects"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="border border-primary bg-primary/10 p-8 text-center">
        <p className="text-lg font-bold uppercase text-primary">&gt; WRITE_TO_DISK: OK</p>
        <p className="mt-2 text-sm text-muted">
          Proyek masuk antrian review admin. Redirecting...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="border border-red-500 p-3 text-sm text-red-400">{error}</div>
      )}

      <TerminalInput name="name" label="Nama Proyek" required />
      <TerminalSelect
        name="projectType"
        label="Tipe Proyek"
        value={projectType}
        onChange={(e) => setProjectType(e.target.value)}
        required
      >
        {projectTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </TerminalSelect>

      <TerminalInput
        name="url"
        label={projectType === "repository" ? "URL GitHub" : "URL Website/Demo"}
        type="url"
        required
        hint={projectType === "repository" ? "https://github.com/user/repo" : "https://..."}
      />

      {projectType !== "repository" && (
        <TerminalInput
          name="githubUrl"
          label="URL GitHub (opsional)"
          type="url"
        />
      )}

      <TerminalInput name="tagline" label="Tagline" maxLength={80} required />
      <TerminalInput name="highlight1" label="Highlight 1" required />
      <TerminalInput name="highlight2" label="Highlight 2" required />
      <TerminalInput name="highlight3" label="Highlight 3" required />

      <fieldset className="border border-muted p-4">
        <legend className="px-2 text-xs font-bold uppercase text-muted">
          Kategori <span className="text-primary">*</span>
        </legend>
        {categories.length === 0 ? (
          <p className="mt-2 text-sm text-red-400">
            Belum ada kategori di database. Jalankan `npm run db:seed`.
          </p>
        ) : (
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name={`cat_${cat.id}`} value="1" />
                {cat.name}
              </label>
            ))}
          </div>
        )}
      </fieldset>

      <fieldset className="border border-muted p-4">
        <legend className="px-2 text-xs font-bold uppercase text-muted">
          Platform <span className="text-primary">*</span>
        </legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {platforms.map((p) => (
            <label key={p.value} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name={`platform_${p.value}`} value="1" />
              {p.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="border border-muted p-4">
        <legend className="px-2 text-xs font-bold uppercase text-muted">
          AI Tools <span className="text-primary">*</span>
        </legend>
        {aiTools.length === 0 ? (
          <p className="mt-2 text-sm text-red-400">
            Belum ada AI tool di database. Jalankan `npm run db:seed`.
          </p>
        ) : (
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {aiTools.map((tool) => (
              <label key={tool.id} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name={`tool_${tool.id}`} value="1" />
                {tool.name}
              </label>
            ))}
          </div>
        )}
      </fieldset>

      <TerminalInput
        name="techStack"
        label="Tech Stack (opsional, pisahkan koma)"
        placeholder="Next.js, Prisma, Tailwind"
      />

      <fieldset className="border border-muted p-4">
        <legend className="px-2 text-xs font-bold uppercase text-muted">
          Info Harga (opsional)
        </legend>
        <div className="mt-4 space-y-4">
          <TerminalSelect name="pricingType" label="Tipe Harga">
            <option value="">— Tidak diisi —</option>
            {pricingTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </TerminalSelect>
          <div className="grid gap-4 sm:grid-cols-2">
            <TerminalInput name="priceAmount" label="Nominal (opsional)" type="number" min="0" />
            <TerminalInput name="priceCurrency" label="Mata Uang" defaultValue="IDR" />
          </div>
          <TerminalInput
            name="pricingNote"
            label="Catatan Harga (opsional)"
            placeholder="Mulai Rp 50rb/bulan"
          />
        </div>
      </fieldset>

      <TerminalInput
        name="developerContact"
        label="Kontak Developer (wajib)"
        required
        defaultValue={defaultContact}
        hint="Email, WA, Twitter, atau LinkedIn untuk inquiry & pemesanan"
      />

      <TerminalButton type="submit" variant="primary" disabled={loading} className="w-full">
        {loading ? "[WRITING...]" : "[WRITE_TO_DISK]"}
      </TerminalButton>
    </form>
  );
}
