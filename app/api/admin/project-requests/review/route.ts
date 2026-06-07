import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { reviewProjectRequest } from "@/lib/project-requests";
import { projectRequestReviewSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const parsed = projectRequestReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { requestId, status, rejectionReason } = parsed.data;
    const request = await reviewProjectRequest(requestId, status, rejectionReason);
    return NextResponse.json(request);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
