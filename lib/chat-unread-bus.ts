type UnreadMessageEvent = {
  requestId: string;
  applicationId: string;
  senderId: string;
};

type Listener = (event: UnreadMessageEvent) => void;

const listeners = new Set<Listener>();

export function emitUnreadMessage(event: UnreadMessageEvent) {
  for (const listener of listeners) {
    listener(event);
  }
}

export function subscribeUnreadMessages(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
