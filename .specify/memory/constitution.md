<!--
SYNC IMPACT REPORT
==================
Version change: 1.0.0 → 1.1.0
Modified principles:
  - II. Testing Standards → II. Test-First Verification
  - III. User Experience Consistency → III. Predictable User Experience
  - IV. Performance Requirements → V. Performance & Responsiveness
Added sections:
  - IV. Data Integrity & Security
Removed sections: N/A
Templates reviewed:
  ✅ .specify/templates/plan-template.md — Constitution Check remains aligned with Roman-numeral principle references
  ✅ .specify/templates/spec-template.md — Mandatory user stories / measurable outcomes remain compatible with the updated principles
  ✅ .specify/templates/tasks-template.md — Phase/task organization still matches test-first and polish requirements
  ✅ .specify/templates/commands/*.md — No command templates present in this workspace
Follow-up TODOs: None.
-->

# Bunkie Constitution

## Core Principles

### I. Code Quality

Production code MUST be TypeScript-first, strictly typed, and easy to reason about. The compiler,
lint rules, and file boundaries are part of the design, not optional cleanup.

Rules:
- All production code MUST compile without implicit `any` and without disabled type checks.
- Every type-only import MUST use `import type`, and imports MUST remain alphabetized.
- Server actions MUST live under `src/actions/{feature}/`, start with `"use server"`, and use
  `src/utils/supabase/server.ts` only.
- Browser code MUST use `src/utils/supabase/client.ts` only; server-only helpers MUST never leak
  into client components.
- Path aliases (`@/*`, `@lib/*`, `@ui/*`, `@actions/*`) MUST be used for cross-layer imports.
- Code MUST avoid raw query string construction, hidden side effects, and dead compatibility shims.
- Every PR MUST leave the codebase in a state where `pnpm lint` and `pnpm build` can pass.

### II. Test-First Verification

Every user-visible behavior change MUST be expressed as an automated test before merge. If a story
cannot be tested in isolation, the design is not ready.

Rules:
- Acceptance scenarios in the spec MUST map to tests before implementation begins.
- New tests MUST fail before code is written when the change is feasible to drive with TDD.
- Supabase-related behavior MUST be validated against a real database instance or branch; mocking
  persistence is not acceptable for feature verification.
- Server actions MUST have integration coverage that exercises request, database, and response
  behavior, including RLS-sensitive flows.
- UI work MUST cover the primary journey plus at least one error or edge case per story.
- A feature is not complete until the relevant tests pass and lint is clean.

### III. Predictable User Experience

Bunkie serves housemates who need clear, low-friction money flows. The UI MUST feel consistent,
accessible, and unsurprising across devices and themes.

Rules:
- Shared UI MUST come from `shadcn/ui` primitives via `@ui/` unless no equivalent exists.
- Forms MUST use React Hook Form + Zod, and field-level validation messages MUST appear next to the
  invalid input.
- Async feedback MUST use the global toast channel in `src/app/layout.tsx`; competing notification
  systems are not allowed.
- Protected routes MUST be registered in `src/utils/supabase/middleware.ts`, and unauthenticated
  users MUST redirect to `/auth/login`.
- Money-related screens MUST use consistent currency, amount, and balance formatting across pages.
- Dark and light themes MUST render correctly, and mobile layouts MUST remain usable without
  horizontal scrolling.
- Tailwind class ordering MUST remain compatible with `prettier-plugin-tailwindcss`.

### IV. Data Integrity & Security

Shared expense data is the product. Any inconsistency in permissions, balances, or schema contracts
is a user-facing defect.

Rules:
- Supabase row-level security is the source of truth for access control.
- Server actions MUST validate ownership and group membership before mutating shared data.
- Environment variables MUST only come from documented project keys; secret values MUST never be
  embedded in source or logs.
- Schema changes MUST be followed by type regeneration and review of affected data flows.
- Raw SQL string concatenation is forbidden; all persistence access MUST go through the approved
  Supabase helpers or migrations.

### V. Performance & Responsiveness

The app MUST feel fast on mobile networks because users check balances in real time and trust the
resulting delay or jitter.

Rules:
- Server Components MUST be the default rendering strategy; `"use client"` boundaries MUST be kept
  as small as possible and justified by interaction needs.
- Images MUST use `next/image` with explicit dimensions or `fill` to avoid layout shift.
- Global client state MUST be limited to data that genuinely spans multiple unrelated components.
- Core user journeys SHOULD remain responsive on mid-range mobile devices and variable connections.
- Bundle or route regressions that materially slow the primary expense and balance flows MUST be
  called out in review with a mitigation plan.

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
principles in this document by Roman-numeral heading (I–V).

Complexity that violates a principle MUST be justified in the plan's Complexity Tracking table
before implementation begins.

**Version**: 1.1.0 | **Ratified**: 2026-04-13 | **Last Amended**: 2026-04-23
