# Implementation Plan: Group Creator Auto-Membership & Redirect

**Branch**: `002-group-join-redirect` | **Date**: 2026-04-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/002-group-join-redirect/spec.md`

## Summary

The basic create-group → insert-membership → redirect flow already exists in
`src/actions/groups/createGroup.ts`. Three gaps prevent the spec from being satisfied:

1. **404 on redirect** (blocks FR-003): `SingleGroupPage` fetches the group via a
   `currentGroup` cookie (`getCurrentGroup`), ignoring the URL `[id]` param. Since
   `createGroup` never sets that cookie, landing on `/groups/{id}` immediately triggers
   `notFound()`.
2. **Silent membership failure** (blocks FR-002): The membership insert has no error
   check — if it fails, the group exists with no members and the user is still redirected.
3. **No user-facing error** (blocks FR-005): Group creation failure returns `undefined`
   with only a `console.error`, leaving the user on a blank/unresponsive form.

**Approach**: Fix `SingleGroupPage` to fetch by URL param directly (remove cookie
dependency for direct URL access). Harden `createGroup` with atomic error handling and
an actionable error return value the form can surface as a toast.

## Technical Context

**Language/Version**: TypeScript 5 (strict mode)
**Primary Dependencies**: Next.js 16 App Router, Supabase JS client, React Hook Form, shadcn/ui, Sonner (Toaster)
**Storage**: Supabase PostgreSQL — `groups` and `memberships` tables (RLS enabled)
**Testing**: Integration tests against local Supabase (`supabase start`)
**Target Platform**: Web (desktop + mobile browser)
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: Group homepage renders within 2 s of redirect on mobile 4G (SC-002)
**Constraints**: Server actions only for data mutations; browser client never used server-side
**Scale/Scope**: Single-user flow; no concurrent group creation concerns for this feature

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Gate | Status |
|---|-----------|------|--------|
| I | **Code Quality** — strict TS, no implicit `any`, path aliases, server/client separation | `createGroup` uses server action + `src/utils/supabase/server.ts` ✅; fix must preserve that pattern | ✅ Pass |
| I | **Code Quality** — financial calculations in single tested utility | No financial calc in this feature | N/A |
| II | **Testing** — integration tests hitting real Supabase, covering RLS | New tests must use local Supabase, cover group + membership creation and the 404-fix path | ⚠ Required |
| III | **UX Consistency** — toast for async feedback, no silent failures | Current silent `return` on error violates this; fix must use `Toaster` | ⚠ Must fix |
| III | **UX Consistency** — destructive action confirmation | No destructive actions in this feature | N/A |
| IV | **Performance** — balance/data fetched server-side on initial load | `SingleGroupPage` fix must remain a Server Component fetching on the server | ✅ Pass |

**Post-design re-check**: After Phase 1, confirm `SingleGroupPage` remains a Server
Component and `createGroup` error path surfaces via toast (not client-side waterfall).

## Project Structure

### Documentation (this feature)

```text
specs/002-group-join-redirect/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks — not created here)
```

### Source Code (affected files)

```text
src/
├── actions/
│   └── groups/
│       └── createGroup.ts          # MODIFY — atomicity + error return
├── app/
│   └── (protected)/
│       └── groups/
│           └── [id]/
│               └── page.tsx        # MODIFY — fetch by URL param, remove cookie dep
└── components/
    └── features/
        └── group/
            └── create-house-form.tsx   # MODIFY — handle error return, show toast
```

**Structure Decision**: Single Next.js project. Only three files require changes; no new
files outside of test files.

## Complexity Tracking

> No constitution violations requiring justification.
