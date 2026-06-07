"use client";

import { useCallback, useEffect, useState } from "react";
import { hasUnreadMessage, markConversationRead } from "@/lib/chat-read-state";
import { subscribeUnreadMessages } from "@/lib/chat-unread-bus";

type ThreadLastMessage = {
  applicationId: string;
  lastMessage: { createdAt: string; senderId: string } | null;
};

function getInitialCount(
  applicationId: string,
  lastMessage: ThreadLastMessage["lastMessage"],
  currentUserId: string
) {
  return hasUnreadMessage(applicationId, lastMessage, currentUserId) ? 1 : 0;
}

export function useApplicationUnread({
  requestId,
  applicationId,
  currentUserId,
  lastMessage,
}: {
  requestId: string;
  applicationId: string;
  currentUserId: string;
  lastMessage: ThreadLastMessage["lastMessage"];
}) {
  const [count, setCount] = useState(() =>
    getInitialCount(applicationId, lastMessage, currentUserId)
  );

  useEffect(() => {
    setCount(getInitialCount(applicationId, lastMessage, currentUserId));
  }, [applicationId, currentUserId, lastMessage?.createdAt, lastMessage?.senderId]);

  useEffect(() => {
    return subscribeUnreadMessages((event) => {
      if (event.requestId !== requestId || event.applicationId !== applicationId) return;
      if (event.senderId === currentUserId) return;
      setCount((current) => current + 1);
    });
  }, [requestId, applicationId, currentUserId]);

  const markRead = useCallback(() => {
    markConversationRead(applicationId);
    setCount(0);
  }, [applicationId]);

  return { count, markRead };
}

export function useRequestUnread({
  requestId,
  threads,
  currentUserId,
}: {
  requestId: string;
  threads: ThreadLastMessage[];
  currentUserId: string;
}) {
  const [counts, setCounts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const thread of threads) {
      initial[thread.applicationId] = getInitialCount(
        thread.applicationId,
        thread.lastMessage,
        currentUserId
      );
    }
    return initial;
  });

  useEffect(() => {
    setCounts((current) => {
      const next: Record<string, number> = {};
      for (const thread of threads) {
        const baseline = getInitialCount(
          thread.applicationId,
          thread.lastMessage,
          currentUserId
        );
        next[thread.applicationId] = Math.max(baseline, current[thread.applicationId] ?? 0);
      }
      return next;
    });
  }, [threads, currentUserId]);

  useEffect(() => {
    return subscribeUnreadMessages((event) => {
      if (event.requestId !== requestId) return;
      if (event.senderId === currentUserId) return;
      setCounts((current) => ({
        ...current,
        [event.applicationId]: (current[event.applicationId] ?? 0) + 1,
      }));
    });
  }, [requestId, currentUserId]);

  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);

  const markRead = useCallback((applicationId: string) => {
    markConversationRead(applicationId);
    setCounts((current) => ({ ...current, [applicationId]: 0 }));
  }, []);

  const getCount = useCallback((applicationId: string) => counts[applicationId] ?? 0, [counts]);

  return { total, counts, markRead, getCount };
}
