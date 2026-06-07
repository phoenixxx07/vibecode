"use client";

import { UnreadBadge, UnreadDot } from "./UnreadBadge";
import { useApplicationUnread } from "@/hooks/useChatUnread";

export function ApplicationRequestUnreadBadge({
  requestId,
  applicationId,
  currentUserId,
  lastMessage,
  variant = "badge",
}: {
  requestId: string;
  applicationId: string;
  currentUserId: string;
  lastMessage: { createdAt: string; senderId: string } | null;
  variant?: "badge" | "dot";
}) {
  const { count } = useApplicationUnread({
    requestId,
    applicationId,
    currentUserId,
    lastMessage,
  });

  if (variant === "dot") {
    return <UnreadDot show={count > 0} />;
  }

  return <UnreadBadge count={count} />;
}
