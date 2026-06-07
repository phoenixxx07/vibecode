import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { canViewRequest, getProjectRequestById } from "@/lib/project-requests";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const request = await getProjectRequestById(id);
    if (!request) {
      return NextResponse.json({ error: "Request tidak ditemukan" }, { status: 404 });
    }

    const session = await auth();
    const viewerId = session?.user?.id;
    const isAdmin = session?.user?.role === "admin";

    if (!canViewRequest(request, viewerId, isAdmin)) {
      return NextResponse.json({ error: "Request tidak ditemukan" }, { status: 404 });
    }

    const isOwner = viewerId === request.requesterId;
    const isAssignedDev = viewerId === request.assignedDeveloperId;
    const showPrivate =
      isOwner || isAdmin || isAssignedDev || request.applications.some((a) => a.developerId === viewerId);

    if (!showPrivate && viewerId) {
      return NextResponse.json({
        ...request,
        applications: [],
      });
    }

    if (!viewerId) {
      return NextResponse.json({
        ...request,
        applications: [],
      });
    }

    return NextResponse.json(request);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
