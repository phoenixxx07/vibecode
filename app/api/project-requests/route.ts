import { NextRequest, NextResponse } from "next/server";
import { ProjectRequestStatus } from "@prisma/client";
import { requireAuth } from "@/lib/auth";
import { getMetadataValidationValues } from "@/lib/metadata";
import {
  createProjectRequest,
  getPublicProjectRequests,
  getUserProjectRequests,
} from "@/lib/project-requests";
import { normalizePagination } from "@/lib/pagination";
import { buildProjectRequestSchema } from "@/lib/validators";

const RATE_LIMIT = new Map<string, number[]>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const window = 60 * 60 * 1000;
  const max = 5;
  const timestamps = (RATE_LIMIT.get(userId) ?? []).filter((t) => now - t < window);
  if (timestamps.length >= max) return false;
  timestamps.push(now);
  RATE_LIMIT.set(userId, timestamps);
  return true;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status") as ProjectRequestStatus | null;
    const projectType = searchParams.get("type") ?? undefined;
    const categorySlug = searchParams.get("category") ?? undefined;
    const q = searchParams.get("q") ?? undefined;
    const mine = searchParams.get("mine") === "true";
    const { page, limit } = normalizePagination(
      Number(searchParams.get("page") ?? 1),
      Number(searchParams.get("limit") ?? undefined)
    );

    if (mine) {
      const session = await requireAuth();
      const items = await getUserProjectRequests(session.user.id);
      return NextResponse.json({ items });
    }

    const validStatuses: ProjectRequestStatus[] = [
      ProjectRequestStatus.published,
      ProjectRequestStatus.in_progress,
      ProjectRequestStatus.completed,
    ];
    const filterStatus =
      status && validStatuses.includes(status) ? status : ProjectRequestStatus.published;

    const result = await getPublicProjectRequests({
      status: filterStatus,
      projectType,
      categorySlug,
      q,
      page,
      limit,
    });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const statusCode = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (!checkRateLimit(session.user.id)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Max 5 request per jam." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { projectTypes } = await getMetadataValidationValues();
    const parsed = buildProjectRequestSchema({ projectTypes }).safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const request = await createProjectRequest(session.user.id, {
      title: data.title,
      description: data.description,
      workflowDescription: data.workflowDescription,
      specifications: data.specifications || undefined,
      features: data.features,
      deadline: data.deadline,
      budgetAmount: data.budgetAmount,
      budgetCurrency: data.budgetCurrency,
      budgetNote: data.budgetNote || undefined,
      projectType: data.projectType,
      categoryIds: data.categoryIds,
    });

    return NextResponse.json(request, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const statusCode = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
