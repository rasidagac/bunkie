# Implementation Plan: Group Auto-Membership and Redirect on Creation

**Branch**: `001-group-auto-membership-redirect` | **Date**: 2026-04-23 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/001-group-auto-membership-redirect/spec.md`

## Summary

After creating a group, the creator should automatically become a member and be
redirected to that group's homepage. The current `createGroup` server action already
inserts a membership and redirects, but it never calls `setCurrentGroup` to set the
`currentGroup` cookie. Since `getCurrentGroup` (used by every group page) reads this
cookie, the redirect lands on a 404. The fix is to call `setCurrentGroup(group.id)`
before `redirect()`, add error handling for the membership insertion, and surface
errors to the user via `useActionState`.

## Technical Context

**Language/Version**: TypeScript 5, strict mode  
**Primary Dependencies**: Next.js 16 (App Router), React 19, Supabase JS v2  
**Storage**: Supabase Postgres (no schema changes needed)  
**Testing**: `pnpm build` + `pnpm lint` (no automated test suite in project)  
**Target Platform**: Web — server-rendered Next.js app  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: Redirect within same request cycle — no additional round trips  
**Constraints**: Server actions must use `src/utils/supabase/server.ts`; browser components use `src/utils/supabase/client.ts`; `pnpm lint` must pass  
**Scale/Scope**: 2 files changed, ~30 LOC delta

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Type Safety | ✅ PASS | Action returns `{ error: string } \| null` — fully typed; no `any` used |
| II. Server/Client Isolation | ✅ PASS | `createGroup` stays a server action; form converts to Client Component only for `useActionState` |
| III. Feature-Cohesive Architecture | ✅ PASS | Change stays within `src/actions/groups/` and `src/components/features/group/` |
| IV. Financial Accuracy | ✅ N/A | No monetary values involved |
| V. UX Consistency | ✅ PASS | Error displayed inline using `text-destructive` (existing Tailwind/shadcn pattern); `FormSubmitButton` reused |
| VI. Simplicity & YAGNI | ✅ PASS | Minimal change — one additional call + error guard; no new abstractions |

**Post-design re-check**: Still passing. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-group-auto-membership-redirect/
├── plan.md           ← this file
├── research.md       ← Phase 0 output
├── data-model.md     ← Phase 1 output
├── quickstart.md     ← Phase 1 output
└── tasks.md          ← Phase 2 output (created by /speckit.tasks, not yet present)
```

No `contracts/` directory — this feature has no new public interfaces. The server
action signature change is internal.

### Source Code (repository root)

```text
src/
├── actions/
│   └── groups/
│       └── createGroup.ts        ← MODIFIED
└── components/
    └── features/
        └── group/
            └── create-house-form.tsx   ← MODIFIED
```

**Structure Decision**: Single Next.js project. Only 2 files change. No new files,
no new directories, no schema migration.
