import { NextResponse } from "next/server";
import { getDeveloperPortfolio } from "@/lib/developers";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const portfolio = await getDeveloperPortfolio(id);
    if (!portfolio) {
      return NextResponse.json({ error: "Developer tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(portfolio);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
