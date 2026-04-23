# Tasks: Group Auto-Membership and Redirect on Creation

**Input**: Design documents from `specs/001-group-auto-membership-redirect/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to

---

## Phase 1: Setup

**Purpose**: Verify existing codebase state before making changes.

- [X] T001 Read and confirm current state of `src/actions/groups/createGroup.ts`
- [X] T002 Read and confirm current state of `src/components/features/group/create-house-form.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No new foundational infrastructure is required. The `setCurrentGroup` action, Supabase server client, and `useActionState` API are all already present in the codebase. This phase is a no-op — proceed directly to user story implementation.

**Checkpoint**: Foundation ready ✅ (pre-existing)

---

## Phase 3: User Story 1 — Auto-Membership on Group Creation (Priority: P1) 🎯 MVP

**Goal**: When a user creates a group, a membership record linking the creator to the group is guaranteed to be inserted, and any failure is surfaced as an inline error rather than silently ignored.

**Independent Test**: Submit the group creation form → check the `memberships` table → confirm the creator's `user_id` exists for the new `group_id`. Submit with session expired → confirm redirect to `/auth/login` (middleware handles this automatically).

- [X] T003 [US1] Update `createGroup` server action signature to accept `(_prevState: { error: string } | null, formData: FormData)` and return `Promise<{ error: string } | null>` in `src/actions/groups/createGroup.ts`
- [X] T004 [US1] Add input validation in `createGroup` — trim the title and return `{ error: "Group name is required." }` if empty in `src/actions/groups/createGroup.ts`
- [X] T005 [US1] Destructure and check the membership insert result in `createGroup` — return `{ error: "..." }` if `membershipError` is truthy in `src/actions/groups/createGroup.ts`

---

## Phase 4: User Story 2 — Redirect to Group Homepage After Creation (Priority: P1)

**Goal**: After the group and membership are created successfully, the `currentGroup` cookie is set and the user is redirected to the new group's homepage, which renders without a 404.

**Independent Test**: Submit a valid group name → confirm browser navigates to `/groups/<new-id>` → confirm the group homepage renders (not a 404) → confirm the `currentGroup` cookie equals the new group's ID.

- [X] T006 [US2] Import and call `setCurrentGroup(group.id)` inside `createGroup` after successful membership insertion, before `redirect()`, in `src/actions/groups/createGroup.ts`
- [X] T007 [P] [US2] Convert `create-house-form.tsx` to a Client Component: add `"use client"` directive, replace `next/form` `<Form>` with a plain `<form>`, and wire `useActionState(createGroup, null)` in `src/components/features/group/create-house-form.tsx`
- [X] T008 [US2] Render inline error from `useActionState` below the input using `<p className="text-sm text-destructive">{state?.error}</p>` in `src/components/features/group/create-house-form.tsx`

---

## Phase 5: Polish & Cross-Cutting Concerns

**Goal**: Ensure the changes satisfy the constitution (type safety, lint, build).

- [X] T009 Run `pnpm lint` and fix any import-order or type-import violations introduced by the changes
- [X] T010 Run `pnpm build` and confirm zero TypeScript errors

---

## Dependencies

```
T001, T002   (read-only context gathering — can run in parallel)
     │
T003, T004, T005   (US1 — all in createGroup.ts, sequential edits to same file)
     │
T006           (US2 — extends createGroup.ts, depends on T005)
     │
T007, T008     (US2 — both in create-house-form.tsx; T008 depends on T007)
     │
T009, T010     (Polish — depend on all implementation tasks)
```

## Parallel Execution Opportunities

- **T001 + T002**: File reads — fully parallel, no shared state.
- **T007** is marked `[P]` because it edits a different file (`create-house-form.tsx`) while T006 edits `createGroup.ts`; they can be done in the same pass if working across files simultaneously.

## Implementation Strategy

**MVP scope** (delivers both user stories together — they are tightly coupled):  
T001 → T002 → T003 → T004 → T005 → T006 → T007 → T008 → T009 → T010

Both stories are P1 and inseparable in practice: auto-membership is only verifiable if the redirect lands on the correct page. Implement as a single atomic change.

**Total tasks**: 10  
**Tasks per story**: US1 = 3 (T003–T005), US2 = 3 (T006–T008)  
**Setup/polish**: 4 (T001, T002, T009, T010)  
**Parallel opportunities**: T001+T002, T006+T007 (across files)
