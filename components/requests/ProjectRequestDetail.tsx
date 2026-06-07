import {
  formatBudget,
  getEffectiveBudget,
  parseFeatures,
  PROJECT_REQUEST_STATUS_LABELS,
} from "@/lib/project-request-labels";
import { getProjectTypeLabel } from "@/lib/products";
import { ProjectRequestStatus } from "@prisma/client";
import { WorkDurationBadge } from "./WorkDurationBadge";
import { DeveloperPortfolioLink } from "@/components/developers/DeveloperPortfolioLink";

type RequestDetail = {
  id: string;
  projectType: string;
  title: string;
  description: string;
  workflowDescription: string;
  specifications: string | null;
  features: string;
  deadline: Date | string;
  budgetAmount: number;
  agreedBudgetAmount?: number | null;
  budgetCurrency: string;
  budgetNote: string | null;
  status: ProjectRequestStatus;
  startedAt?: Date | string | null;
  completedAt?: Date | string | null;
  cancelledAt?: Date | string | null;
  rejectionReason?: string | null;
  categories?: { category: { id: string; name: string; slug: string } }[];
  assignedDeveloper?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
};

export function ProjectRequestDetail({
  request,
  projectTypeLabels = {},
}: {
  request: RequestDetail;
  projectTypeLabels?: Record<string, string>;
}) {
  const features = parseFeatures(request.features);
  const deadline = new Date(request.deadline).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <span className="border border-muted px-2 py-0.5 text-xs font-bold uppercase">
          {getProjectTypeLabel(request.projectType, projectTypeLabels)}
        </span>
        {request.categories?.map(({ category }) => (
          <span
            key={category.id}
            className="border border-muted px-2 py-0.5 text-xs uppercase text-muted"
          >
            {category.name}
          </span>
        ))}
        <span className="border border-primary px-2 py-0.5 text-xs font-bold uppercase text-primary">
          {PROJECT_REQUEST_STATUS_LABELS[request.status]}
        </span>
      </div>

      <h1 className="text-xl font-bold uppercase text-primary">&gt; {request.title}</h1>

      <section>
        <h2 className="text-xs font-bold uppercase text-muted">Ringkasan</h2>
        <p className="mt-2 text-sm text-text-main whitespace-pre-wrap">{request.description}</p>
      </section>

      <section>
        <h2 className="text-xs font-bold uppercase text-muted">Alur yang diinginkan</h2>
        <p className="mt-2 text-sm text-text-main whitespace-pre-wrap">{request.workflowDescription}</p>
      </section>

      {request.specifications && (
        <section>
          <h2 className="text-xs font-bold uppercase text-muted">Spesifikasi khusus</h2>
          <p className="mt-2 text-sm text-text-main whitespace-pre-wrap">{request.specifications}</p>
        </section>
      )}

      <section>
        <h2 className="text-xs font-bold uppercase text-muted">Fitur</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-text-main">
          {features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div>
          <h2 className="text-xs font-bold uppercase text-muted">Deadline</h2>
          <p className="mt-1 text-sm">{deadline}</p>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase text-muted">
            {request.agreedBudgetAmount != null ? "Harga kesepakatan" : "Estimasi biaya"}
          </h2>
          <p className="mt-1 text-sm font-bold text-primary">
            {formatBudget(getEffectiveBudget(request), request.budgetCurrency)}
          </p>
          {request.agreedBudgetAmount != null && (
            <p className="mt-1 text-xs text-muted">
              Estimasi awal: {formatBudget(request.budgetAmount, request.budgetCurrency)}
            </p>
          )}
          {request.budgetNote && <p className="mt-1 text-xs text-muted">{request.budgetNote}</p>}
        </div>
      </section>

      {request.assignedDeveloper && (
        <section>
          <h2 className="text-xs font-bold uppercase text-muted">Developer terpilih</h2>
          <p className="mt-1 text-sm">
            {request.assignedDeveloper.name ?? request.assignedDeveloper.email}{" "}
            <DeveloperPortfolioLink developerId={request.assignedDeveloper.id} className="ml-2" />
          </p>
        </section>
      )}

      {request.status === "completed" && request.startedAt && request.completedAt && (
        <WorkDurationBadge startedAt={request.startedAt} completedAt={request.completedAt} />
      )}

      {request.status === "cancelled" && request.cancelledAt && (
        <p className="text-xs text-muted">
          Dibatalkan pada{" "}
          {new Date(request.cancelledAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      )}

      {request.status === "rejected" && request.rejectionReason && (
        <div className="border border-red-500 p-3 text-sm text-red-400">
          Alasan ditolak: {request.rejectionReason}
        </div>
      )}
    </div>
  );
}
