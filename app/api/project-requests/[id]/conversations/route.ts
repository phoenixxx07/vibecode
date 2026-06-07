import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getConversationsForRequest } from "@/lib/project-requests";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const conversations = await getConversationsForRequest(id, session.user.id);
    return NextResponse.json({ conversations });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status = message === "Unauthorized" ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
