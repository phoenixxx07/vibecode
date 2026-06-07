export function buildAuthCallbackUrl(callbackUrl?: string): string {
  const target = callbackUrl?.trim() || "/dashboard";
  if (target === "/dashboard") return "/auth/complete";
  return `/auth/complete?callbackUrl=${encodeURIComponent(target)}`;
}
