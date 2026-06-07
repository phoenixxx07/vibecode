"use client";

import { useState } from "react";
import { TerminalButton } from "../terminal/TerminalButton";
import { TerminalDisclosure } from "../terminal/TerminalDisclosure";
import { ProjectRequestDetail } from "@/components/requests/ProjectRequestDetail";
import {
  formatBudget,
  getEffectiveBudget,
  PROJECT_REQUEST_STATUS_LABELS,
} from "@/lib/project-request-labels";
import type { SerializedApprovedProjectRequest } from "@/lib/project-requests";
import { getProjectTypeLabel } from "@/lib/products";

export function AdminApprovedProjectRequestPanel({
  requests,
  projectTypeLabels,
}: {
  requests: SerializedApprovedProjectRequest[];
  projectTypeLabels: Record<string, string>;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <TerminalDisclosure title={`Request Disetujui (${requests.length})`}>
      <p className="text-xs text-muted">
        Request yang sudah lolos review admin dan tampil di katalog atau sedang berjalan.
      </p>

      {requests.length === 0 ? (
        <div className="mt-4 border border-muted p-6 text-center text-sm text-muted">
          Belum ada request yang disetujui.
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {requests.map((req) => {
            const categoryNames = req.categories?.map((c) => c.category.name).join(", ");
            const expanded = expandedId === req.id;

            return (
              <div key={req.id} className="border border-muted bg-surface p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2 text-xs uppercase">
                      <span className="border border-primary px-2 py-0.5 text-primary">
                        {PROJECT_REQUEST_STATUS_LABELS[req.status]}
                      </span>
                      <span className="border border-accent px-2 py-0.5 text-accent">
                        {getProjectTypeLabel(req.projectType, projectTypeLabels)}
                      </span>
                      {categoryNames && (
                        <span className="border border-muted px-2 py-0.5 text-muted">
                          {categoryNames}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 truncate font-bold uppercase">{req.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{req.description}</p>
                    <p className="mt-2 text-xs text-muted">
                      Pengaju: {req.requester.name ?? req.requester.email}
                      {req.assignedDeveloper && (
                        <>
                          {" "}
                          · Developer:{" "}
                          {req.assignedDeveloper.name ?? req.assignedDeveloper.email}
                        </>
                      )}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {formatBudget(getEffectiveBudget(req), req.budgetCurrency)}
                      {req.agreedBudgetAmount != null && " (kesepakatan)"} · Deadline:{" "}
                      {new Date(req.deadline).toLocaleDateString("id-ID")} ·{" "}
                      {req._count.applications} pendaftar
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <TerminalButton
                      variant="ghost"
                      onClick={() => setExpandedId(expanded ? null : req.id)}
                    >
                      {expanded ? "[TUTUP]" : "[DETAIL]"}
                    </TerminalButton>
                    <TerminalButton href={`/requests/${req.id}`} variant="primary">
                      [LIHAT]
                    </TerminalButton>
                  </div>
                </div>

                {expanded && (
                  <div className="mt-6 border-t border-muted pt-6">
                    <ProjectRequestDetail request={req} projectTypeLabels={projectTypeLabels} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </TerminalDisclosure>
  );
}
