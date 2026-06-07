const THUMIO_WIDTH = 1200;

export const PLACEHOLDER_SCREENSHOT = "/placeholder-project.svg";

/** SVG placeholders and manual uploads should bypass the image optimizer. */
export function shouldUnoptimizeScreenshot(url: string): boolean {
  const path = url.split("?")[0];
  return path.endsWith(".svg") || path.startsWith("/uploads/");
}

function buildThumioUrl(targetUrl: string, apiKey?: string): string {
  const encoded = encodeURIComponent(targetUrl);

  if (apiKey) {
    return `https://image.thum.io/get/auth/${apiKey}/width/${THUMIO_WIDTH}/?url=${encoded}`;
  }

  return `https://image.thum.io/get/width/${THUMIO_WIDTH}/?url=${encoded}`;
}

export function getScreenshotUrl(url: string): string {
  const apiKey = process.env.THUMIO_API_KEY;
  return buildThumioUrl(url, apiKey || undefined);
}

/** Fixes legacy thum.io URLs that percent-encoded the target in the path. */
export function normalizeScreenshotUrl(url: string | null | undefined): string {
  if (!url) return PLACEHOLDER_SCREENSHOT;
  if (!url.includes("image.thum.io")) {
    // Manual uploads: strip ?v= cache-bust for stable next/image src
    return url.startsWith("/uploads/") ? url.split("?")[0] : url;
  }

  const encodedTarget = url.match(/\/(https%3A%2F%2F[^/?]+)/i)?.[1];
  if (encodedTarget) {
    try {
      return getScreenshotUrl(decodeURIComponent(encodedTarget));
    } catch {
      return PLACEHOLDER_SCREENSHOT;
    }
  }

  return url;
}
export function getRepositoryPreviewUrl(githubUrl: string): string {
  try {
    const parsed = new URL(githubUrl);
    if (parsed.hostname === "github.com") {
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (parts.length >= 2) {
        return `https://opengraph.githubassets.com/1/${parts[0]}/${parts[1]}`;
      }
    }
  } catch {
    // fall through
  }
  return PLACEHOLDER_SCREENSHOT;
}

export function getProjectScreenshot(
  projectType: string,
  url: string,
  githubUrl?: string | null
): string {
  if (projectType === "repository") {
    return getRepositoryPreviewUrl(githubUrl || url);
  }
  return getScreenshotUrl(url);
}

/** Absolute URL for Open Graph / social previews. */
export function absoluteScreenshotUrl(url: string | null | undefined): string | undefined {
  const normalized = normalizeScreenshotUrl(url);
  if (!normalized || normalized === PLACEHOLDER_SCREENSHOT) return undefined;
  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return `${base}${normalized.startsWith("/") ? normalized : `/${normalized}`}`;
}
