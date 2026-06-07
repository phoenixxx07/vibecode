import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/products";
import { getPublicProjectRequests } from "@/lib/project-requests";
import { normalizePagination } from "@/lib/pagination";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q");
  if (!q) {
    return NextResponse.json({
      products: [],
      total: 0,
      page: 1,
      limit: 50,
      totalPages: 0,
      projectRequests: [],
      requestTotal: 0,
      requestTotalPages: 0,
    });
  }

  try {
    const { page, limit } = normalizePagination(
      Number(searchParams.get("page") ?? 1),
      Number(searchParams.get("limit") ?? undefined)
    );
    const [result, requestResult] = await Promise.all([
      getProducts({ q, page, limit }),
      getPublicProjectRequests({ q, page, limit }),
    ]);
    return NextResponse.json({
      ...result,
      projectRequests: requestResult.items,
      requestTotal: requestResult.total,
      requestTotalPages: requestResult.totalPages,
    });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}