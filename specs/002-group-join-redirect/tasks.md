---
description: "Task list for Group Creator Auto-Membership & Redirect"
---

# Tasks: Group Creator Auto-Membership & Redirect

**Input**: Design documents from `specs/002-group-join-redirect/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)

---

## Phase 1: User Story 1 — Creator Joins Group on Creation (Priority: P1) 🎯 MVP

**Goal**: After creating a group the creator is redirected to `/groups/{id}` and the page
renders correctly (currently shows 404 because `SingleGroupPage` fetches via cookie,
not URL param).

**Independent Test**: Create a group → confirm you land on the group homepage showing
the group name and your name in the member list. No 404.

### Implementation for User Story 1

- [X] T001 [US1] Update `SingleGroupPage` in `src/app/(protected)/groups/[id]/page.tsx`
  to replace `getCurrentGroup()` with `getById(groupId)` from `@actions/groups/getById`,
  using the `groupId` already extracted from `params`

**Checkpoint**: Group creation now lands on a working homepage. US1 is fully functional.

---

## Phase 2: User Story 2 — Creation Fails Atomically (Priority: P2)

**Goal**: If membership enrollment fails, the group is deleted and the user sees an
error toast on the creation form. No orphaned groups.

**Independent Test**: Simulate membership insert failure (e.g., revoke INSERT on
`memberships` in local Supabase) → confirm no group record is created and a toast
appears with a clear error message.

### Implementation for User Story 2

- [X] T002 [US2] Update `createGroup` in `src/actions/groups/createGroup.ts`:
  - Check the membership insert result for an error
  - If membership fails: delete the just-created group with `.delete().eq("id", group.id)`,
    then `return { error: "Failed to create group. Please try again." }`
  - Replace the silent `return` on group creation failure with
    `return { error: "Failed to create group. Please try again." }`

- [X] T003 [US2] Convert `CreateHouseForm` in
  `src/components/features/group/create-house-form.tsx` to a client component:
  - Add `"use client"` directive
  - Use `useActionState(createGroup, null)` to receive the error return from `createGroup`
  - Call `toast.error(state.error)` via a `useEffect` when `state?.error` is truthy
  - Keep `FormSubmitButton` (double-submit prevention already handled)

**Checkpoint**: US1 and US2 both work. Atomic failure is enforced.

---

## Phase 3: Polish & Cross-Cutting Concerns

- [X] T004 [P] Run `pnpm lint` and fix any type or import-order issues introduced in
  T001–T003 across the three modified files

---

## Dependencies & Execution Order

### Phase Dependencies

- **US1 (Phase 1)**: No dependencies — start immediately
- **US2 (Phase 2)**: No dependency on US1; can start in parallel with Phase 1
- **Polish (Phase 3)**: Depends on T001–T003 being complete

### Within Each User Story

- US1: T001 is a single self-contained change
- US2: T002 before T003 (form needs the updated action signature to handle the error return)

### Parallel Opportunities

T001 and T002 touch different files and can run in parallel:

```bash
# Run simultaneously:
Task: T001 — src/app/(protected)/groups/[id]/page.tsx
Task: T002 — src/actions/groups/createGroup.ts
# Then sequentially:
Task: T003 — src/components/features/group/create-house-form.tsx  (needs T002's return type)
Task: T004 — pnpm lint
```

---

## Implementation Strategy

### MVP (User Story 1 Only)

1. Complete T001
2. Validate: Create a group → land on working homepage
3. Done — US1 ships independently

### Full Feature

1. T001 + T002 in parallel
2. T003 (depends on T002)
3. T004 (lint)
4. Validate atomic failure path per `quickstart.md`
