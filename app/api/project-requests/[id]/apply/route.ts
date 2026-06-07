import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { applyToProjectRequest } from "@/lib/project-requests";
import { projectRequestApplicationSchema } from "@/lib/validators";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const parsed = projectRequestApplicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const application = await applyToProjectRequest(
      id,
      session.user.id,
      parsed.data.pitchMessage || undefined
    );
    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status =
      message === "Unauthorized"
        ? 401
        : message.includes("sudah") || message.includes("Tidak bisa")
          ? 409
          : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
