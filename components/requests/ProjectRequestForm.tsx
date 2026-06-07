"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { TerminalButton } from "@/components/terminal/TerminalButton";
import { TerminalInput, TerminalSelect, TerminalTextarea } from "@/components/terminal/TerminalInput";
import { formatBudgetInput, parseBudgetInput } from "@/lib/project-request-labels";

type Category = { id: string; name: string };
type MetadataOption = { value: string; label: string };

export function ProjectRequestForm({
  categories,
  projectTypes,
}: {
  categories: Category[];
  projectTypes: MetadataOption[];
}) {
  const router = useRouter();
  const [projectType, setProjectType] = useState(projectTypes[0]?.value ?? "");
  const [budgetDisplay, setBudgetDisplay] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const categoryIds = categories
      .filter((c) => form.get(`cat_${c.id}`))
      .map((c) => c.id);

    if (categoryIds.length === 0) {
      setError("Pilih minimal 1 kategori");
      setLoading(false);
      return;
    }

    const budgetAmount = parseBudgetInput(budgetDisplay);
    if (budgetAmount <= 0) {
      setError("Estimasi biaya harus lebih dari 0");
      setLoading(false);
      return;
    }

    const payload = {
      title: form.get("title"),
      description: form.get("description"),
      workflowDescription: form.get("workflowDescription"),
      specifications: form.get("specifications") || "",
      features: form.get("features"),
      deadline: form.get("deadline"),
      budgetAmount,
      budgetCurrency: form.get("budgetCurrency") || "IDR",
      budgetNote: form.get("budgetNote") || "",
      projectType: form.get("projectType"),
      categoryIds,
    };

    try {
      const res = await fetch("/api/project-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengajukan");
      router.push("/dashboard/requests");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengajukan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      <p className="text-xs text-muted">
        Ajukan kebutuhan project atau tool. Jenis dan kategori mengikuti metadata katalog yang sama
        dengan submit proyek.
      </p>

      {error && (
        <div className="border border-red-500 p-3 text-sm text-red-400">{error}</div>
      )}

      {projectTypes.length > 0 && (
        <TerminalSelect
          name="projectType"
          label="Jenis proyek"
          value={projectType}
          onChange={(e) => setProjectType(e.target.value)}
          required
        >
          {projectTypes.map((pt) => (
            <option key={pt.value} value={pt.value}>
              {pt.label}
            </option>
          ))}
        </TerminalSelect>
      )}

      {categories.length > 0 && (
        <fieldset className="space-y-2">
          <legend className="text-xs font-bold uppercase text-muted">Kategori</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name={`cat_${cat.id}`} className="accent-primary" />
                {cat.name}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <TerminalInput name="title" label="Judul" required maxLength={120} />
      <TerminalTextarea name="description" label="Ringkasan" required rows={3} />
      <TerminalTextarea
        name="workflowDescription"
        label="Alur yang diinginkan"
        hint="Jelaskan user flow / step-by-step"
        required
        rows={5}
      />
      <TerminalTextarea
        name="specifications"
        label="Spesifikasi khusus (opsional)"
        placeholder="Mis. React, Next.js, PostgreSQL, deploy Vercel"
        rows={3}
      />
      <TerminalTextarea
        name="features"
        label="Fitur"
        hint="Satu fitur per baris"
        required
        rows={5}
      />
      <TerminalInput name="deadline" label="Deadline" type="date" min={minDate} required />
      <div className="grid gap-4 sm:grid-cols-2">
        <TerminalInput
          label="Estimasi biaya"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="Contoh: 5.000.000"
          value={budgetDisplay}
          onChange={(e) => setBudgetDisplay(formatBudgetInput(e.target.value))}
          required
        />
        <TerminalSelect name="budgetCurrency" label="Mata uang" defaultValue="IDR">
          <option value="IDR">IDR</option>
          <option value="USD">USD</option>
        </TerminalSelect>
      </div>
      <TerminalInput name="budgetNote" label="Catatan budget (opsional)" />

      <TerminalButton type="submit" disabled={loading}>
        {loading ? "MENGIRIM..." : "[AJUKAN REQUEST]"}
      </TerminalButton>
    </form>
  );
}
