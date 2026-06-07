import { DeleteAccountSection } from "@/components/dashboard/DeleteAccountSection";
import { MetadataCatalogPanel } from "@/components/dashboard/MetadataCatalogPanel";
import { ApplicationRequestCard } from "@/components/requests/ApplicationRequestCard";
import { ChatUnreadSync } from "@/components/requests/ChatUnreadSync";
import { ProjectRequestCard } from "@/components/requests/ProjectRequestCard";
import { MetadataRequestForm } from "@/components/submit/MetadataRequestForm";
import { TerminalHeader } from "@/components/terminal/TerminalHeader";
import { TerminalButton } from "@/components/terminal/TerminalButton";
import { auth } from "@/lib/auth";
import { getFormMetadata, getMetadataLabels } from "@/lib/metadata";
import { getUserApplications, getUserProjectRequests } from "@/lib/project-requests";
import { prisma } from "@/lib/prisma";
import {
  ProjectRequestApplicationStatus,
  ProjectRequestStatus,
} from "@prisma/client";
import { redirect } from "next/navigation";

const ACTIVE_REQUEST_STATUSES: ProjectRequestStatus[] = [
  ProjectRequestStatus.published,
  ProjectRequestStatus.in_progress,
];

const ACTIVE_APPLICATION_REQUEST_STATUSES: ProjectRequestStatus[] = [
  ProjectRequestStatus.published,
  ProjectRequestStatus.in_progress,
];

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [products, metadata, requests, applications, projectTypeLabels] = await Promise.all([
    prisma.product.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        tagline: true,
        status: true,
        viewCount: true,
        clickCount: true,
        upvoteCount: true,
      },
    }),
    getFormMetadata(),
    getUserProjectRequests(session.user.id),
    getUserApplications(session.user.id),
    getMetadataLabels("project_type"),
  ]);

  const activeRequests = requests.filter((req) =>
    ACTIVE_REQUEST_STATUSES.includes(req.status)
  );

  const activeApplications = applications.filter(
    (app) =>
      app.status !== ProjectRequestApplicationStatus.withdrawn &&
      ACTIVE_APPLICATION_REQUEST_STATUSES.includes(app.projectRequest.status)
  );

  const unreadSyncRequestIds = [
    ...activeRequests.map((req) => req.id),
    ...activeApplications.map((app) => app.projectRequest.id),
  ];

  const { categories, aiTools, platforms, projectTypes, pricingTypes } = metadata;

  const totalViews = products.reduce((sum, p) => sum + p.viewCount, 0);
  const totalClicks = products.reduce((sum, p) => sum + p.clickCount, 0);
  const approved = products.filter((p) => p.status === "approved").length;

  return (
    <div className="min-h-screen">
      <ChatUnreadSync requestIds={unreadSyncRequestIds} currentUserId={session.user.id} />
      <TerminalHeader showSearch={false} />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-xl font-bold uppercase text-primary">&gt; CREATOR_DASHBOARD</h1>
        <p className="mt-1 text-sm text-muted">Welcome, {session.user.name ?? session.user.email}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[
            { label: "Deployed Nodes", value: products.length },
            { label: "Online", value: approved },
            { label: "Request Aktif", value: activeRequests.length },
            { label: "Lamaran Aktif", value: activeApplications.length },
            { label: "Total Views", value: totalViews },
            { label: "Total Clicks", value: totalClicks },
          ].map((stat) => (
            <div key={stat.label} className="border border-muted bg-surface p-6">
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-xs uppercase text-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <TerminalButton href="/dashboard/projects" variant="primary">
            [MY_PROJECTS]
          </TerminalButton>
          <TerminalButton href="/submit" variant="ghost">
            [NEW_SUBMIT]
          </TerminalButton>
          <TerminalButton href="/requests/new" variant="ghost">
            [AJUKAN_REQUEST]
          </TerminalButton>
          <TerminalButton href="/dashboard/requests" variant="ghost">
            [MY_REQUESTS]
          </TerminalButton>
          <TerminalButton href="/dashboard/applications" variant="ghost">
            [MY_APPLICATIONS]
          </TerminalButton>
        </div>

        <section className="mt-12">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-sm font-bold uppercase text-primary">
              &gt; PROJECT_AKTIF / DIDAFTARKAN
            </h2>
            <TerminalButton href="/dashboard/projects" variant="ghost">
              [SEMUA_PROJECT]
            </TerminalButton>
          </div>
          {products.length === 0 ? (
            <div className="border border-muted bg-surface p-8 text-center text-sm text-muted">
              Belum ada project didaftarkan.{" "}
              <TerminalButton href="/submit" variant="ghost" className="mt-4">
                [SUBMIT_PROJECT]
              </TerminalButton>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col border border-muted bg-surface"
                >
                  <div className="flex items-center justify-between border-b border-muted p-3">
                    <span className="truncate text-sm font-bold uppercase text-primary">
                      {product.name}
                    </span>
                    <span
                      className={`border px-2 py-0.5 text-xs ${
                        product.status === "approved"
                          ? "border-primary text-primary"
                          : product.status === "rejected"
                            ? "border-red-500 text-red-400"
                            : "border-accent text-accent"
                      }`}
                    >
                      {product.status === "approved"
                        ? "ONLINE"
                        : product.status === "rejected"
                          ? "REJECTED"
                          : "PENDING"}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-4">
                    <p className="line-clamp-2 text-xs text-muted">{product.tagline}</p>
                    <div className="mt-auto grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs uppercase text-muted">Views</p>
                        <p className="text-lg font-bold text-primary">{product.viewCount}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-muted">Clicks</p>
                        <p className="text-lg font-bold text-primary">{product.clickCount}</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-muted p-3">
                    <TerminalButton
                      href={`/dashboard/projects/${product.id}/edit`}
                      variant="ghost"
                    >
                      [EDIT]
                    </TerminalButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-12">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-sm font-bold uppercase text-primary">
              &gt; LAMARAN_REQUEST_AKTIF
            </h2>
            <TerminalButton href="/dashboard/applications" variant="ghost">
              [SEMUA_LAMARAN]
            </TerminalButton>
          </div>
          {activeApplications.length === 0 ? (
            <div className="border border-muted bg-surface p-8 text-center text-sm text-muted">
              Belum ada lamaran aktif.{" "}
              <TerminalButton href="/catalog/requests" variant="ghost" className="mt-4">
                [LIHAT_KATALOG_REQUEST]
              </TerminalButton>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeApplications.map((app) => {
                const thread = app.projectRequest.applications.find((a) => a.id === app.id);
                const lastMsg = thread?.messages[0];

                return (
                  <ApplicationRequestCard
                    key={app.id}
                    applicationId={app.id}
                    currentUserId={session.user.id}
                    title={app.projectRequest.title}
                    description={app.projectRequest.description}
                    projectType={app.projectRequest.projectType}
                    deadline={app.projectRequest.deadline}
                    budgetAmount={Number(app.projectRequest.budgetAmount)}
                    agreedBudgetAmount={
                      app.projectRequest.agreedBudgetAmount != null
                        ? Number(app.projectRequest.agreedBudgetAmount)
                        : null
                    }
                    budgetCurrency={app.projectRequest.budgetCurrency}
                    requestStatus={app.projectRequest.status}
                    applicationStatus={app.status}
                    requestId={app.projectRequest.id}
                    categories={app.projectRequest.categories}
                    projectTypeLabels={projectTypeLabels}
                    contact={app.projectRequest.requester}
                    pitchMessage={app.pitchMessage}
                    messageCount={thread?._count.messages ?? 0}
                    lastMessage={
                      lastMsg
                        ? {
                            body: lastMsg.body,
                            createdAt: lastMsg.createdAt.toISOString(),
                            senderId: lastMsg.senderId,
                          }
                        : null
                    }
                  />
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-12">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-sm font-bold uppercase text-primary">&gt; PROJECT_REQUEST</h2>
            <div className="flex flex-wrap gap-2">
              <TerminalButton href="/requests/new" variant="ghost">
                [AJUKAN_BARU]
              </TerminalButton>
              <TerminalButton href="/dashboard/requests" variant="ghost">
                [SEMUA_REQUEST]
              </TerminalButton>
            </div>
          </div>
          {activeRequests.length === 0 ? (
            <div className="border border-muted bg-surface p-8 text-center text-sm text-muted">
              Belum ada request aktif atau disetujui.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeRequests.map((request) => (
                <ProjectRequestCard
                  key={request.id}
                  request={request}
                  projectTypeLabels={projectTypeLabels}
                  currentUserId={session.user.id}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-12 max-w-4xl space-y-4">
          <MetadataCatalogPanel
            categories={categories}
            aiTools={aiTools}
            platforms={platforms}
            projectTypes={projectTypes}
            pricingTypes={pricingTypes}
          />
          <MetadataRequestForm />
        </section>

        <section className="mt-12 max-w-4xl">
          <DeleteAccountSection
            email={session.user.email ?? ""}
            isAdmin={session.user.role === "admin"}
            projectCount={products.length}
          />
        </section>
      </main>
    </div>
  );
}
