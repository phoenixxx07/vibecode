const PREFIX = "vibecatalog-chat-read";

type LastMessage = {
  createdAt: string;
  senderId: string;
};

export function getLastReadAt(applicationId: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(`${PREFIX}:${applicationId}`);
}

export function markConversationRead(applicationId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${PREFIX}:${applicationId}`, new Date().toISOString());
}

export function hasUnreadMessage(
  applicationId: string,
  lastMessage: LastMessage | null | undefined,
  currentUserId: string
) {
  if (!lastMessage || lastMessage.senderId === currentUserId) return false;
  const lastRead = getLastReadAt(applicationId);
  if (!lastRead) return true;
  return new Date(lastMessage.createdAt) > new Date(lastRead);
}

export function countUnreadThreads(
  threads: { applicationId: string; lastMessage: LastMessage | null }[],
  currentUserId: string
) {
  return threads.reduce((sum, thread) => {
    return sum + (hasUnreadMessage(thread.applicationId, thread.lastMessage, currentUserId) ? 1 : 0);
  }, 0);
}
