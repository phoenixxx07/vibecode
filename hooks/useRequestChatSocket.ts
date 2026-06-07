"use client";

import { useEffect, useRef } from "react";
import type { ChatEvent } from "@/lib/chat-hub";
import { emitChatClientMessage } from "@/lib/chat-client-bus";
import {
  playNotificationSound,
  requestNotificationPermission,
  showChatNotification,
} from "@/lib/chat-notifications";
import { emitUnreadMessage } from "@/lib/chat-unread-bus";
import { isMessageFromOtherUser } from "@/lib/is-message-from-other-user";
import { useLoggedInUserId } from "@/hooks/useLoggedInUserId";

function getWsUrl() {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/api/ws/chat`;
}

export function useRequestChatSocket({
  requestId,
  currentUserId,
  activeApplicationId,
  onConversationsUpdated,
}: {
  requestId: string;
  currentUserId: string;
  activeApplicationId?: string | null;
  onConversationsUpdated?: () => void;
}) {
  const { userIdRef: loggedInUserIdRef } = useLoggedInUserId(currentUserId);

  const activeApplicationIdRef = useRef(activeApplicationId);
  activeApplicationIdRef.current = activeApplicationId;

  const onConversationsUpdatedRef = useRef(onConversationsUpdated);
  onConversationsUpdatedRef.current = onConversationsUpdated;

  useEffect(() => {
    void requestNotificationPermission();
  }, []);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let closedByUser = false;
    let attempt = 0;

    function connect() {
      ws = new WebSocket(getWsUrl());

      ws.onopen = () => {
        attempt = 0;
        ws?.send(JSON.stringify({ action: "subscribe", requestId }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data) as ChatEvent;

        if (data.type === "message") {
          emitChatClientMessage(data.applicationId, data.message);

          const senderId = data.message.sender.id;
          const loggedInUserId = loggedInUserIdRef.current;
          const fromOtherUser = isMessageFromOtherUser(senderId, loggedInUserId);
          const isActiveThread = data.applicationId === activeApplicationIdRef.current;

          if (fromOtherUser) {
            playNotificationSound();
          }

          if (fromOtherUser && (!isActiveThread || document.hidden)) {
            emitUnreadMessage({
              requestId,
              applicationId: data.applicationId,
              senderId,
            });
            const senderName = data.message.sender.name ?? data.message.sender.email;
            showChatNotification(`Pesan dari ${senderName}`, data.message.body);
          }
        }

        if (data.type === "conversations_updated") {
          onConversationsUpdatedRef.current?.();
        }
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
  }, [requestId, currentUserId]);
}
