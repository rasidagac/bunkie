# Research: Group Creator Auto-Membership & Redirect

## Finding 1 — Root Cause of 404 After Redirect

**Decision**: Fix `SingleGroupPage` to fetch the group by URL `groupId` param directly,
rather than through the `currentGroup` cookie.

**Rationale**: `getCurrentGroup` (used in `SingleGroupPage:22`) reads a `currentGroup`
cookie that is never set by `createGroup`. This makes the group homepage unreachable
immediately after creation. Fetching by URL param is the standard Next.js App Router
pattern and removes the hidden cookie dependency entirely.

**Alternatives considered**:
- Set the `currentGroup` cookie inside `createGroup` before redirecting — works but adds
  a stateful side-effect to the creation action and doesn't fix the deeper issue that the
  page ignores its own URL param.
- Pass `groupId` to `getCurrentGroup` as a fallback — adds conditional logic to a shared
  utility for a single caller's edge case.

---

## Finding 2 — Atomic Group + Membership Creation

**Decision**: Check the membership insert result in `createGroup`; if it fails, delete
the newly created group and return an error object instead of redirecting.

**Rationale**: Supabase does not run Postgres transactions through the JS client's
`insert` chain. The two inserts (group, then membership) are sequential — a failure on
the second leaves an orphaned group. The safest client-side approach is: on membership
failure, explicitly delete the group and surface an error.

**Alternatives considered**:
- Supabase Edge Function / RPC wrapping both inserts in a Postgres transaction — more
  robust but introduces a new infrastructure dependency outside this feature's scope.
- Database trigger to auto-insert membership on group creation — elegant but moves
  business logic into the database layer without a clear migration path for existing
  records and makes the behavior invisible to the application layer.

---

## Finding 3 — Error Feedback Pattern

**Decision**: Return a typed `{ error: string }` object from `createGroup` on failure;
the form component calls `toast.error(...)` when it receives it.

**Rationale**: Next.js server actions can return serialisable values. The existing
`Toaster` (mounted in `src/app/layout.tsx`) is the constitution-mandated channel for
async feedback. The `FormSubmitButton` already disables on `useFormStatus().pending`,
satisfying FR-006 (no double-submit).

**Alternatives considered**:
- `useActionState` hook — cleaner but requires converting `CreateHouseForm` from a
  simple server-action form to a hook-driven client component; adds complexity for a
  simple error message.
- Throwing an error from the server action — propagates as an unhandled error boundary,
  not a user-friendly toast.

---

## Finding 4 — Double-Submit Prevention (FR-006)

**Decision**: Already satisfied. `FormSubmitButton` uses `useFormStatus().pending` to
disable itself while the action is in-flight (`src/components/common/form-submit-button.tsx:17`).

No changes needed.
