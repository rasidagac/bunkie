<!-- .github/copilot-instructions.md - Project-specific guidance for AI coding agents -->

# Bunkie — AI coding assistant instructions

Quick orientation (what matters): this is a Next.js (App Router) TypeScript app using Supabase for auth/data and Tailwind/UI primitives under `src/`. The project uses `pnpm` as the package manager.

Key workflows

- Development server: `pnpm dev` (or `npm run dev`). Note: `dev` runs `next dev` with `NODE_OPTIONS='--inspect'` (inspect/debug enabled).
- Build: `pnpm build` (`next build`).
- Lint: `pnpm lint`.

Secrets & environment

- Supabase important env vars: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` — required by `src/utils/supabase/*`. Builds or server code will throw if missing.

Architecture & data flow (high level)

- App Router: `src/app/` contains the Next.js App Router layout structure. There are explicit route groupings: `(protected)` and `(public)` layouts. Use these to place authenticated vs public pages.
- Server vs client contexts:
  - Server utilities and server actions live under `src/actions/*` and include `"use server"` directives (example: `src/actions/groups/getCurrentGroup.ts`). These call `src/utils/supabase/server.ts` to create an authenticated Supabase server client.
  - Browser client for interactive components is created via `src/utils/supabase/client.ts` and uses `process.env.NEXT_PUBLIC_*` keys.
- Authentication and session handling:
  - Middleware `src/middleware.ts` delegates to `src/utils/supabase/middleware.ts` to keep Supabase session cookies in sync and guard protected routes (routes under `/groups` are considered protected).
  - Supabase server client uses Next.js `cookies()` (server) or request cookies (middleware) to read/set auth cookies.

Project-specific conventions and patterns

- Feature grouping: server actions and related helpers are grouped by feature under `src/actions/{auth,groups,expenses,...}`. When adding a new feature, follow this grouping.
- Server actions: mark files with `"use server"` at top for code intended to run on the server. See `src/actions/groups/getCurrentGroup.ts` for an example that reads `cookies()` and calls `createClient()`.
- Supabase clients:
  - Use `src/utils/supabase/server.ts` for server-side calls that need cookie-aware auth.
  - Use `src/utils/supabase/client.ts` for browser/client usage.
- UI primitives: shared UI components and patterns live in `src/components/` and `src/ui/` (shadcn-like primitives). Prefer reusing `src/ui/*` components rather than inventing new layout primitives.
- Routing structure: the app uses `app/layout.tsx` and nested group layouts (e.g., `src/app/(protected)/layout.tsx`) — place global providers in `src/app/layout.tsx` or `src/providers/*`.

Debugging & local dev tips

- To debug server-side code, use the `dev` script (it starts Node with `--inspect`). Attach debugger to the default port if needed.
- When working with supabase auth flows, ensure browser cookies are set; middleware will redirect unauthenticated users to `/auth/login` for protected routes.

Files to inspect for details (starter checklist)

- `src/utils/supabase/server.ts` — server client creation and cookie sync
- `src/utils/supabase/client.ts` — browser client creation
- `src/utils/supabase/middleware.ts` — session update and protected route logic
- `src/middleware.ts` — global matcher/exclusions for middleware
- `src/actions/**` — feature server actions (look for `"use server"`)
- `src/app/(protected)/layout.tsx` and `src/app/(public)/layout.tsx` — route grouping and providers
- `src/components` and `src/ui` — shared UI primitives
- `package.json` — scripts, `pnpm` package manager

What to avoid / common pitfalls

- Do not call the browser client (`createBrowserClient`) on the server — use the server helper instead.
- Middleware expects `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`; missing those causes runtime errors.
- The project's protected route list is defined in `src/utils/supabase/middleware.ts` (currently lists `/groups`); update there when adding new protected top-level paths.

Examples

- Server action pattern (read cookies, create server client): `src/actions/groups/getCurrentGroup.ts`.
- Middleware pattern (redirect if unauthenticated): `src/utils/supabase/middleware.ts`.

If you need to make changes

- Keep changes minimal and consistent with existing structure (feature folders, `use server` for server actions).
- Run `pnpm dev` locally to validate routes and auth flows; run `pnpm build` to verify production build.

Questions for the repo owner

- Are there any other environment variables (service role, preview keys) used during CI or in Vercel configuration that should be documented here?
- Should additional protected routes be added to `src/utils/supabase/middleware.ts` (it currently only protects `/groups`)?

Please review and tell me which areas need more detail (CI, deployment, or additional conventions).
