# MakeMyMarriage

Next.js App Router application for the English-language wedding-planning product.

## Prerequisites

- Node.js 22.15.0 or newer (Node 22 baseline in `.nvmrc`).
- npm 10 or newer; use npm and `package-lock.json`.

## Install and develop

```sh
nvm use # Optional, if using nvm
npm ci
npm run dev
```

Open http://localhost:3000. Both `/` and `/login` display the responsive sign-in screen, adapted from the [Google Stitch design](https://stitch.withgoogle.com/projects/3392697527767388291).

The agreed flow uses Google for both sign-in and account creation. Authentication uses Better Auth with persistent MongoDB sessions. Successful sign-in opens `/app` directly. Signed-in users visiting `/` or `/login` are redirected to `/app`. Sign out from the dashboard sidebar or mobile navigation drawer to revoke the current session and return to `/login`. The dashboard requires a verified session; signed-out requests redirect to login. Old `/onboarding` links redirect to `/app`. No separate password or registration form is needed.

After signing in, http://localhost:3000/app displays the populated owner dashboard design preview, adapted from Stitch with a responsive layout and mobile navigation drawer. The profile shows the signed-in name; wedding content remains fictional data as of 15 January 2027. Event RSVP selection, task completion, event details, and adding sample families/events work within the current page; changes reset on reload. The preview does not assign owner permissions or read private wedding records. Invitations, wedding setup/membership, other feature pages, and persistent wedding data are later milestones.

To enable sign-in, configure Google OAuth and MongoDB in ignored `.env.local` using [.env.example](.env.example). Follow [Google authentication setup](docs/Google-Authentication-Setup.md) for the exact callback URI and Atlas instructions. The login UI and build still run without credentials; authentication then returns a configuration error.

## Checks and production

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

`typecheck` generates Next.js route types before running TypeScript. Run `build` before `start`; stop the development server first if it uses the same port.

Development and production builds use Next.js's supported Webpack bundler because Turbopack's local compilation process could not bind a port in the setup environment.

ESLint 9.39.5 is pinned for compatibility with Next.js's bundled lint plugins, which do not yet declare ESLint 10 support. npm marks ESLint 9 as deprecated and currently reports five high-severity audit findings in the development-only lint dependency chain. Recheck upstream compatibility and fixes when updating dependencies.

## Structure and project documents

- `src/app/`: root layout, global Tailwind styles, and sign-in page.
- `src/components/auth/`: sign-in, sign-out, and decorative botanical SVG.
- `src/app/app/` and `src/components/dashboard/`: owner dashboard preview, scoped styles, and fictional design data.
- `src/lib/`: server authentication, session checks, and browser auth client.
- `src/app/fonts/`: locally hosted Playfair Display and Plus Jakarta Sans fonts from Google Fonts, with their SIL Open Font License files.
- `@/*`: import alias for `src/*`.
- [docs/](docs/): preserved product and future implementation specifications: [PRD](docs/PRD-v1.md), [architecture](docs/System-Architecture-v1.md), [database design](docs/Database-Design-v1.md), [API specification](docs/API-Specification-v1.md), [OpenAPI contract](docs/api/openapi-v1.json), [user flows](docs/User-Flows-and-Screen-Map-v1.md), and [design brief](docs/Google-Stitch-Design-Prompt-v1.md).

MongoDB is used only for authentication at this stage. Wedding features and AWS S3 are planned for later implementation. Fonts load locally.
