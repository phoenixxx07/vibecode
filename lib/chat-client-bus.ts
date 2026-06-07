import type { ChatMessagePayload } from "./chat-hub";

type MessageHandler = (applicationId: string, message: ChatMessagePayload) => void;

const handlers = new Set<MessageHandler>();

export function subscribeChatClientMessages(handler: MessageHandler) {
  handlers.add(handler);
  return () => {
    handlers.delete(handler);
  };
}

export function emitChatClientMessage(applicationId: string, message: ChatMessagePayload) {
  for (const handler of handlers) {
    handler(applicationId, message);
  }
}
