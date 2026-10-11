import "server-only";

import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import { getAuthConfig } from "@/lib/auth-config";

export async function getWorkspaceSession() {
  const requestHeaders = await headers();
  if (!getAuthConfig() || !requestHeaders.has("cookie")) return null;

  const auth = await getAuth();
  return auth.api.getSession({
    headers: requestHeaders,
    query: { disableCookieCache: true },
  });
}
