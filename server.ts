import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { WebSocketServer } from "ws";
import { attachChatWebSocketUpgrade, broadcastChatEvent } from "./lib/chat-ws";
import type { ChatEvent } from "./lib/chat-hub";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME ?? "localhost";
const port = parseInt(process.env.PORT ?? "3000", 10);

const app = next({ dev, hostname, port });

app.prepare().then(() => {
  const handle = app.getRequestHandler();
  const upgradeHandler = app.getUpgradeHandler();

  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url ?? "", true);

    // Internal-only endpoint: API routes POST here to broadcast WS events
    // without needing to share a global function pointer across module contexts.
    if (req.method === "POST" && parsedUrl.pathname === "/_ws_broadcast") {
      let body = "";
      req.on("data", (chunk: Buffer) => { body += chunk.toString(); });
      req.on("end", () => {
        try {
          const event = JSON.parse(body) as ChatEvent;
          broadcastChatEvent(event);
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end("ok");
        } catch {
          res.writeHead(400);
          res.end("bad request");
        }
      });
      return;
    }

    handle(req, res, parsedUrl);
  });

  const wss = new WebSocketServer({ noServer: true });
  attachChatWebSocketUpgrade(wss, server, upgradeHandler);

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> WebSocket chat on ws://${hostname}:${port}/api/ws/chat`);
  });
});
