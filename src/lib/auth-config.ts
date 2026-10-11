import "server-only";

export function getAuthConfig() {
  const baseURL = process.env.BETTER_AUTH_URL?.trim();
  const secret = process.env.BETTER_AUTH_SECRET;
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const mongoURI = process.env.MONGODB_URI?.trim();
  const databaseName = process.env.MONGODB_DB?.trim() || "makemymarriage";

  if (!baseURL || !secret || secret.length < 32 || !clientId || !clientSecret || !mongoURI || mongoURI.includes("<db_password>")) {
    return null;
  }

  try {
    const url = new URL(baseURL);
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    if (
      (url.protocol !== "https:" && !(local && url.protocol === "http:")) ||
      url.pathname !== "/" || url.search || url.hash || url.username || url.password
    ) {
      return null;
    }
    return { baseURL: url.origin, secret, clientId, clientSecret, mongoURI, databaseName };
  } catch {
    return null;
  }
}

export class AuthConfigurationError extends Error {
  constructor() {
    super("Google sign-in is not configured yet.");
    this.name = "AuthConfigurationError";
  }
}
