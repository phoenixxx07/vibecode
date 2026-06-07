import type { ChatEvent } from "./chat-hub";

// Instead of a shared-global function pointer (which breaks because Next.js
// webpack and server.ts use isolated module contexts), we POST the event to
// the internal /_ws_broadcast endpoint that server.ts handles directly.
// This is always reliable because it uses plain HTTP, not module state.

export async function publishChatEvent(event: ChatEvent): Promise<void> {
  const port = process.env.PORT ?? "3000";
  const hostname = process.env.HOSTNAME ?? "localhost";
  try {
    await fetch(`http://${hostname}:${port}/_ws_broadcast`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[chat-realtime] failed to reach /_ws_broadcast:", err);
    }
  }
}

export function hasChatBroadcast(): boolean {
  return true;
}

// No-op: registration is now implicit (server.ts owns the broadcast handler).
export function registerChatBroadcast(_fn: unknown): void {}
