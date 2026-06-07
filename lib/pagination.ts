export const MAX_PAGE_SIZE = 50;
export const DEFAULT_PAGE_SIZE = 50;

export function normalizePagination(page?: number, limit?: number) {
  const safePage = Math.max(1, Math.floor(page ?? 1) || 1);
  const rawLimit = Math.floor(limit ?? DEFAULT_PAGE_SIZE) || DEFAULT_PAGE_SIZE;
  const safeLimit = Math.min(Math.max(1, rawLimit), MAX_PAGE_SIZE);
  return { page: safePage, limit: safeLimit };
}

export function buildPagedHref(
  basePath: string,
  params: Record<string, string | undefined>,
  page: number
) {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value && key !== "page") sp.set(key, value);
  }
  if (page > 1) sp.set("page", String(page));
  const query = sp.toString();
  return query ? `${basePath}?${query}` : basePath;
}
