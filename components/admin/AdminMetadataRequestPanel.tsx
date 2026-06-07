"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TerminalButton } from "../terminal/TerminalButton";
import { TerminalDisclosure } from "../terminal/TerminalDisclosure";
import { METADATA_REQUEST_KIND_LABELS } from "@/lib/metadata-request-labels";
import { MetadataRequestKind } from "@prisma/client";

type Request = {
  id: string;
  kind: MetadataRequestKind;
  label: string;
  value: string | null;
  website: string | null;
  icon: string | null;
  createdAt: Date;
  user: { name: string | null; email: string };
};

export function AdminMetadataRequestPanel({ requests }: { requests: Request[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function review(requestId: string, status: "approved" | "rejected") {
    setLoading(requestId);
    setError("");
    try {
      const res = await fetch("/api/admin/metadata-requests/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Review failed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Review failed");
    } finally {
      setLoading(null);
    }
  }

  return (
    <TerminalDisclosure title={`Pengajuan Metadata (${requests.length} pending)`}>
      <p className="text-xs text-muted">
        Developer mengajukan kategori atau metadata baru. Setujui agar tampil di katalog.
      </p>

      {error && (
        <div className="mt-4 border border-red-500 p-3 text-sm text-red-400">{error}</div>
      )}

      {requests.length === 0 ? (
        <div className="mt-4 border border-muted p-6 text-center text-sm text-muted">
          Tidak ada pengajuan metadata pending.
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-muted border border-muted">
          {requests.map((req) => (
            <li key={req.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap gap-2 text-xs uppercase">
                  <span className="border border-accent px-2 py-0.5 text-accent">
                    {METADATA_REQUEST_KIND_LABELS[req.kind]}
                  </span>
                  <span className="border border-primary px-2 py-0.5 text-primary">
                    PENDING
                  </span>
                </div>
                <p className="mt-2 font-bold uppercase">{req.label}</p>
                {req.value && (
                  <p className="text-xs text-muted">value: {req.value}</p>
                )}
                {req.website && (
                  <p className="text-xs text-muted">website: {req.website}</p>
                )}
                {req.icon && <p className="text-xs text-muted">icon: {req.icon}</p>}
                <p className="mt-1 text-xs text-muted">
                  Oleh: {req.user.name ?? req.user.email}
                </p>
              </div>
              <div className="flex gap-2">
                <TerminalButton
                  variant="primary"
                  disabled={loading === req.id}
                  onClick={() => review(req.id, "approved")}
                >
                  [APPROVE]
                </TerminalButton>
                <TerminalButton
                  variant="danger"
                  disabled={loading === req.id}
                  onClick={() => review(req.id, "rejected")}
                >
                  [REJECT]
                </TerminalButton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </TerminalDisclosure>
  );
}
