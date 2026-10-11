import "server-only";

import { betterAuth } from "better-auth/minimal";
import { verifyGoogleIdToken, type GoogleProfile } from "better-auth/social-providers";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";
import { AuthConfigurationError, getAuthConfig } from "@/lib/auth-config";

type AuthConfig = NonNullable<ReturnType<typeof getAuthConfig>>;

function createAuth(config: AuthConfig, client: MongoClient) {
  return betterAuth({
    appName: "MakeMyMarriage",
    baseURL: config.baseURL,
    basePath: "/api/auth",
    secret: config.secret,
    trustedOrigins: [config.baseURL],
    database: mongodbAdapter(client.db(config.databaseName), { client }),
    socialProviders: {
      google: {
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        accessType: "online",
        prompt: "select_account",
        includeGrantedScopes: false,
        disableIdTokenSignIn: true,
        overrideUserInfoOnSignIn: true,
        async getUserInfo(tokens) {
          if (!tokens.idToken) return null;
          // Verify the back-channel token too, using the library's Google verifier.
          const claims = await verifyGoogleIdToken({ token: tokens.idToken, audience: config.clientId });
          if (!claims || typeof claims.sub !== "string" || !claims.sub || typeof claims.email !== "string" || !claims.email) {
            return null;
          }
          return {
            user: {
              name: typeof claims.name === "string" ? claims.name : claims.email,
              email: claims.email,
              image: typeof claims.picture === "string" ? claims.picture : undefined,
              emailVerified: claims.email_verified === true,
            },
            // Stable subject and email are checked above; remaining Google profile fields are optional for this app.
            data: claims as unknown as GoogleProfile,
          };
        },
      },
    },
    user: {
      modelName: "users",
      validateUserInfo({ user, source }) {
        if (source.method !== "oauth" || source.oauth?.providerId !== "google") {
          return { error: "google_sign_in_required" };
        }
        if (user.emailVerified !== true || source.oauth.profile?.email_verified !== true) {
          return { error: "email_not_verified" };
        }
      },
    },
    session: {
      modelName: "authSessions",
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      // Read the database on every request so deleted sessions stop working immediately.
      cookieCache: { enabled: false },
    },
    account: {
      modelName: "authAccounts",
      accountLinking: { enabled: false },
      updateAccountOnSignIn: false,
      storeAccountCookie: false,
      storeStateStrategy: "database",
    },
    verification: { modelName: "authVerifications" },
    databaseHooks: {
      account: {
        create: {
          async before(account) {
            // Google identifies the user; this app does not call Google APIs afterwards.
            return {
              data: {
                ...account,
                accessToken: null,
                refreshToken: null,
                idToken: null,
                accessTokenExpiresAt: null,
                refreshTokenExpiresAt: null,
              },
            };
          },
        },
      },
    },
    rateLimit: {
      enabled: true,
      storage: "database",
      modelName: "authRateLimits",
      window: 60,
      max: 100,
      customRules: { "/sign-in/social": { window: 60, max: 10 } },
    },
    advanced: { cookiePrefix: "makemymarriage" },
    onAPIError: { errorURL: `${config.baseURL}/login` },
    // Library errors can include OAuth state and provider responses; keep those out of logs.
    logger: {
      level: "warn",
      log(level) {
        if (level === "error") console.error("[auth] Authentication request failed.");
        if (level === "warn") console.warn("[auth] Authentication configuration or request warning.");
      },
    },
    telemetry: { enabled: false },
  });
}

type Auth = ReturnType<typeof createAuth>;
const authGlobal = globalThis as typeof globalThis & {
  makeMyMarriageAuth?: Promise<Auth>;
};

export async function getAuth(): Promise<Auth> {
  const config = getAuthConfig();
  if (!config) throw new AuthConfigurationError();

  if (!authGlobal.makeMyMarriageAuth) {
    authGlobal.makeMyMarriageAuth = (async () => {
      const client = new MongoClient(config.mongoURI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
        maxPoolSize: 10,
      });
      try {
        await client.connect();
        const db = client.db(config.databaseName);
        // The provider subject owns identity; email is only a verified profile attribute.
        await db.collection("authAccounts").createIndex(
          { providerId: 1, accountId: 1 }, { unique: true, name: "provider_identity_unique" },
        );
        await db.collection("authAccounts").createIndex(
          { userId: 1 }, { unique: true, name: "one_google_account_per_user" },
        );
        await db.collection("authSessions").createIndex(
          { expiresAt: 1 }, { expireAfterSeconds: 0, name: "expired_sessions" },
        );
        await db.collection("authVerifications").createIndex(
          { expiresAt: 1 }, { expireAfterSeconds: 0, name: "expired_oauth_state" },
        );
        return createAuth(config, client);
      } catch (error) {
        await client.close();
        throw error;
      }
    })();
    // A failed connection must not permanently prevent retrying after configuration is fixed.
    authGlobal.makeMyMarriageAuth.catch(() => {
      authGlobal.makeMyMarriageAuth = undefined;
    });
  }
  return authGlobal.makeMyMarriageAuth;
}
