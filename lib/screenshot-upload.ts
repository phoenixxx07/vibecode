import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import {
  ALLOWED_IMAGE_TYPES,
  MANUAL_SCREENSHOT_PREFIX,
  isManualScreenshot,
} from "@/lib/screenshot";

export { isManualScreenshot, MANUAL_SCREENSHOT_PREFIX };

const SCREENSHOT_CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

const SCREENSHOT_FILENAME_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|jpeg|png|webp)$/i;

export function isValidScreenshotFilename(filename: string): boolean {
  return filename === path.basename(filename) && SCREENSHOT_FILENAME_PATTERN.test(filename);
}

export function getScreenshotContentType(filename: string): string | null {
  const ext = path.extname(filename).slice(1).toLowerCase();
  return SCREENSHOT_CONTENT_TYPES[ext] ?? null;
}

export async function readProductScreenshot(
  filename: string
): Promise<{ buffer: Buffer; contentType: string } | null> {
  if (!isValidScreenshotFilename(filename)) return null;

  const contentType = getScreenshotContentType(filename);
  if (!contentType) return null;

  const filepath = path.join(SCREENSHOT_UPLOAD_DIR, filename);
  if (!filepath.startsWith(SCREENSHOT_UPLOAD_DIR)) return null;

  try {
    const buffer = await readFile(filepath);
    return { buffer, contentType };
  } catch {
    return null;
  }
}

export const SCREENSHOT_UPLOAD_DIR = path.join(
  process.cwd(),
  "public",
  "uploads",
  "screenshots"
);

export async function saveProductScreenshot(
  productId: string,
  file: File
): Promise<string> {
  const ext = ALLOWED_IMAGE_TYPES[file.type];
  const filename = `${productId}.${ext}`;
  const filepath = path.join(SCREENSHOT_UPLOAD_DIR, filename);

  await mkdir(SCREENSHOT_UPLOAD_DIR, { recursive: true });
  await writeFile(filepath, Buffer.from(await file.arrayBuffer()));

  return `${MANUAL_SCREENSHOT_PREFIX}${filename}?v=${Date.now()}`;
}

export async function deleteManualScreenshotFile(
  screenshotUrl: string | null | undefined
): Promise<void> {
  if (!isManualScreenshot(screenshotUrl)) return;

  const pathname = screenshotUrl!.split("?")[0];
  const filename = path.basename(pathname);
  const filepath = path.join(SCREENSHOT_UPLOAD_DIR, filename);

  try {
    await unlink(filepath);
  } catch {
    // file may already be gone
  }
}
