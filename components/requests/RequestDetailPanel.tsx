"use client";

import Link from "next/link";
import { ApplyButton } from "./ApplyButton";
import { RequestChatPanel } from "./chat/RequestChatPanel";
import {
  CancelRequestButton,
  CancellationBanner,
  CompleteRequestButton,
  DuplicateRequestButton,
  ReopenRequestButton,
} from "./RequestActions";

type RequestData = {
  id: string;
  requesterId: string;
  status: string;
  budgetAmount: number;
  budgetCurrency: string;
  assignedDeveloperId: string | null;
  cancellationRequestedById: string | null;
  requester: { id: string; name: string | null; email: string };
  assignedDeveloper?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  cancellationRequestedBy?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  applications: { id: string; developerId: string; status: string }[];
};

export function RequestDetailPanel({
  request,
  currentUserId,
  isLoggedIn,
}: {
  request: RequestData;
  currentUserId?: string;
  isLoggedIn: boolean;
}) {
  const isRequester = currentUserId === request.requesterId;
  const isAssignedDev = currentUserId === request.assignedDeveloperId;
  const myApplication = request.applications.find((a) => a.developerId === currentUserId);
  const hasApplied = !!myApplication;

  const canChat =
    isLoggedIn &&
    (isRequester ||
      hasApplied ||
      isAssignedDev);

  const canSendMessages =
    request.status === "published" ||
    (request.status === "in_progress" && (isRequester || isAssignedDev));

  const cancellationPending = !!request.cancellationRequestedById;
  const canRespondCancellation =
    cancellationPending &&
    currentUserId &&
    request.cancellationRequestedById !== currentUserId &&
    (isRequester || isAssignedDev);

  if (!isLoggedIn) {
    return (
      <div className="border border-muted bg-surface p-6 text-center">
        <p className="text-sm text-muted">Login untuk mendaftar atau chat dengan developer.</p>
        <Link
          href={`/login?callbackUrl=/requests/${request.id}`}
          className="mt-4 inline-block border border-primary px-4 py-2 text-sm font-bold uppercase text-primary hover:bg-primary hover:text-background-dark"
        >
          [LOGIN]
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {request.status === "published" && !isRequester && !hasApplied && (
        <ApplyButton requestId={request.id} />
      )}

      {request.status === "in_progress" && cancellationPending && (
        <CancellationBanner
          requestId={request.id}
          requestedByName={
            request.cancellationRequestedBy?.name ??
            request.cancellationRequestedBy?.email ??
            "Pihak lain"
          }
          canRespond={!!canRespondCancellation}
        />
      )}

      {request.status === "in_progress" && isRequester && (
        <CompleteRequestButton requestId={request.id} />
      )}

      {request.status === "in_progress" && (isRequester || isAssignedDev) && !cancellationPending && (
        <CancelRequestButton requestId={request.id} />
      )}

      {request.status === "cancelled" && isRequester && (
        <ReopenRequestButton requestId={request.id} />
      )}

      {request.status === "completed" && isRequester && (
        <DuplicateRequestButton requestId={request.id} />
      )}

      {canChat && currentUserId && (
        <RequestChatPanel
          requestId={request.id}
          requestStatus={request.status}
          currentUserId={currentUserId}
          isRequester={isRequester}
          canSendMessages={canSendMessages && !cancellationPending}
          showSelectButton={isRequester}
          cancellationPending={cancellationPending}
          budgetAmount={request.budgetAmount}
          budgetCurrency={request.budgetCurrency}
        />
      )}

      {isLoggedIn && request.status === "published" && isRequester && request.applications.length === 0 && (
        <p className="text-xs text-muted">Menunggu developer mendaftar...</p>
      )}
    </div>
  );
}
