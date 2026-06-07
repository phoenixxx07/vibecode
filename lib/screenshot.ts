export const MANUAL_SCREENSHOT_PREFIX = "/uploads/screenshots/";

export const ALLOWED_IMAGE_TYPES: Record<string, "webp"> = {
  "image/webp": "webp",
};

export const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;

export function isManualScreenshot(url: string | null | undefined): boolean {
  return !!url?.startsWith(MANUAL_SCREENSHOT_PREFIX);
}

export function validateScreenshotFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES[file.type]) {
    return "Format tidak didukung. Gunakan WebP saja agar file lebih ringan.";
  }
  if (file.size > MAX_SCREENSHOT_BYTES) {
    return "Ukuran file maksimal 5 MB.";
  }
  if (file.size === 0) {
    return "File kosong.";
  }
  return null;
}
