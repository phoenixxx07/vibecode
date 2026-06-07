import { EventEmitter } from "events";

export type ChatMessagePayload = {
  id: string;
  body: string;
  createdAt: string;
  sender: { id: string; name: string | null; email: string };
};

export type ChatEvent =
  | {
      type: "message";
      requestId: string;
      applicationId: string;
      message: ChatMessagePayload;
      senderId: string;
    }
  | { type: "conversations_updated"; requestId: string }
  | { type: "subscribed"; requestId: string }
  | { type: "error"; code: string; requestId: string };

class ChatHub extends EventEmitter {
  publish(event: ChatEvent) {
    this.emit("chat", event);
  }

  subscribe(listener: (event: ChatEvent) => void) {
    this.on("chat", listener);
    return () => this.off("chat", listener);
  }
}

const globalForChat = globalThis as unknown as { chatHub?: ChatHub };

export const chatHub = globalForChat.chatHub ?? new ChatHub();
globalForChat.chatHub = chatHub;
