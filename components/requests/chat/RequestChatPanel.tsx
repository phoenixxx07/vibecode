"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Conversation,
  ConversationHeader,
  ConversationList,
} from "./ConversationList";
import { MessageList } from "./MessageList";
import { MessageComposer } from "./MessageComposer";
import { SelectDeveloperButton } from "../RequestActions";
import { useRequestChatSocket } from "@/hooks/useRequestChatSocket";
import { useRequestUnread } from "@/hooks/useChatUnread";
import { subscribeChatClientMessages } from "@/lib/chat-client-bus";
import type { ChatMessagePayload } from "@/lib/chat-hub";
import { UnreadBadge } from "@/components/requests/UnreadBadge";
import { unlockNotificationAudio } from "@/lib/chat-notifications";

type Message = {
  id: string;
  body: string;
  createdAt: string;
  sender: { id: string; name: string | null; email: string };
};

function toMessage(payload: ChatMessagePayload): Message {
  return {
    id: payload.id,
    body: payload.body,
    createdAt: payload.createdAt,
    sender: payload.sender,
  };
}

function mergeMessages(existing: Message[], incoming: Message[]) {
  const byId = new Map<string, Message>();
  for (const msg of existing) byId.set(msg.id, msg);
  for (const msg of incoming) byId.set(msg.id, msg);
  return [...byId.values()].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

function sortConversationsByLastMessage(conversations: Conversation[]) {
  return [...conversations].sort((a, b) => {
    const aTime = a.lastMessage?.createdAt ?? "";
    const bTime = b.lastMessage?.createdAt ?? "";
    return bTime.localeCompare(aTime);
  });
}

export function RequestChatPanel({
  requestId,
  requestStatus,
  currentUserId,
  isRequester,
  canSendMessages,
  showSelectButton,
  cancellationPending,
  budgetAmount,
  budgetCurrency,
}: {
  requestId: string;
  requestStatus: string;
  currentUserId: string;
  isRequester: boolean;
  canSendMessages: boolean;
  showSelectButton?: boolean;
  cancellationPending?: boolean;
  budgetAmount: number;
  budgetCurrency: string;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messagesByThread, setMessagesByThread] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(true);
  const selectedIdRef = useRef<string | null>(null);
  selectedIdRef.current = selectedId;

  const handleSelectConversation = useCallback((id: string) => {
    unlockNotificationAudio();
    setSelectedId(id);
  }, []);

  const messages = useMemo(
    () => (selectedId ? messagesByThread[selectedId] ?? [] : []),
    [selectedId, messagesByThread]
  );

  const selectedConversation = useMemo(
    () => conversations.find((conv) => conv.id === selectedId) ?? null,
    [conversations, selectedId]
  );

  const unreadThreads = useMemo(
    () =>
      conversations.map((conv) => ({
        applicationId: conv.id,
        lastMessage: conv.lastMessage
          ? {
              createdAt: conv.lastMessage.createdAt,
              senderId: conv.lastMessage.senderId,
            }
          : null,
      })),
    [conversations]
  );

  const { total: totalUnread, getCount, markRead } = useRequestUnread({
    requestId,
    threads: unreadThreads,
    currentUserId,
  });

  const loadConversations = useCallback(async () => {
    const res = await fetch(`/api/project-requests/${requestId}/conversations`);
    if (!res.ok) return;
    const data = await res.json();
    setConversations(sortConversationsByLastMessage(data.conversations));
    setSelectedId((current) => {
      if (current && data.conversations.some((conv: Conversation) => conv.id === current)) {
        return current;
      }
      return data.conversations[0]?.id ?? null;
    });
  }, [requestId]);

  const loadMessages = useCallback(async () => {
    if (!selectedId) return;

    const res = await fetch(
      `/api/project-requests/${requestId}/messages?applicationId=${selectedId}`
    );
    if (!res.ok) return;
    const data = await res.json();

    setMessagesByThread((prev) => ({
      ...prev,
      [selectedId]: mergeMessages(prev[selectedId] ?? [], data.messages as Message[]),
    }));
  }, [requestId, selectedId]);

  const handleIncomingMessage = useCallback(
    (applicationId: string, payload: ChatMessagePayload) => {
      const message = toMessage(payload);

      setMessagesByThread((prev) => ({
        ...prev,
        [applicationId]: mergeMessages(prev[applicationId] ?? [], [message]),
      }));

      setConversations((prev) => {
        const updated = prev.map((conv) =>
          conv.id === applicationId
            ? {
                ...conv,
                messageCount: conv.messageCount + 1,
                lastMessage: {
                  body: message.body,
                  createdAt: message.createdAt,
                  senderId: message.sender.id,
                },
              }
            : conv
        );

        return sortConversationsByLastMessage(updated);
      });

      if (applicationId === selectedIdRef.current) {
        markRead(applicationId);
      }
    },
    [markRead]
  );

  useEffect(() => {
    loadConversations().finally(() => setLoading(false));
  }, [loadConversations]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (selectedId) {
      markRead(selectedId);
    }
  }, [selectedId, markRead]);

  useEffect(() => {
    return subscribeChatClientMessages(handleIncomingMessage);
  }, [handleIncomingMessage]);

  useRequestChatSocket({
    requestId,
    currentUserId,
    activeApplicationId: selectedId,
    onConversationsUpdated: loadConversations,
  });

  async function handleSend(body: string) {
    if (!selectedId) return;
    const res = await fetch(`/api/project-requests/${requestId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId: selectedId, body }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    const message = toMessage({
      id: data.id,
      body: data.body,
      createdAt:
        typeof data.createdAt === "string"
          ? data.createdAt
          : new Date(data.createdAt).toISOString(),
      sender: data.sender,
    });

    setMessagesByThread((prev) => ({
      ...prev,
      [selectedId]: mergeMessages(prev[selectedId] ?? [], [message]),
    }));

    setConversations((prev) =>
      sortConversationsByLastMessage(
        prev.map((conv) =>
          conv.id === selectedId
            ? {
                ...conv,
                messageCount: conv.messageCount + 1,
                lastMessage: {
                  body: message.body,
                  createdAt: message.createdAt,
                  senderId: message.sender.id,
                },
              }
            : conv
        )
      )
    );
  }

  const composerDisabled =
    !canSendMessages ||
    cancellationPending ||
    requestStatus === "completed" ||
    requestStatus === "cancelled";

  if (loading) {
    return <div className="p-4 text-xs text-muted">Memuat percakapan...</div>;
  }

  if (conversations.length === 0) {
    return (
      <div className="border border-muted bg-surface p-6 text-center text-sm text-muted">
        Belum ada developer yang mengajukan.
      </div>
    );
  }

  return (
    <div className="flex flex-col border border-muted bg-surface">
      <div className="border-b border-muted px-4 py-2">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold uppercase text-primary">&gt; PERCAKAPAN</h3>
          <UnreadBadge count={totalUnread} />
        </div>
        <p className="mt-1 text-xs text-muted">
          Pilih kontak developer untuk melihat dan membalas pesan.
        </p>
      </div>

      <div className="flex h-[34rem] flex-col overflow-hidden lg:flex-row">
        <aside className="flex h-48 min-h-0 shrink-0 flex-col overflow-hidden border-b border-muted lg:h-full lg:w-80 lg:shrink-0 lg:border-b-0 lg:border-r">
          <ConversationList
            conversations={conversations}
            selectedId={selectedId}
            onSelect={handleSelectConversation}
            unreadCounts={Object.fromEntries(
              conversations.map((conv) => [conv.id, getCount(conv.id)])
            )}
          />
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          {selectedConversation ? (
            <>
              <ConversationHeader
                conversation={selectedConversation}
                showDeveloperPortfolio={isRequester}
              />

              {selectedConversation.pitchMessage && (
                <div className="shrink-0 border-b border-muted bg-page/40 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase text-muted">Pitch developer</p>
                  <p className="mt-1 text-xs whitespace-pre-wrap text-text-main">
                    {selectedConversation.pitchMessage}
                  </p>
                </div>
              )}

              <MessageList messages={messages} currentUserId={currentUserId} />

              <MessageComposer disabled={composerDisabled || !selectedId} onSend={handleSend} />

              {showSelectButton &&
                selectedId &&
                requestStatus === "published" &&
                isRequester &&
                selectedConversation.status === "active" && (
                  <div className="shrink-0 border-t border-muted p-3">
                    <SelectDeveloperButton
                      requestId={requestId}
                      applicationId={selectedId}
                      budgetAmount={budgetAmount}
                      budgetCurrency={budgetCurrency}
                    />
                  </div>
                )}
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-8 text-sm text-muted">
              Pilih kontak developer di sebelah kiri.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
