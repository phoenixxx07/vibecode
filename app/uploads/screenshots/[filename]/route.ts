import { readProductScreenshot } from "@/lib/screenshot-upload";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const screenshot = await readProductScreenshot(filename);

  if (!screenshot) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(new Uint8Array(screenshot.buffer), {
    headers: {
      "Content-Type": screenshot.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
