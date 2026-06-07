"use client";

import { FormEvent, useState } from "react";
import { TerminalButton } from "../terminal/TerminalButton";
import { TerminalDisclosure } from "../terminal/TerminalDisclosure";
import { TerminalInput, TerminalSelect } from "../terminal/TerminalInput";

const KIND_OPTIONS = [
  { value: "category", label: "Kategori baru" },
  { value: "ai_tool", label: "AI Tool baru" },
  { value: "platform", label: "Platform baru" },
  { value: "project_type", label: "Tipe Proyek baru" },
  { value: "pricing_type", label: "Tipe Harga baru" },
] as const;

type Kind = (typeof KIND_OPTIONS)[number]["value"];

export function MetadataRequestForm() {
  const [kind, setKind] = useState<Kind>("category");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const form = new FormData(e.currentTarget);
    const payload = {
      kind: form.get("kind"),
      label: form.get("label"),
      value: form.get("value") || "",
      website: form.get("website") || "",
      icon: form.get("icon") || "",
    };

    try {
      const res = await fetch("/api/metadata-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengajukan");

      setSuccess("Pengajuan terkirim. Admin akan review sebelum tampil di katalog.");
      e.currentTarget.reset();
      setKind("category");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengajukan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <TerminalDisclosure title="Ajukan kategori / metadata baru">
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-muted">
            Tidak menemukan kategori, AI tool, atau metadata yang cocok? Ajukan di sini.
            Setelah admin menyetujui, opsi akan muncul di form submit dan editor proyek.
          </p>

          {error && (
            <div className="border border-red-500 p-3 text-sm text-red-400">{error}</div>
          )}
          {success && (
            <div className="border border-primary p-3 text-sm text-primary">{success}</div>
          )}

          <TerminalSelect
            name="kind"
            label="Jenis pengajuan"
            value={kind}
            onChange={(e) => setKind(e.target.value as Kind)}
            required
          >
            {KIND_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </TerminalSelect>

          <TerminalInput
            name="label"
            label="Nama / label"
            required
            placeholder="Contoh: DevTools, Wearable, dll."
          />

          {kind === "category" && (
            <>
              <TerminalInput
                name="value"
                label="Slug (opsional)"
                hint="Auto dari nama jika kosong"
                placeholder="dev-tools"
              />
              <TerminalInput name="icon" label="Icon (opsional)" placeholder="build" />
            </>
          )}

          {kind === "ai_tool" && (
            <TerminalInput
              name="website"
              label="Website (opsional)"
              type="url"
              placeholder="https://..."
            />
          )}

          {(kind === "platform" ||
            kind === "project_type" ||
            kind === "pricing_type") && (
            <TerminalInput
              name="value"
              label="Value key (opsional)"
              hint="Auto dari nama jika kosong, contoh: wearable"
              placeholder="wearable"
            />
          )}

          <TerminalButton type="submit" variant="ghost" disabled={loading}>
            {loading ? "[SENDING...]" : "[SUBMIT_REQUEST]"}
          </TerminalButton>
        </form>
    </TerminalDisclosure>
  );
}
