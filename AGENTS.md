# Repository Guidelines

## Project Structure & Module Organization
- `src/app`: Next.js App Router pages, layouts, and global styles.
- `src/lib`: shared utilities (e.g., `database.ts` using LowDB JSON storage).
- `server/`: custom Node server bootstrapping Next.js + Socket.IO (`server/index.ts`).
- `public/`: static assets.
- `tests/`: `unit/` (Vitest) and `e2e/` (Playwright).
- Local data: LowDB writes `db.json` in the repo root for dev; do not commit it.

## Build, Test, and Development Commands
- `npm run dev`: start the custom Next.js server in development.
- `npm run build`: compile the Next.js app for production.
- `npm start`: run the production server.
- `npm run lint`: lint with ESLint (Next + TypeScript rules).
- `npm run test:unit`: run unit tests with Vitest.
- `npm run test:e2e`: run Playwright end‑to‑end tests (starts dev server).
- `npm run test:e2e:ui`: open Playwright UI runner.
- `npm run format` / `format:check`: apply or verify Prettier formatting.

## Coding Style & Naming Conventions
- TypeScript everywhere; React 19 + Next 15 App Router.
- Formatting: Prettier (2‑space indent, single quotes, semicolons, width 100).
- Linting: ESLint extends `next/core-web-vitals`, `next/typescript`, `prettier`.
- Components: PascalCase; helpers/util files: camelCase. Route files follow Next (`page.tsx`, `layout.tsx`).
- Imports: prefer `@/…` path alias to reference `src/`.

## Testing Guidelines
- Unit: Vitest; files `tests/unit/**/*.test.ts(x)`.
- E2E: Playwright; files `tests/e2e/**/*.spec.ts`.
- No strict coverage threshold enforced; add tests for new code and bug fixes.
- Tip: if Playwright fails locally, run `npx playwright install` once.

## Commit & Pull Request Guidelines
- Commits: imperative, concise subjects; Conventional Commits (e.g., `feat:`, `fix:`) preferred, as seen in history.
- PRs: include a clear description, linked issues, screenshots for UI changes, and notes on testing.
- Quality gates: `npm run lint`, `npm run test:unit`, and `npm run test:e2e` must pass; run `npm run format` before pushing.

## Security & Configuration Tips
- Environment: `NODE_ENV` controls dev/prod; no secret keys required by default.
- Data: treat `db.json` as local dev state; avoid committing it and never store sensitive data there.
