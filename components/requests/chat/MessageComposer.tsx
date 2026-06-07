"use client";

import { FormEvent, useState } from "react";
import { TerminalButton } from "@/components/terminal/TerminalButton";
import { unlockNotificationAudio } from "@/lib/chat-notifications";

export function MessageComposer({
  disabled,
  onSend,
}: {
  disabled?: boolean;
  onSend: (body: string) => Promise<void>;
}) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    unlockNotificationAudio();
    if (!body.trim() || disabled) return;
    setLoading(true);
    setError("");
    try {
      await onSend(body.trim());
      setBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengirim");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="shrink-0 border-t border-muted p-3">
      {disabled ? (
        <p className="text-xs text-muted">Percakapan read-only pada fase ini.</p>
      ) : (
        <>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onFocus={unlockNotificationAudio}
            onKeyDown={handleKeyDown}
            placeholder="Tanya detail proyek... (Enter kirim, Shift+Enter baris baru)"
            rows={2}
            className="w-full border border-muted bg-page px-3 py-2 text-sm text-text-main"
            disabled={loading}
          />
          {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
          <TerminalButton type="submit" className="mt-2" disabled={loading || !body.trim()}>
            {loading ? "..." : "[KIRIM]"}
          </TerminalButton>
        </>
      )}
    </form>
  );
}
