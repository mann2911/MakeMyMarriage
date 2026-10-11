import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/auth";
import { AuthConfigurationError, getAuthConfig } from "@/lib/auth-config";

export const runtime = "nodejs";

// Expose only the Google sign-in and current-session lifecycle used by this product.
const paths = {
  GET: new Set(["/get-session", "/callback/google"]),
  POST: new Set(["/sign-in/social", "/sign-out"]),
};

async function handle(request: Request) {
  const path = new URL(request.url).pathname.slice("/api/auth".length);
  const method = request.method as keyof typeof paths;
  if (!paths[method]?.has(path)) {
    return Response.json({ code: "NOT_FOUND", message: "Not found." }, { status: 404 });
  }

  try {
    const config = getAuthConfig();
    if (!config) throw new AuthConfigurationError();
    // Enforce origin even before the browser has its first authentication cookie.
    if (method === "POST" && request.headers.get("origin") !== config.baseURL) {
      return Response.json({ code: "INVALID_ORIGIN", message: "Request not allowed." }, {
        status: 403, headers: { "Cache-Control": "private, no-store" },
      });
    }
    const handlers = toNextJsHandler(await getAuth());
    const response = await handlers[method](request);
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch (error) {
    const configurationError = error instanceof AuthConfigurationError;
    return Response.json({
      code: configurationError ? "AUTH_NOT_CONFIGURED" : "AUTH_UNAVAILABLE",
      message: configurationError ? "Google sign-in is not configured yet." : "Sign-in is temporarily unavailable.",
    }, { status: 503, headers: { "Cache-Control": "private, no-store" } });
  }
}

export const GET = handle;
export const POST = handle;
