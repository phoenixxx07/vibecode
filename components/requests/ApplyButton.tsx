"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { TerminalButton } from "@/components/terminal/TerminalButton";
import { TerminalTextarea } from "@/components/terminal/TerminalInput";

export function ApplyButton({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch(`/api/project-requests/${requestId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pitchMessage: form.get("pitchMessage") || "" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mendaftar");
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mendaftar");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <TerminalButton type="button" onClick={() => setOpen(true)}>
        [DAFTAR]
      </TerminalButton>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border border-muted p-4">
      <TerminalTextarea
        name="pitchMessage"
        label="Pitch singkat (opsional)"
        placeholder="Kenapa Anda cocok untuk proyek ini..."
        rows={3}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-2">
        <TerminalButton type="submit" disabled={loading}>
          {loading ? "..." : "[KIRIM PENDAFTARAN]"}
        </TerminalButton>
        <TerminalButton type="button" variant="ghost" onClick={() => setOpen(false)}>
          [BATAL]
        </TerminalButton>
      </div>
    </form>
  );
}
