<!--
SYNC IMPACT REPORT
==================
Version change: 1.0.0 → 1.1.0
Version bump rationale: MINOR — materially expanded all four principles with
  expense-sharing–specific rules; no principles removed or redefined.
Modified principles:
  - I. Code Quality → added financial data handling rules and money type strictness
  - II. Testing Standards → added split calculation and RLS-specific test requirements
  - III. User Experience Consistency → added balance display, split preview, settlement
    confirmation, and destructive action rules
  - IV. Performance Requirements → added server-side balance fetch and mobile-first rule
Added sections: none
Removed sections: none
Templates reviewed:
  ✅ .specify/templates/plan-template.md — Constitution Check gate references I–IV below
  ✅ .specify/templates/spec-template.md — Success Criteria align with §III and §IV
  ✅ .specify/templates/tasks-template.md — Test tasks align with §II; Polish aligns with §I
Follow-up TODOs: none — all placeholders resolved.
-->

# Bunkie Constitution

## Core Principles

### I. Code Quality

Bunkie handles real money between real people. Code MUST be written as if a financial
audit could happen at any time: explicit types, no silent failures, no shortcuts around
the data layer.

Rules:
- All production code MUST be TypeScript with strict mode enabled and zero implicit `any`.
  Money amounts MUST use explicit numeric types — never loosely typed or cast from string
  without validation.
- Every type-only import MUST use `import type`
  (`@typescript-eslint/consistent-type-imports`).
- Imports MUST be sorted alphabetically (`eslint-plugin-perfectionist`). Run `pnpm lint`
  before every commit; CI will reject non-compliant code.
- Server actions MUST live under `src/actions/{feature}/`, start with `"use server"`, and
  use `src/utils/supabase/server.ts` exclusively. The browser client is never called from
  server code.
- Browser components MUST use `src/utils/supabase/client.ts` (`NEXT_PUBLIC_*` keys only).
  Mixing server and client Supabase instances is a hard failure.
- Path aliases (`@/*`, `@lib/*`, `@ui/*`, `@actions/*`) MUST be used; relative `../../`
  imports crossing feature or layer boundaries are disallowed.
- Code MUST NOT introduce OWASP Top-10 vulnerabilities. All database access goes through
  the Supabase client — raw string concatenation into queries is forbidden.
- Dead code and backwards-compatibility shims MUST be deleted outright, not commented out
  or prefixed with underscore.
- Financial calculations (splits, balance aggregations) MUST live in a single, tested
  utility or server action — never duplicated across components.

### II. Testing Standards

Bunkie manages shared finances; a bug in split calculation or balance display is a
trust-breaking event. Every acceptance scenario MUST be provably correct before shipping.

Rules:
- Acceptance tests MUST be written and confirmed failing (red) before implementation
  begins (TDD).
- Tests against Supabase MUST hit a real Supabase instance (local via `supabase start` or
  a dedicated branch). Mocking the database is prohibited; mock/prod divergence has
  historically masked broken migrations.
- Server actions MUST be covered by integration tests that exercise the full
  request → database → response path, including RLS policies.
- Split calculation logic MUST be unit-tested with boundary cases: zero amount, single
  member, maximum members, non-divisible amounts (penny rounding).
- The `group_balances` and `group_transactions` views MUST be exercised by integration
  tests that verify correct aggregation after expenses and payments.
- UI tests MUST cover the golden path and at least one error/edge case per user story.
- Test files MUST reside alongside the code they test (`*.test.ts` / `*.test.tsx`) or
  under `tests/` for integration suites.
- A feature is not "done" until all acceptance scenarios pass and `pnpm lint` exits 0.

### III. User Experience Consistency

Bunkie users are non-technical housemates managing shared money. The UI MUST be
predictable, transparent about financial state, and never leave a user uncertain about
who owes what.

Rules:
- All UI components MUST be built from `shadcn/ui` (New York style) via `@ui/`. New
  one-off components are only permitted when shadcn/ui has no equivalent.
