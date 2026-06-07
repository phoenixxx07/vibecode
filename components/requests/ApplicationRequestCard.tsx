import Image from "next/image";
import Link from "next/link";
import { ApplicationRequestUnreadBadge } from "./ApplicationRequestUnreadBadge";
import {
  APPLICATION_STATUS_LABELS,
  formatBudget,
  getEffectiveBudget,
  PROJECT_REQUEST_STATUS_LABELS,
} from "@/lib/project-request-labels";
import { getProjectTypeLabel } from "@/lib/products";
import {
  ProjectRequestApplicationStatus,
  ProjectRequestStatus,
} from "@prisma/client";

type ChatContact = {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
};

type ApplicationRequestCardProps = {
  title: string;
  description: string;
  projectType: string;
  deadline: Date | string;
  budgetAmount: number;
  agreedBudgetAmount?: number | null;
  budgetCurrency: string;
  requestStatus: ProjectRequestStatus;
  applicationStatus: ProjectRequestApplicationStatus;
  requestId: string;
  applicationId: string;
  categories?: { category: { name: string } }[];
  projectTypeLabels?: Record<string, string>;
  contact: ChatContact;
  currentUserId?: string;
  pitchMessage?: string | null;
  messageCount?: number;
  lastMessage?: { body: string; createdAt: string; senderId: string } | null;
};

function formatMessageTime(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (sameDay) {
    return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  }

  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export function ApplicationRequestCard({
  title,
  description,
  projectType,
  deadline,
  budgetAmount,
  agreedBudgetAmount,
  budgetCurrency,
  requestStatus,
  applicationStatus,
  requestId,
  applicationId,
  categories,
  projectTypeLabels = {},
  contact,
  currentUserId,
  pitchMessage,
  messageCount = 0,
  lastMessage,
}: ApplicationRequestCardProps) {
  const contactName = contact.name ?? contact.email;
  const preview = lastMessage?.body ?? pitchMessage;
  const previewTime = lastMessage?.createdAt;

  const deadlineLabel = new Date(deadline).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const primaryCategory = categories?.[0]?.category;

  return (
    <article className="relative flex flex-col border border-muted bg-surface p-5 transition-colors hover:border-primary">
      {currentUserId && (
        <div className="absolute right-3 top-3">
          <ApplicationRequestUnreadBadge
            requestId={requestId}
            applicationId={applicationId}
            currentUserId={currentUserId}
            lastMessage={
              lastMessage
                ? { createdAt: lastMessage.createdAt, senderId: lastMessage.senderId }
                : null
            }
          />
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <span className="border border-muted px-2 py-0.5 text-xs font-bold uppercase text-muted">
          {getProjectTypeLabel(projectType, projectTypeLabels)}
        </span>
        {primaryCategory && (
          <span className="border border-muted px-2 py-0.5 text-xs uppercase text-muted">
            {primaryCategory.name}
          </span>
        )}
        <span className="border border-primary px-2 py-0.5 text-xs font-bold uppercase text-primary">
          {PROJECT_REQUEST_STATUS_LABELS[requestStatus]}
        </span>
        <span
          className={`border px-2 py-0.5 text-xs font-bold uppercase ${
            applicationStatus === "selected"
              ? "border-accent text-accent"
              : "border-muted text-text-main"
          }`}
        >
          {APPLICATION_STATUS_LABELS[applicationStatus]}
        </span>
      </div>
      <h3 className="mt-3 text-sm font-bold uppercase text-text-main">{title}</h3>
      <p className="mt-2 line-clamp-2 flex-1 text-xs text-muted">{description}</p>
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
        <span>Deadline: {deadlineLabel}</span>
        <span>
          {formatBudget(
            getEffectiveBudget({ budgetAmount, agreedBudgetAmount }),
            budgetCurrency
          )}
        </span>
      </div>

      <div className="mt-4 border-t border-muted pt-4">
        <p className="text-[10px] font-bold uppercase text-muted">&gt; PERCAKAPAN</p>
        <div className="mt-3 flex items-start gap-3">
          <div className="relative h-9 w-9 shrink-0">
            <div className="relative h-9 w-9 overflow-hidden border border-muted bg-page">
              {contact.avatarUrl ? (
                <Image
                  src={contact.avatarUrl}
                  alt={contactName}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="flex h-full items-center justify-center text-xs font-bold text-primary">
                  {contactName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {currentUserId && (
              <ApplicationRequestUnreadBadge
                requestId={requestId}
                applicationId={applicationId}
                currentUserId={currentUserId}
                lastMessage={
                  lastMessage
                    ? { createdAt: lastMessage.createdAt, senderId: lastMessage.senderId }
                    : null
                }
                variant="dot"
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="truncate text-xs font-bold uppercase text-text-main">
                {contactName}
              </p>
              {previewTime && (
                <span className="shrink-0 text-[10px] text-muted">
                  {formatMessageTime(previewTime)}
                </span>
              )}
            </div>
            {messageCount > 0 && (
              <p className="mt-0.5 text-[10px] text-muted">{messageCount} pesan</p>
            )}
            {preview ? (
              <p className="mt-1.5 line-clamp-2 text-xs text-muted">
                {!lastMessage && pitchMessage ? `Pitch: ${preview}` : preview}
              </p>
            ) : (
              <p className="mt-1.5 text-xs italic text-muted">Belum ada pesan</p>
            )}
          </div>
        </div>
      </div>

      <Link
        href={`/requests/${requestId}`}
        className="mt-4 border border-primary px-3 py-2 text-center text-xs font-bold uppercase text-primary hover:bg-primary hover:text-background-dark"
      >
        [BUKA_CHAT]
      </Link>
    </article>
  );
}
