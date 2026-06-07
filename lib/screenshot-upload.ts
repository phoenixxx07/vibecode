import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import {
  ALLOWED_IMAGE_TYPES,
  MANUAL_SCREENSHOT_PREFIX,
  isManualScreenshot,
} from "@/lib/screenshot";

export { isManualScreenshot, MANUAL_SCREENSHOT_PREFIX };

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
