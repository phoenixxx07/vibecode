import Link from "next/link";
import { TerminalHeader } from "@/components/terminal/TerminalHeader";
import {
  APPLICATION_STATUS_LABELS,
  PROJECT_REQUEST_STATUS_LABELS,
} from "@/lib/project-request-labels";
import { auth } from "@/lib/auth";
import { getMetadataLabels } from "@/lib/metadata";
import { getUserApplications } from "@/lib/project-requests";
import { getProjectTypeLabel } from "@/lib/products";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardApplicationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [applications, projectTypeLabels] = await Promise.all([
    getUserApplications(session.user.id),
    getMetadataLabels("project_type"),
  ]);

  return (
    <div className="min-h-screen">
      <TerminalHeader showSearch={false} />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-xl font-bold uppercase text-primary">&gt; MY_APPLICATIONS</h1>
        <p className="mt-1 text-sm text-muted">Request yang Anda daftar sebagai developer</p>

        {applications.length === 0 ? (
          <div className="mt-10 border border-muted p-12 text-center text-sm text-muted">
            Belum mendaftar pada request manapun.{" "}
            <Link href="/catalog/requests" className="text-primary hover:underline">
              Lihat katalog request
            </Link>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto border border-muted">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-muted bg-page text-xs uppercase text-muted">
                <tr>
                  <th className="px-4 py-3">Request</th>
                  <th className="px-4 py-3">Jenis</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Status Request</th>
                  <th className="px-4 py-3">Status Daftar</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted">
                {applications.map((app) => (
                  <tr key={app.id} className="bg-surface">
                    <td className="px-4 py-3 font-bold uppercase">
                      {app.projectRequest.title}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {getProjectTypeLabel(app.projectRequest.projectType, projectTypeLabels)}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {app.projectRequest.categories
                        ?.map((c) => c.category.name)
                        .join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-primary">
                      {PROJECT_REQUEST_STATUS_LABELS[app.projectRequest.status]}
                    </td>
                    <td className="px-4 py-3 text-xs uppercase">
                      {APPLICATION_STATUS_LABELS[app.status]}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/requests/${app.projectRequest.id}`}
                        className="text-xs font-bold uppercase text-primary hover:underline"
                      >
                        [CHAT]
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
