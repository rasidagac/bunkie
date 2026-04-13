<!--
SYNC IMPACT REPORT
==================
Version change: (none) → 1.0.0 (initial ratification)
Modified principles: N/A — first issue
Added sections:
  - I. Code Quality
  - II. Testing Standards
  - III. User Experience Consistency
  - IV. Performance Requirements
Removed sections: N/A
Templates reviewed:
  ✅ .specify/templates/plan-template.md — Constitution Check gate references principles below
  ✅ .specify/templates/spec-template.md — Success Criteria / Measurable Outcomes align with §IV
  ✅ .specify/templates/tasks-template.md — Test tasks align with §II; Polish phase aligns with §I
Follow-up TODOs: None — all placeholders resolved.
-->

# Bunkie Constitution

## Core Principles

### I. Code Quality

All production code MUST be written in TypeScript with no implicit `any`. Strict mode is
non-negotiable; the compiler is the first line of defence against runtime errors.

Rules:
- Every type-only import MUST use `import type` (enforced by `@typescript-eslint/consistent-type-imports`).
- Imports MUST be sorted alphabetically (`eslint-plugin-perfectionist`). Run `pnpm lint` before
  every commit; CI will reject non-compliant code.
- Server actions MUST live under `src/actions/{feature}/` and start with `"use server"`. They MUST
  use `src/utils/supabase/server.ts` exclusively — never the browser client.
- Browser components MUST use `src/utils/supabase/client.ts` (`NEXT_PUBLIC_*` keys only). Mixing
  server and client Supabase instances is a hard failure.
- Path aliases (`@/*`, `@lib/*`, `@ui/*`, `@actions/*`) MUST be used; relative `../../` imports
  crossing feature or layer boundaries are disallowed.
- Code MUST NOT introduce OWASP Top-10 vulnerabilities. SQL queries go through the Supabase client
  only — raw string concatenation into queries is forbidden.
- Dead code and backwards-compatibility shims MUST be deleted outright, not commented out or
  prefixed with underscore.

### II. Testing Standards

Every user-facing acceptance scenario documented in a spec MUST have a corresponding test before
the feature is merged. Tests that cannot be run in isolation are not tests.

Rules:
- Acceptance tests MUST be written and confirmed failing (red) before implementation begins (TDD).
- Tests against Supabase MUST hit a real Supabase instance (local via `supabase start` or a
  dedicated branch). Mocking the database is prohibited; mock/prod divergence has historically
  masked broken migrations.
- Server actions MUST be covered by integration tests that exercise the full request → database
  → response path, including RLS policies.
- UI tests MUST exercise the golden path and at least one error/edge case per user story.
- Test files MUST reside alongside the code they test (`*.test.ts` / `*.test.tsx`) or under
  `tests/` for integration suites.
- A feature is not "done" until all its acceptance scenarios pass and `pnpm lint` exits cleanly.

### III. User Experience Consistency

Bunkie users are non-technical housemates managing shared money. Every interaction MUST feel
predictable, accessible, and trustworthy.

Rules:
- All UI components MUST be built from `shadcn/ui` (New York style) imported via `@ui/`. New
  one-off components are only permitted when shadcn/ui has no equivalent.
- Forms MUST use React Hook Form + Zod for validation. Inline validation messages MUST appear
  adjacent to the offending field, not in a top-level banner alone.
- Toast notifications (via the global `Toaster` in `src/app/layout.tsx`) are the standard channel
  for async feedback (success, error, loading). Duplicate or competing notification systems are
  disallowed.
- Protected routes MUST be listed in `src/utils/supabase/middleware.ts`. An unauthenticated user
  hitting a protected route MUST be redirected to `/auth/login` — silent 404s or blank screens are
  failures.
- Tailwind classes MUST be ordered by `prettier-plugin-tailwindcss`. Manually ordered or
  arbitrarily sorted class strings are rejected in review.
- Dark-mode and light-mode states MUST be tested via `ThemeProvider` before shipping any new page.

### IV. Performance Requirements

Bunkie is a financial tool; users check balances on mobile over variable connections. Perceived
speed directly affects trust.

Rules:
- Core Web Vitals targets (measured in production via Vercel Analytics or Lighthouse CI):
  - LCP ≤ 2.5 s on a simulated mobile 4G connection.
  - CLS < 0.1 across all pages.
  - INP ≤ 200 ms for any user interaction.
- Server Components MUST be the default rendering strategy. Client Components (`"use client"`) are
  only introduced when interactivity or browser APIs require it; every `"use client"` boundary MUST
  be justified in the PR description.
- Images served from Vercel Blob MUST use `next/image` with explicit `width`/`height` or `fill`
  to prevent layout shift.
- Redux state MUST only hold data that is genuinely shared across multiple, non-parent-child
  components. Local or server state is preferred otherwise.
- Bundle size regressions > 10 kB (gzip) on any page route require explicit sign-off in the PR.

## Quality Gates

These gates apply to every pull request targeting `main`.

1. `pnpm lint` exits with code 0 (covers ESLint + Prettier + type-check).
2. `pnpm build` completes without errors or type failures.
3. All acceptance tests for modified or new features pass.
4. No new OWASP Top-10 vulnerability introduced (reviewed manually or via automated scan).
5. Core Web Vitals targets are not regressed (spot-check with Lighthouse on the affected routes).

## Development Workflow

- New protected routes: add path to `protectedRoutes` in middleware before any UI work.
- Schema changes: run `pnpm update-types` immediately after migration and commit the updated
  `src/database.types.ts` in the same PR.
- Feature branches target `main`. Branch names follow `{issue-id}/{short-description}`.
- Commit messages follow Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, etc.).

## Governance

This constitution supersedes all prior verbal conventions and ad-hoc code-review norms. It applies
to every contributor and every automated agent working in this repository.

**Amendment procedure**:
1. Open a PR with the proposed change to this file.
2. Describe the motivation and any migration required for existing code.
3. Increment the version using semantic rules:
   - MAJOR — removing or fundamentally redefining a principle.
   - MINOR — adding a new principle or materially expanding an existing one.
   - PATCH — clarifications, wording fixes, non-semantic refinements.
4. Merge requires at least one reviewer who is not the author.

All plan Constitution Check gates (`plan-template.md §Constitution Check`) MUST reference the
principles in this document by Roman-numeral heading (I–IV).

Complexity that violates a principle MUST be justified in the plan's Complexity Tracking table
before implementation begins.

**Version**: 1.0.0 | **Ratified**: 2026-04-13 | **Last Amended**: 2026-04-13
