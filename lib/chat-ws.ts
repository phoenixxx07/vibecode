import type { IncomingMessage } from "http";
import type { Duplex } from "stream";
import { parse } from "url";
import { getToken } from "next-auth/jwt";
import { WebSocket, WebSocketServer } from "ws";
import type { ChatEvent } from "./chat-hub";
import { canAccessRequestChat } from "./project-requests";

type ClientState = {
  userId: string;
  requestIds: Set<string>;
};

const clients = new Map<WebSocket, ClientState>();

async function authenticateWs(req: IncomingMessage): Promise<string | null> {
  const cookieHeader = req.headers.cookie ?? "";
  const cookieNames = cookieHeader
    .split(";")
    .map((c) => c.trim().split("=")[0])
    .filter(Boolean);

  if (process.env.NODE_ENV === "development") {
    console.log("[ws] upgrade cookies present:", cookieNames.join(", ") || "(none)");
  }

  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  const secureCookie = process.env.NODE_ENV === "production";
  const fakeReq = { headers: { cookie: cookieHeader } } as Parameters<typeof getToken>[0]["req"];

  // NextAuth v5 uses "authjs.session-token"; v4 used "next-auth.session-token".
  // Try both so auth works regardless of which cookie is present.
  for (const cookieName of [
    secureCookie ? "__Secure-authjs.session-token" : "authjs.session-token",
    secureCookie ? "__Secure-next-auth.session-token" : "next-auth.session-token",
  ]) {
    const token = await getToken({ req: fakeReq, secret, secureCookie, cookieName });
    if (typeof token?.id === "string") {
      if (process.env.NODE_ENV === "development") {
        console.log("[ws] authenticated userId:", token.id, "via cookie:", cookieName);
      }
      return token.id;
    }
  }

  console.warn("[ws] auth failed — no valid session token found in cookies:", cookieNames.join(", ") || "(none)");
  return null;
}

function send(ws: WebSocket, event: ChatEvent) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(event));
  }
}

export function broadcastChatEvent(event: ChatEvent) {
  if (event.type === "subscribed") return;

  let sent = 0;
  for (const [ws, state] of clients) {
    if (!state.requestIds.has(event.requestId)) continue;
    send(ws, event);
    sent++;
  }

  if (process.env.NODE_ENV === "development") {
    console.log(
      `[ws] broadcast type=${event.type} requestId=${event.requestId} → sent to ${sent}/${clients.size} client(s)`
    );
  }
}

async function handleClientMessage(ws: WebSocket, state: ClientState, raw: Buffer) {
  try {
    const data = JSON.parse(raw.toString()) as { action?: string; requestId?: string };

    if (data.action === "subscribe" && data.requestId) {
      const allowed = await canAccessRequestChat(data.requestId, state.userId);
      if (!allowed) {
        console.warn(`[ws] subscribe DENIED userId=${state.userId} requestId=${data.requestId}`);
        send(ws, { type: "error", code: "forbidden", requestId: data.requestId });
        return;
      }

      state.requestIds.add(data.requestId);
      send(ws, { type: "subscribed", requestId: data.requestId });
      console.log(`[ws] subscribed userId=${state.userId} requestId=${data.requestId}`);
    }
  } catch {
    ws.close(4400, "Bad request");
  }
}

export function setupChatWebSocket(wss: WebSocketServer) {
  console.log("[ws] chat WebSocket server ready");

  wss.on("connection", (ws, req) => {
    // Clients send subscribe immediately on onopen. Auth is async, so buffer
    // messages until the handler is ready — otherwise subscribe is dropped.
    const pendingMessages: Buffer[] = [];
    let state: ClientState | null = null;

    ws.on("message", (raw) => {
      if (!state) {
        pendingMessages.push(raw);
        return;
      }
      void handleClientMessage(ws, state, raw);
    });

    ws.on("close", () => {
      if (!state) return;
      clients.delete(ws);
      console.log(`[ws] client disconnected userId=${state.userId} remaining=${clients.size}`);
    });

    void (async () => {
      const userId = await authenticateWs(req);
      if (!userId) {
        ws.close(4401, "Unauthorized");
        return;
      }

      state = { userId, requestIds: new Set() };
      clients.set(ws, state);
      console.log(`[ws] client connected userId=${userId} total=${clients.size}`);

      for (const raw of pendingMessages) {
        await handleClientMessage(ws, state, raw);
      }
    })();
  });
}

export function attachChatWebSocketUpgrade(
  wss: WebSocketServer,
  server: import("http").Server,
  onOtherUpgrade: (req: IncomingMessage, socket: Duplex, head: Buffer) => void
) {
  setupChatWebSocket(wss);

  server.on("upgrade", (req: IncomingMessage, socket: Duplex, head: Buffer) => {
    const { pathname } = parse(req.url ?? "");
    if (pathname === "/api/ws/chat") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
      });
      return;
    }
    onOtherUpgrade(req, socket, head);
  });
}
