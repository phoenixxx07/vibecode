"use client";

import { FormEvent, useState } from "react";
import { TerminalButton } from "../terminal/TerminalButton";
import { TerminalInput } from "../terminal/TerminalInput";
import { TerminalDisclosure } from "../terminal/TerminalDisclosure";

const CONFIRM_TEXT = "HAPUS";

export function DeleteAccountSection({
  email,
  isAdmin,
  projectCount,
}: {
  email: string;
  isAdmin: boolean;
  projectCount: number;
}) {
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (confirm !== CONFIRM_TEXT) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Gagal menghapus akun");

      window.location.href = "/api/auth/signout?callbackUrl=/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus akun");
      setLoading(false);
    }
  }

  if (isAdmin) {
    return (
      <TerminalDisclosure title="Zona Berbahaya">
        <p className="text-xs text-muted">
          Akun admin tidak bisa dihapus dari dashboard developer.
        </p>
      </TerminalDisclosure>
    );
  }

  return (
    <TerminalDisclosure title="Zona Berbahaya">
      <div className="space-y-4">
        <p className="text-xs text-muted">
          Menghapus akun akan menghapus profil Anda
          {projectCount > 0
            ? ` dan ${projectCount} proyek beserta data terkait`
            : ""}{" "}
          secara permanen. Tindakan ini tidak bisa dibatalkan.
        </p>

        {error && (
          <div className="border border-red-500 p-3 text-sm text-red-400">{error}</div>
        )}

        <form onSubmit={handleDelete} className="max-w-md space-y-4">
          <TerminalInput
            name="confirm"
            label={`Ketik ${CONFIRM_TEXT} untuk konfirmasi`}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="off"
            required
          />
          <p className="text-xs text-muted">Akun: {email}</p>
          <TerminalButton
            type="submit"
            variant="danger"
            disabled={loading || confirm !== CONFIRM_TEXT}
          >
            {loading ? "[DELETING...]" : "[DELETE_ACCOUNT]"}
          </TerminalButton>
        </form>
      </div>
    </TerminalDisclosure>
  );
}
