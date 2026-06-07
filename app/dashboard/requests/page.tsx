import Link from "next/link";
import { TerminalHeader } from "@/components/terminal/TerminalHeader";
import { TerminalButton } from "@/components/terminal/TerminalButton";
import {
  PROJECT_REQUEST_STATUS_LABELS,
  formatBudget,
} from "@/lib/project-request-labels";
import { auth } from "@/lib/auth";
import { getMetadataLabels } from "@/lib/metadata";
import { getUserProjectRequests } from "@/lib/project-requests";
import { getProjectTypeLabel } from "@/lib/products";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardRequestsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [requests, projectTypeLabels] = await Promise.all([
    getUserProjectRequests(session.user.id),
    getMetadataLabels("project_type"),
  ]);

  return (
    <div className="min-h-screen">
      <TerminalHeader showSearch={false} />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold uppercase text-primary">&gt; MY_REQUESTS</h1>
            <p className="mt-1 text-sm text-muted">Request project Anda</p>
          </div>
          <TerminalButton href="/requests/new" variant="primary">
            [AJUKAN BARU]
          </TerminalButton>
        </div>

        {requests.length === 0 ? (
          <div className="mt-10 border border-muted p-12 text-center text-sm text-muted">
            Belum ada request.{" "}
            <Link href="/requests/new" className="text-primary hover:underline">
              Ajukan sekarang
            </Link>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto border border-muted">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-muted bg-page text-xs uppercase text-muted">
                <tr>
                  <th className="px-4 py-3">Judul</th>
                  <th className="px-4 py-3">Jenis</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Budget</th>
                  <th className="px-4 py-3">Developer</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted">
                {requests.map((req) => (
                  <tr key={req.id} className="bg-surface">
                    <td className="px-4 py-3 font-bold uppercase">{req.title}</td>
                    <td className="px-4 py-3 text-xs">
                      {getProjectTypeLabel(req.projectType, projectTypeLabels)}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {req.categories?.map((c) => c.category.name).join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-primary">
                      {PROJECT_REQUEST_STATUS_LABELS[req.status]}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {formatBudget(req.budgetAmount, req.budgetCurrency)}
                    </td>
                    <td className="px-4 py-3 text-xs">{req._count.applications}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/requests/${req.id}`}
                        className="text-xs font-bold uppercase text-primary hover:underline"
                      >
                        [DETAIL / CHAT]
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
