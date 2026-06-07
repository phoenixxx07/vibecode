import type { NextRequest } from "next/server";

import { handlers } from "@/lib/auth";

export const runtime = "nodejs";

async function logAuthResponse(method: string, response: Response) {
  if (process.env.AUTH_DEBUG !== "true") return;
  console.info(`[auth] ${method} response`, {
    status: response.status,
    location: response.headers.get("location"),
    setCookieCount: response.headers.getSetCookie().length,
  });
}

export async function GET(request: NextRequest) {
  const response = await handlers.GET(request);
  await logAuthResponse("GET", response);
  return response;
}

export async function POST(request: NextRequest) {
  const response = await handlers.POST(request);
  await logAuthResponse("POST", response);
  return response;
}
