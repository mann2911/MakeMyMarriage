# MakeMyMarriage

Minimal Next.js App Router scaffold for the English-language wedding-planning application.

## Prerequisites

- Node.js 22.15.0 or newer (Node 22 baseline in `.nvmrc`).
- npm 10 or newer; use npm and `package-lock.json`.

## Install and develop

```sh
nvm use # Optional, if using nvm
npm ci
npm run dev
```

Open http://localhost:3000. The home page displays “MakeMyMarriage” and “Project setup is ready.”

No environment file or external credentials are required. `.env.example` documents this; future local credentials belong in ignored `.env.local` files.

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

- `src/app/`: root layout, global Tailwind styles, and minimal home page.
- `@/*`: import alias for `src/*`.
- [docs/](docs/): preserved product and future implementation specifications: [PRD](docs/PRD-v1.md), [architecture](docs/System-Architecture-v1.md), [database design](docs/Database-Design-v1.md), [API specification](docs/API-Specification-v1.md), [OpenAPI contract](docs/api/openapi-v1.json), [user flows](docs/User-Flows-and-Screen-Map-v1.md), and [design brief](docs/Google-Stitch-Design-Prompt-v1.md).

MongoDB, AWS S3, Google authentication, and application features are planned for later implementation. This scaffold runs independently of external services.
