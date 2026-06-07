"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TerminalButton } from "../terminal/TerminalButton";
import { TerminalDisclosure } from "../terminal/TerminalDisclosure";
import { ProjectRequestDetail } from "@/components/requests/ProjectRequestDetail";
import type { SerializedPendingProjectRequest } from "@/lib/project-requests";

export function AdminProjectRequestPanel({
  requests,
  projectTypeLabels,
}: {
  requests: SerializedPendingProjectRequest[];
  projectTypeLabels: Record<string, string>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function review(requestId: string, status: "published" | "rejected") {
    setLoading(requestId);
    setError("");
    try {
      const res = await fetch("/api/admin/project-requests/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          status,
          rejectionReason: status === "rejected" ? "Tidak memenuhi guidelines" : undefined,
        }),
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
    <TerminalDisclosure title={`Pengajuan Request Project (${requests.length} pending)`}>
      <p className="text-xs text-muted">
        Review request sebelum tampil di katalog publik.
      </p>

      {error && (
        <div className="mt-4 border border-red-500 p-3 text-sm text-red-400">{error}</div>
      )}

      {requests.length === 0 ? (
        <div className="mt-4 border border-muted p-6 text-center text-sm text-muted">
          Tidak ada pengajuan request pending.
        </div>
      ) : (
        <div className="mt-4 space-y-6">
          {requests.map((req) => (
            <article key={req.id} className="border border-muted bg-surface p-6">
              <ProjectRequestDetail request={req} projectTypeLabels={projectTypeLabels} />

              <div className="mt-6 border-t border-muted pt-4">
                <p className="text-xs text-muted">
                  Pengaju:{" "}
                  <span className="text-text-main">
                    {req.requester.name ?? req.requester.email}
                  </span>
                  {req.requester.name && (
                    <span className="text-muted"> ({req.requester.email})</span>
                  )}
                </p>
                <p className="mt-1 text-xs text-muted">
                  Diajukan:{" "}
                  {new Date(req.createdAt).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <TerminalButton
                  variant="primary"
                  disabled={loading === req.id}
                  onClick={() => review(req.id, "published")}
                >
                  [SETUJUI]
                </TerminalButton>
                <TerminalButton
                  variant="danger"
                  disabled={loading === req.id}
                  onClick={() => review(req.id, "rejected")}
                >
                  [TOLAK]
                </TerminalButton>
              </div>
            </article>
          ))}
        </div>
      )}
    </TerminalDisclosure>
  );
}
