export function normalizeUserId(id: string | null | undefined) {
  return (id ?? "").trim();
}

export function isMessageFromOtherUser(
  senderId: string | null | undefined,
  loggedInUserId: string | null | undefined
) {
  const sender = normalizeUserId(senderId);
  const loggedIn = normalizeUserId(loggedInUserId);
  if (!sender || !loggedIn) return false;
  return sender !== loggedIn;
}
