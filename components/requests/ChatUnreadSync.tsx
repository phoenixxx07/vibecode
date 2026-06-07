"use client";

import { useEffect } from "react";
import type { ChatEvent } from "@/lib/chat-hub";
import { playNotificationSound } from "@/lib/chat-notifications";
import { emitUnreadMessage } from "@/lib/chat-unread-bus";
import { isMessageFromOtherUser } from "@/lib/is-message-from-other-user";
import { useLoggedInUserId } from "@/hooks/useLoggedInUserId";

function getWsUrl() {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/api/ws/chat`;
}

export function ChatUnreadSync({
  requestIds,
  currentUserId,
}: {
  requestIds: string[];
  currentUserId: string;
}) {
  const { userIdRef: loggedInUserIdRef } = useLoggedInUserId(currentUserId);
  const ids = [...new Set(requestIds)].sort().join(",");

  useEffect(() => {
    if (!ids) return;

    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let closedByUser = false;
    let attempt = 0;
    const subscribedIds = ids.split(",").filter(Boolean);

    function connect() {
      ws = new WebSocket(getWsUrl());

      ws.onopen = () => {
        attempt = 0;
        for (const requestId of subscribedIds) {
          ws?.send(JSON.stringify({ action: "subscribe", requestId }));
        }
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data) as ChatEvent;
        if (data.type !== "message") return;

        const senderId = data.message.sender.id;
        if (!isMessageFromOtherUser(senderId, loggedInUserIdRef.current)) return;

        playNotificationSound();
        emitUnreadMessage({
          requestId: data.requestId,
          applicationId: data.applicationId,
          senderId,
        });
      };

      ws.onclose = () => {
        if (closedByUser) return;
        const delay = Math.min(1000 * 2 ** attempt, 30000);
        attempt += 1;
        reconnectTimer = setTimeout(connect, delay);
      };
    }

    connect();

    return () => {
      closedByUser = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, [ids, currentUserId]);

  return null;
}
