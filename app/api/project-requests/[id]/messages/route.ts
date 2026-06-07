import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { publishChatEvent } from "@/lib/chat-realtime";
import { getMessages, sendMessage } from "@/lib/project-requests";
import { projectRequestMessageSchema } from "@/lib/validators";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    await params;
    const applicationId = req.nextUrl.searchParams.get("applicationId");
    if (!applicationId) {
      return NextResponse.json({ error: "applicationId required" }, { status: 400 });
    }

    const messages = await getMessages(applicationId, session.user.id);
    return NextResponse.json({ messages });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status = message === "Unauthorized" ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id: requestId } = await params;
    const body = await req.json();
    const parsed = projectRequestMessageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const message = await sendMessage(
      parsed.data.applicationId,
      session.user.id,
      parsed.data.body
    );

    void publishChatEvent({
      type: "message",
      requestId,
      applicationId: parsed.data.applicationId,
      senderId: session.user.id,
      message: {
        id: message.id,
        body: message.body,
        createdAt: message.createdAt.toISOString(),
        sender: {
          id: message.sender.id,
          name: message.sender.name,
          email: message.sender.email,
        },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status =
      message === "Unauthorized"
        ? 403
        : message.includes("Rate limit")
          ? 429
          : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
