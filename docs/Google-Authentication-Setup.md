# Google authentication

This milestone connects the Stitch sign-in screen to Google using Better Auth 1.7.7 and its MongoDB adapter. The same action signs in returning users and creates first-time accounts. Successful sign-in opens the protected dashboard at `/app` directly. The profile shows the signed-in account name; dashboard wedding data is still fictional. Google login does not create a wedding or assign a role. Old `/onboarding` links redirect to `/app`.

## Local configuration

Use the ignored repository-root `.env.local`. If it does not exist, copy `.env.example` and generate `BETTER_AUTH_SECRET` with `openssl rand -base64 32`. Keep the generated secret stable between restarts. Never paste secrets into chat or commit them.

| Variable | Value |
| --- | --- |
| `BETTER_AUTH_URL` | `http://localhost:3000` |
| `BETTER_AUTH_SECRET` | Random secret of at least 32 characters |
| `GOOGLE_CLIENT_ID` | Google OAuth Web application client ID |
| `GOOGLE_CLIENT_SECRET` | That application's client secret |
| `MONGODB_URI` | MongoDB connection string, including the database user's credentials |
| `MONGODB_DB` | `makemymarriage` |

No variable uses `NEXT_PUBLIC_`. The Stitch API key is unrelated to Google OAuth.

### Google Cloud

1. Create/select a project in [Google Cloud Console](https://console.cloud.google.com/).
2. Open Google Auth Platform. Configure Branding with the application name, support email, and developer contact. Configure Audience for the intended Google accounts; while testing, add your own account under Test users if required by the selected audience mode.
3. Under Clients, create an OAuth client with application type **Web application**.
4. Set the authorized JavaScript origin to `http://localhost:3000`.
5. Set the authorized redirect URI to **`http://localhost:3000/api/auth/callback/google`**.
6. Put the client ID and client secret in `.env.local`. The application requests only `openid`, `email`, and `profile`; no Google API enablement, offline access, or Drive/Gmail permissions are needed.

Use `localhost` in the browser, not `127.0.0.1`, so the origin, OAuth state cookies, and callback match. For a future deployment, use its HTTPS origin in `BETTER_AUTH_URL` and register its exact Google callback URI separately.

See the [Better Auth Google setup guide](https://better-auth.com/docs/authentication/google) and [Google's OAuth web-server documentation](https://developers.google.com/identity/protocols/oauth2/web-server).

### MongoDB Atlas

1. Create a cluster. Atlas provides the replica-set transactions used by the authentication adapter.
2. Create a database user with `readWrite` access to `makemymarriage`.
3. Add the development machine's IP under Network Access.
4. Copy the Drivers connection string, substitute the database user's username/password, and set `MONGODB_URI` in `.env.local`. URL-encode special characters in credentials. Set `MONGODB_DB=makemymarriage`.

A local MongoDB installation must run as a replica set; a standalone server is insufficient. Authentication creates its collections and indexes on first use. No manual migration or seed is needed. Connection errors fail closed and allow retry rather than leaving a permanently failed connection cached.

## Run and verify

```sh
npm ci
npm run dev
```

After changing environment values, restart the server. Open `http://localhost:3000/login`, continue with Google, and confirm that `/app` displays the dashboard and signed-in name. Reload to verify persistence; `/login` and `/` should redirect to `/app` while signed in. Sign out using the desktop sidebar or mobile navigation drawer and confirm that the browser returns to `/login`. Opening `/app` again must redirect to `/login`; signing out revokes only the current session, preserving the account. Test browser Back after logout too: it must not restore an active authenticated session.

Also test a returning sign-in, cancelling at Google, and signing in with another Google account. Missing configuration leaves the login UI accessible and shows a useful error when sign-in is attempted. Lint, type checking, and production builds do not require live Google or MongoDB credentials.

## Storage and security boundary

The physical collection mapping implements the logical model described in [Database Design](Database-Design-v1.md):

| Collection | Purpose |
| --- | --- |
| `users` | Better Auth profile: ObjectId `_id`, name, normalized email, verified-email flag, image, timestamps |
| `authAccounts` | Google `accountId` is the verified stable `sub`; unique `(providerId, accountId)` and unique `userId` bind one identity to one application user |
| `authSessions` | Library-managed random session token, userId, expiry, timestamps and request metadata |
| `authVerifications` | Short-lived OAuth state/PKCE data; TTL cleanup |
| `authRateLimits` | Shared database-backed rate-limit counters |

Better Auth owns the token/cookie representation. Its database adapter stores the session token rather than the logical model's proposed `sessionTokenHash`; the browser cookie is signed and HttpOnly. Protect database access as credential access. Cookies use the `makemymarriage` prefix, SameSite=Lax, and Secure on HTTPS. Cookie session caching is disabled: expiry and database revocation are checked on each session read. TTL cleanup is supplementary, not an authorization check.

Google verifies account ownership. The library owns the authorization-code exchange, state cookie binding, and PKCE; its Google ID-token verifier also validates signature, issuer, audience, expiry, and maximum token age before claims are used. Direct client-submitted ID-token sign-in is disabled. Unverified email claims are rejected before account creation or sign-in. Returning profile changes update the same user identified by Google `sub`; an email match does not link a different Google identity. Account linking and password authentication are disabled. Google access, refresh, and ID tokens are cleared before account storage because no application feature needs Google API access.

Only sign-in, Google callback, session-read, and current-session sign-out routes are exposed under `/api/auth/*`. Every POST requires the configured application origin, including the first sign-in before any cookie exists. Auth adapter CSRF protections remain enabled. Login initiation is limited to 10 requests/minute, with database-backed counters; behind a future proxy, configure trusted client-IP headers to prevent all users sharing the fallback bucket. No permissive CORS or proxy trust is configured here. Responses containing authentication data are private/no-store. Future domain services must perform their own current session and membership checks; this milestone grants no wedding access or owner/viewer role.

References: [Next.js integration](https://better-auth.com/docs/integrations/next), [MongoDB adapter](https://better-auth.com/docs/adapters/mongo), [session management](https://better-auth.com/docs/concepts/session-management), and [rate limiting](https://better-auth.com/docs/concepts/rate-limit).
