import { notFound } from "next/navigation";
import { TerminalHeader } from "@/components/terminal/TerminalHeader";
import { ProjectRequestDetail } from "@/components/requests/ProjectRequestDetail";
import { RequestDetailPanel } from "@/components/requests/RequestDetailPanel";
import { auth } from "@/lib/auth";
import { getMetadataLabels } from "@/lib/metadata";
import { canViewRequest, getProjectRequestById } from "@/lib/project-requests";

export const dynamic = "force-dynamic";

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const [request, projectTypeLabels] = await Promise.all([
    getProjectRequestById(id),
    getMetadataLabels("project_type"),
  ]);

  if (!request) notFound();

  const isAdmin = session?.user?.role === "admin";
  if (!canViewRequest(request, session?.user?.id, isAdmin)) {
    notFound();
  }

  const isOwner = session?.user?.id === request.requesterId;
  const isAssignedDev = session?.user?.id === request.assignedDeveloperId;
  const isApplicant = request.applications.some(
    (a) => a.developerId === session?.user?.id
  );

  const panelRequest =
    isOwner || isAdmin || isAssignedDev || isApplicant
      ? request
      : { ...request, applications: [] };

  return (
    <div className="min-h-screen">
      <TerminalHeader />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <ProjectRequestDetail request={request} projectTypeLabels={projectTypeLabels} />
          <RequestDetailPanel
            request={panelRequest}
            currentUserId={session?.user?.id}
            isLoggedIn={!!session?.user}
          />
        </div>
      </main>
    </div>
  );
}
