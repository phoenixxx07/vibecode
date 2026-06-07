"use client";

import { useEffect, useRef } from "react";

type Message = {
  id: string;
  body: string;
  createdAt: string;
  sender: { id: string; name: string | null; email: string };
};

export function MessageList({
  messages,
  currentUserId,
}: {
  messages: Message[];
  currentUserId: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto p-4 text-xs text-muted">
        Belum ada pesan. Mulai percakapan.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain p-4"
    >
      {messages.map((msg) => {
        const isOwn = msg.sender.id === currentUserId;
        const name = msg.sender.name ?? msg.sender.email;
        const time = new Date(msg.createdAt).toLocaleString("id-ID", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        });
        return (
          <div key={msg.id} className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
            <span className="mb-1 text-xs text-muted">
              {isOwn ? "Anda" : name} · {time}
            </span>
            <div
              className={`max-w-[85%] border px-3 py-2 text-sm whitespace-pre-wrap ${
                isOwn
                  ? "border-primary bg-primary/10 text-text-main"
                  : "border-muted bg-page text-text-main"
              }`}
            >
              {msg.body}
            </div>
          </div>
        );
      })}
    </div>
  );
}
