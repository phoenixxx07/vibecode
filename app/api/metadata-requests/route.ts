import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createMetadataRequest } from "@/lib/metadata-requests";
import { metadataRequestSchema } from "@/lib/validators";
import { MetadataRequestKind } from "@prisma/client";

const RATE_LIMIT = new Map<string, number[]>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const window = 60 * 60 * 1000;
  const max = 10;
  const timestamps = (RATE_LIMIT.get(userId) ?? []).filter((t) => now - t < window);
  if (timestamps.length >= max) return false;
  timestamps.push(now);
  RATE_LIMIT.set(userId, timestamps);
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (!checkRateLimit(session.user.id)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Max 10 pengajuan per jam." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = metadataRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { kind, label, value, website, icon } = parsed.data;
    const request = await createMetadataRequest(session.user.id, {
      kind: kind as MetadataRequestKind,
      label,
      value: value || undefined,
      website: website || undefined,
      icon: icon || undefined,
    });

    return NextResponse.json(request, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status =
      message === "Unauthorized"
        ? 401
        : message.includes("sudah ada") || message.includes("menunggu")
          ? 409
          : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
