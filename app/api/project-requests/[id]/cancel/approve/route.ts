import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { approveCancellation } from "@/lib/project-requests";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const request = await approveCancellation(id, session.user.id);
    return NextResponse.json(request);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status = message === "Unauthorized" ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