- Forms MUST use React Hook Form + Zod. Inline validation messages MUST appear adjacent
  to the offending field, not only in a top-level banner.
- Toast notifications (via the global `Toaster` in `src/app/layout.tsx`) are the standard
  channel for async feedback (success, error, loading). Duplicate or competing
  notification systems are disallowed.
- Balance displays MUST always show currency, sign (positive = owed to group, negative =
  group owes you), and the counterparty name. Ambiguous unsigned amounts are a UX failure.
- Expense split breakdowns MUST be visible before a user confirms an expense. A user
  MUST never be surprised by their share after submission.
- Settlement flows (payments between members) MUST show a confirmation step with the
  exact amount, payer, and receiver before committing.
- Protected routes MUST be listed in `src/utils/supabase/middleware.ts`. An
  unauthenticated user hitting a protected route MUST be redirected to `/auth/login` —
  silent 404s or blank screens are failures.
- Tailwind classes MUST be ordered by `prettier-plugin-tailwindcss`. Manually ordered
  class strings are rejected in review.
- Dark-mode and light-mode states MUST be tested via `ThemeProvider` before shipping any
  new page.
- Destructive actions (deleting an expense, marking splits settled) MUST require explicit
  confirmation. No single-click destructive interactions.

### IV. Performance Requirements

Bunkie is a financial tool; users check balances on mobile over variable connections.
Perceived speed directly affects trust. A slow balance screen feels like a broken app.

Rules:
- Core Web Vitals targets (measured via Vercel Analytics or Lighthouse CI):
  - LCP ≤ 2.5 s on a simulated mobile 4G connection.
  - CLS < 0.1 across all pages.
  - INP ≤ 200 ms for any user interaction.
- Server Components MUST be the default rendering strategy. `"use client"` boundaries are
  only introduced when interactivity or browser APIs require it; every boundary MUST be
  justified in the PR description.
- Images served from Vercel Blob MUST use `next/image` with explicit `width`/`height` or
  `fill` to prevent layout shift.
- Balance and transaction data MUST be fetched server-side on initial load — no
  client-side waterfall for the primary financial view.
- Redux state MUST only hold data genuinely shared across multiple non-parent-child
  components. Local or server state is preferred otherwise.
- Bundle size regressions > 10 kB (gzip) on any page route require explicit sign-off
  in the PR.

## Quality Gates

These gates apply to every pull request targeting `main`.

1. `pnpm lint` exits with code 0 (covers ESLint + Prettier + type-check).
2. `pnpm build` completes without errors or type failures.
3. All acceptance tests for modified or new features pass.
4. Split calculation and balance view tests pass with no regressions.
5. No new OWASP Top-10 vulnerability introduced (reviewed manually or via automated scan).
6. Core Web Vitals targets are not regressed (spot-check with Lighthouse on affected routes).

## Development Workflow

- New protected routes: add path to `protectedRoutes` in middleware before any UI work.
- Schema changes: run `pnpm update-types` immediately after migration and commit the
  updated `src/database.types.ts` in the same PR.
- Feature branches target `main`. Branch names follow `{issue-id}/{short-description}`.
- Commit messages follow Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, etc.).

## Governance

This constitution supersedes all prior verbal conventions and ad-hoc code-review norms.
It applies to every contributor and every automated agent working in this repository.

**Amendment procedure**:
1. Open a PR with the proposed change to this file.
2. Describe the motivation and any migration required for existing code.
3. Increment the version using semantic rules:
   - MAJOR — removing or fundamentally redefining a principle.
   - MINOR — adding a new principle or materially expanding an existing one.
   - PATCH — clarifications, wording fixes, non-semantic refinements.
4. Merge requires at least one reviewer who is not the author.

All plan Constitution Check gates (`plan-template.md §Constitution Check`) MUST reference
the principles in this document by Roman-numeral heading (I–IV).

Complexity that violates a principle MUST be justified in the plan's Complexity Tracking
table before implementation begins.

**Version**: 1.1.0 | **Ratified**: 2026-04-13 | **Last Amended**: 2026-04-24
