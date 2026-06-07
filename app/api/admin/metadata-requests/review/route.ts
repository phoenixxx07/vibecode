import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { reviewMetadataRequest } from "@/lib/metadata-requests";
import { metadataRequestReviewSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const parsed = metadataRequestReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { requestId, status } = parsed.data;
    const result = await reviewMetadataRequest(requestId, status);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status =
      message === "Unauthorized"
        ? 401
        : message === "Forbidden"
          ? 403
          : message.includes("tidak ditemukan")
            ? 404
            : message.includes("sudah") || message.includes("diproses")
              ? 409
              : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
