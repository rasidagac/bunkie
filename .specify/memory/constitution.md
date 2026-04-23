<!--
SYNC IMPACT REPORT
==================
Version change: (unversioned) → 1.0.0
Added sections: Core Principles (I–VI), Tech Stack & Constraints, Development Workflow, Governance
Modified principles: N/A (initial ratification)
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ Compatible — Constitution Check section references principles by name
  - .specify/templates/spec-template.md ✅ Compatible — no principle-specific references
  - .specify/templates/tasks-template.md ✅ Compatible — task format is principle-agnostic
Deferred TODOs: None
-->

# Bunkie Constitution

## Core Principles

### I. Type Safety (NON-NEGOTIABLE)

All code MUST be written in TypeScript with strict mode enabled. Type-only imports
MUST use `import type` syntax (enforced by ESLint `@typescript-eslint/consistent-type-imports`).
The `any` type is forbidden; use `unknown` with narrowing or proper generic types instead.
Database types MUST be sourced from the generated `src/database.types.ts` file — never
hand-write Supabase table shapes. Regenerate types after every schema change via
`pnpm update-types`.

**Rationale**: An expense-sharing app deals with financial data and multi-user state;
type errors at runtime cause incorrect balances or lost data. Strict typing catches
these at compile time.

### II. Server/Client Isolation (NON-NEGOTIABLE)

Server-side code MUST use `src/utils/supabase/server.ts` (cookie-aware, reads
`next/headers`). Browser-side code MUST use `src/utils/supabase/client.ts`
(`NEXT_PUBLIC_*` keys only). These two clients MUST NEVER be called from the
wrong context. Server actions MUST be placed under `src/actions/{feature}/` and
MUST begin with the `"use server"` directive.

**Rationale**: Mixing server and client Supabase clients leaks auth tokens to the
browser or silently bypasses RLS policies — both are critical security failures in
a financial app.

### III. Feature-Cohesive Architecture

Code MUST be organised by feature domain, not by technical layer. Server actions,
types, and helpers for a feature live together under `src/actions/{feature}/`.
UI components with meaningful business logic live under `src/components/features/`.
Cross-cutting utilities belong in `src/lib/` or `src/utils/`. New top-level
architectural groupings require explicit justification.

**Rationale**: Splitwise-style apps grow by adding features (groups, payments,
settlements). Feature cohesion makes it safe to add or remove a feature without
touching unrelated code.

### IV. Financial Accuracy

Monetary values MUST be stored and transmitted as integers representing the
smallest currency unit (e.g. kuruş for TRY, cents for USD/EUR) or as exact
decimals — never as IEEE-754 floats subject to rounding drift. Display formatting
MUST respect locale and currency; use `Intl.NumberFormat` or an equivalent
abstraction. Split calculations MUST be validated to ensure the sum of splits
equals the total expense amount (off-by-one errors MUST be assigned to the payer
or first member, never silently discarded). Currency MUST always be shown
alongside amounts in the UI.

**Rationale**: Incorrect arithmetic in an expense-sharing app directly harms users
financially and destroys trust. Precision is a product requirement, not an
implementation detail.

### V. UX Consistency

All interactive UI MUST use components from `src/components/ui/` (imported via
`@ui/*`). New layout primitives MUST NOT be invented when an existing shadcn/ui
component covers the need. Loading, empty, and error states MUST be handled
explicitly for every data-fetching surface — silent failures are forbidden.
Optimistic updates SHOULD be used for high-frequency user actions (adding splits,
marking settled) to keep the UI responsive. Form validation MUST use React Hook
Form + Zod schemas, with inline field errors visible before submission.

**Rationale**: Users make financial decisions based on what they see. Inconsistent
states or silent failures cause mismatched expectations about who owes what.

### VI. Simplicity & YAGNI

Features MUST be implemented at the simplest level that satisfies the acceptance
criteria. Abstractions MUST be deferred until a pattern is repeated at least twice
in production code. Dependencies MUST NOT be added unless they replace a
meaningful amount of hand-written code or provide a security/correctness guarantee.
Complexity that cannot be justified against a concrete requirement MUST be removed.

**Rationale**: Unnecessary abstraction in a Next.js/Supabase app creates indirection
that obscures where data actually flows, making auth and RLS bugs harder to find.

## Tech Stack & Constraints

- **Framework**: Next.js 16, App Router only — Pages Router patterns are forbidden.
- **Auth & Data**: Supabase (Postgres + RLS). All data access goes through Supabase
  clients; no direct Postgres connections.
- **Styling**: Tailwind CSS v4 + shadcn/ui (New York style). Class ordering enforced
  by `prettier-plugin-tailwindcss`.
- **State**: Redux Toolkit for cross-component shared state; React state/context for
  local UI state. Server state is fetched via server actions or Route Handlers.
- **File uploads**: Vercel Blob via `src/actions/upload/uploadFile.ts` — no other
  storage provider is permitted.
- **Package manager**: `pnpm` exclusively. `npm install` and `yarn` are forbidden in
  this project.
- **Protected routes**: Defined in `src/utils/supabase/middleware.ts`. Any new
  authenticated top-level path MUST be added to `protectedRoutes` there.

## Development Workflow

- `pnpm lint` MUST pass before every merge. ESLint enforces type-import style and
  alphabetical import ordering (`eslint-plugin-perfectionist`).
- `pnpm build` MUST succeed with zero TypeScript errors before every merge.
- Environment variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  MUST be present; their absence causes runtime failures in middleware and clients.
- Secrets MUST NOT be committed to the repository. Use `.env.local` for local
  development and the deployment platform's secret store for production.
- Database schema changes MUST be followed immediately by `pnpm update-types` and the
  updated `src/database.types.ts` MUST be committed in the same PR.

## Governance

This constitution supersedes all other practices and informal conventions in this
repository. Amendments require:

1. A clear rationale tied to a concrete product or engineering need.
2. A version bump following semantic versioning (MAJOR for breaking governance changes,
   MINOR for new principles or sections, PATCH for clarifications).
3. A `LAST_AMENDED_DATE` update and a corresponding commit message of the form
   `docs: amend constitution to vX.Y.Z (<summary>)`.
4. Review of dependent templates (plan, spec, tasks) for alignment after any MAJOR
   or MINOR change.

All pull requests MUST be checked against Principles I–VI before merge. Violations
MUST be resolved or explicitly justified in the PR description under a
"Constitution Exceptions" section with a plan to remove the exception.

**Version**: 1.0.0 | **Ratified**: 2026-04-23 | **Last Amended**: 2026-04-23
