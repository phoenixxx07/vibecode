import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { selectDeveloper } from "@/lib/project-requests";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; appId: string }> }
) {
  try {
    const session = await requireAuth();
    const { id, appId } = await params;
    const body = await req.json().catch(() => ({}));
    const agreedBudgetAmount =
      body.agreedBudgetAmount != null ? Number(body.agreedBudgetAmount) : undefined;
    const request = await selectDeveloper(
      id,
      appId,
      session.user.id,
      agreedBudgetAmount
    );
    return NextResponse.json(request);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status =
      message === "Unauthorized" ? 403 : message.includes("tidak") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
