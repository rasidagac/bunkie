# Research: Group Auto-Membership and Redirect on Creation

**Feature**: 001-group-auto-membership-redirect  
**Date**: 2026-04-23

---

## Finding 1: Root Cause — Missing `setCurrentGroup` Call

**Decision**: `createGroup` must call `setCurrentGroup(group.id)` before redirecting.

**Rationale**: `getCurrentGroup` (used by every group page) reads the `currentGroup`
cookie. `createGroup` currently creates the group, inserts a membership, then redirects
to `/groups/${group.id}` — but never sets the cookie. When the group homepage loads it
calls `getCurrentGroup()`, which returns `{ data: null, error: null }` (no cookie),
causing `notFound()` to fire. The fix is a single additional call to `setCurrentGroup`
inside `createGroup` after successful membership insertion.

**Alternatives considered**:  
- Reading the group ID from `params` in the page and bypassing `getCurrentGroup` — rejected;
  `getCurrentGroup` is used across breadcrumbs, header, and sidebar; changing the data
  flow would require touching many components.
- Using a URL search param as a fallback — rejected; adds unnecessary complexity for a
  one-line fix.

---

## Finding 2: Error Handling for Membership Insertion

**Decision**: Add explicit error handling for the membership `insert` call in `createGroup`.

**Rationale**: The current code ignores the result of
`supabase.from("memberships").insert(...)`. If insertion fails (RLS policy violation,
constraint error, etc.), the user is still redirected to the group page where they
cannot view data because they are not actually a member. The fix is to check the error
and surface it via a returned error state.

**Alternatives considered**:  
- Postgres-level transaction via an RPC function — provides true atomicity but requires
  a schema migration and a new database function. Overkill for a feature that is
  currently a form server action with very simple logic. The simpler guard is sufficient
  for this feature's risk profile.
- Roll back the group on membership failure — requires calling `.delete()` on the group
  and complicates the action significantly. The simpler path is to surface the error
  and let the user retry.

---

## Finding 3: Action Return Type — Error Surfacing

**Decision**: `createGroup` should return `{ error: string }` on failure instead of
silently returning `undefined`.

**Rationale**: `create-house-form.tsx` uses `next/form` with `createGroup` as its
action. Currently, any failure is swallowed (`console.error` + `return`). To surface
errors to the user, the action should return a typed error object; the form can read
this via `useActionState` (React 19 / Next.js 15 pattern). This is consistent with how
other forms in the codebase handle server action errors (see `login-form.tsx`,
`sign-up-form.tsx`).

**Alternatives considered**:  
- Throw an error and catch it with `error.tsx` — appropriate for unexpected errors but
  not for user-facing validation failures (e.g., empty group name).
- Toast notification via Sonner on the client — requires converting the form to a
  Client Component. The `useActionState` pattern keeps the component a Server Component
  with minimal JS.

---

## Finding 4: No Schema Changes Required

**Decision**: This feature requires zero database schema changes.

**Rationale**: The `memberships` table already exists with `group_id` and `user_id`
columns. The `groups` table auto-generates an invite `code`. All required data
relationships are already modelled. `pnpm update-types` is not needed.

**Alternatives considered**: N/A

---

## Summary of Changes Required

| File | Change |
|------|--------|
| `src/actions/groups/createGroup.ts` | Call `setCurrentGroup(group.id)` after membership is inserted; handle membership error; return typed `{ error: string }` on failure |
| `src/components/features/group/create-house-form.tsx` | Convert to Client Component using `useActionState` to display the error returned by the action |

No other files require changes. No schema migrations required.
