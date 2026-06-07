import Link from "next/link";
import {
  formatBudget,
  getEffectiveBudget,
  PROJECT_REQUEST_STATUS_LABELS,
} from "@/lib/project-request-labels";
import { getProjectTypeLabel } from "@/lib/products";
import { ProjectRequestStatus } from "@prisma/client";
import { ProjectRequestUnreadBadge } from "./ProjectRequestUnreadBadge";
import { WorkDurationBadge } from "./WorkDurationBadge";

type RequestCard = {
  id: string;
  projectType: string;
  title: string;
  description: string;
  deadline: Date | string;
  budgetAmount: number;
  agreedBudgetAmount?: number | null;
  budgetCurrency: string;
  status: ProjectRequestStatus;
  startedAt?: Date | string | null;
  completedAt?: Date | string | null;
  categories?: { category: { id: string; name: string; slug: string } }[];
  _count?: { applications: number };
  applications?: {
    id: string;
    messages?: { senderId: string; createdAt: Date | string }[];
  }[];
};

export function ProjectRequestCard({
  request,
  projectTypeLabels = {},
  currentUserId,
}: {
  request: RequestCard;
  projectTypeLabels?: Record<string, string>;
  currentUserId?: string;
}) {
  const deadline = new Date(request.deadline).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const primaryCategory = request.categories?.[0]?.category;
  const unreadThreads =
    currentUserId && request.applications
      ? request.applications.map((app) => {
          const lastMsg = app.messages?.[0];
          return {
            applicationId: app.id,
            lastMessage: lastMsg
              ? {
                  createdAt:
                    typeof lastMsg.createdAt === "string"
                      ? lastMsg.createdAt
                      : lastMsg.createdAt.toISOString(),
                  senderId: lastMsg.senderId,
                }
              : null,
          };
        })
      : [];

  return (
    <article className="relative flex flex-col border border-muted bg-surface p-5 transition-colors hover:border-primary">
      {currentUserId && unreadThreads.length > 0 && (
        <div className="absolute right-3 top-3">
          <ProjectRequestUnreadBadge
            requestId={request.id}
            threads={unreadThreads}
            currentUserId={currentUserId}
          />
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <span className="border border-muted px-2 py-0.5 text-xs font-bold uppercase text-muted">
          {getProjectTypeLabel(request.projectType, projectTypeLabels)}
        </span>
        {primaryCategory && (
          <span className="border border-muted px-2 py-0.5 text-xs uppercase text-muted">
            {primaryCategory.name}
          </span>
        )}
        <span className="border border-primary px-2 py-0.5 text-xs font-bold uppercase text-primary">
          {PROJECT_REQUEST_STATUS_LABELS[request.status]}
        </span>
      </div>
      <h3 className="mt-3 text-sm font-bold uppercase text-text-main">{request.title}</h3>
      <p className="mt-2 line-clamp-2 flex-1 text-xs text-muted">{request.description}</p>
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
        <span>Deadline: {deadline}</span>
        <span>{formatBudget(getEffectiveBudget(request), request.budgetCurrency)}</span>
        {request._count && <span>{request._count.applications} developer</span>}
      </div>
      {request.status === "completed" && request.startedAt && request.completedAt && (
        <div className="mt-3">
          <WorkDurationBadge startedAt={request.startedAt} completedAt={request.completedAt} />
        </div>
      )}
      <Link
        href={`/requests/${request.id}`}
        className="mt-4 border border-primary px-3 py-2 text-center text-xs font-bold uppercase text-primary hover:bg-primary hover:text-background-dark"
      >
        [DETAIL]
      </Link>
    </article>
  );
}
