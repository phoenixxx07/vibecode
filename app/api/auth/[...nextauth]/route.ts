import { handlers } from "@/lib/auth";

const { GET: authGet, POST: authPost } = handlers;

function logAuthError(method: string, error: unknown) {
  const err = error as Error & { cause?: unknown; type?: string };
  console.error(`[auth] ${method} failed`, {
    type: err.type,
    message: err.message,
    cause: err.cause,
    stack: err.stack,
  });
}

export async function GET(
  request: Request,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  try {
    return await authGet(request, context);
  } catch (error) {
    logAuthError("GET", error);
    throw error;
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  try {
    return await authPost(request, context);
  } catch (error) {
    logAuthError("POST", error);
    throw error;
  }
}
