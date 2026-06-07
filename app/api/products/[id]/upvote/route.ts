import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id: productId } = await params;

    const existing = await prisma.upvote.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.$transaction([
        prisma.upvote.delete({ where: { id: existing.id } }),
        prisma.product.update({
          where: { id: productId },
          data: { upvoteCount: { decrement: 1 } },
        }),
      ]);

      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { upvoteCount: true },
      });

      return NextResponse.json({
        upvoted: false,
        upvoteCount: product?.upvoteCount ?? 0,
      });
    }

    await prisma.$transaction([
      prisma.upvote.create({
        data: { userId: session.user.id, productId },
      }),
      prisma.product.update({
        where: { id: productId },
        data: { upvoteCount: { increment: 1 } },
      }),
    ]);

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { upvoteCount: true },
    });

    return NextResponse.json({
      upvoted: true,
      upvoteCount: product?.upvoteCount ?? 0,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
