"use client";

import { UnreadBadge } from "./UnreadBadge";
import { useRequestUnread } from "@/hooks/useChatUnread";

export function ProjectRequestUnreadBadge({
  requestId,
  threads,
  currentUserId,
}: {
  requestId: string;
  threads: {
    applicationId: string;
    lastMessage: { createdAt: string; senderId: string } | null;
  }[];
  currentUserId: string;
}) {
  const { total } = useRequestUnread({ requestId, threads, currentUserId });
  return <UnreadBadge count={total} />;
}
