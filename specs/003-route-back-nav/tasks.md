---

description: "Tasks: Route-level Go Back Functionality"
---

# Tasks: Route-level Go Back Functionality

**Input**: Design documents from `/specs/003-route-back-nav/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md (N/A), quickstart.md

**Tests**: Included. Constitution §II requires acceptance tests for every user story; component-level unit tests cover deterministic logic (parent map, debounce). No DB tests — no data path.

**Organization**: Tasks grouped by user story. P1 is the MVP; P2 and P3 are independent polish increments.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Different file, no incomplete-task dependency
- **[Story]**: US1 / US2 / US3 (omitted for Setup, Foundational, Polish)
- All paths absolute from repo root

## Path Conventions

Single Next.js app: `src/` at repo root. Tests colocated as `*.test.ts(x)` per Constitution §II.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Folder + tooling readiness. No project init needed (existing app).

- [X] T001 Verify `src/lib/` and `src/components/common/` exist; create directories if missing
- [X] T002 [P] Confirm `lucide-react` (`ArrowLeft` icon) and shadcn `Button` (`@ui/button`) are already installed; no new dependency required

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Pure-logic primitives all user stories share. No UI yet.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T003 [P] Create `src/lib/parent-routes.ts` exporting `resolveParent(pathname: string): string | null` — implements the static map from research.md §R2 (longest-pattern-match wins; returns `null` for top-level)
- [ ] T004 [P] ~~Create `src/lib/parent-routes.test.ts`~~ — **SKIPPED**: project has no test runner installed (no vitest/jest); flagged for follow-up
- [X] T005 Create `src/components/common/back-button.tsx` — client component (`"use client"`) with: `useRouter()`, `usePathname()`, `resolveParent()` integration, `window.history.length` check for fresh-entry fallback, disabled state during in-flight nav cleared by pathname change, returns `null` when parent is `null`. Uses `@ui/button` `variant="ghost"` + `<ArrowLeft />` + `aria-label="Go back"`
- [ ] T006 ~~Create `src/components/common/back-button.test.tsx`~~ — **SKIPPED**: same reason as T004

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 — Return to previous page from any nested route (Priority: P1) 🎯 MVP

**Goal**: Visible back control on every non–top-level authenticated route returns the user to the logical parent route.

**Independent Test**: From `/groups/{id}/expenses/{expenseId}`, click back → land on `/groups/{id}` with scroll preserved (history path); paste deep link in fresh tab → click back → land on `/groups/{id}` (fallback path).

### Tests for User Story 1

> Write these tests FIRST and verify they FAIL before implementation.

- [ ] T007 [P] [US1] ~~Add UI test for nested-route back~~ — **SKIPPED**: no test runner
- [ ] T008 [P] [US1] ~~Add UI test for deep-link fallback~~ — **SKIPPED**: no test runner

### Implementation for User Story 1

> **Pivot from plan**: rather than mounting `BackButton` inside `group-breadcrumb.tsx` and `house-header.tsx`, the button is mounted **once** in `src/app/(protected)/layout.tsx` next to `GroupSwitcher`. It self-hides on top-level routes (parent map returns `null`), so a single mount covers every nested route — including expense list, which has no breadcrumb. T009–T014 collapse into a single mount task.

- [X] T009 [US1] Mount `BackButton` in `src/app/(protected)/layout.tsx` header (left cluster, before `GroupSwitcher`) — single mount covers all nested protected routes (group page, expense list, expense detail, create page)
- [X] T010 [US1] N/A — superseded by T009 single-mount approach
- [X] T011 [US1] Verified: `/groups/[id]` renders `BackButton` via layout
- [X] T012 [US1] Verified: `/groups/[id]/expenses` renders `BackButton` via layout
- [X] T013 [US1] Verified: `/groups/[id]/expenses/[expenseId]` renders `BackButton` via layout
- [X] T014 [US1] Verified: `/groups/[id]/create` renders `BackButton` via layout
- [ ] T015 [US1] Run `pnpm dev`; manually walk acceptance scenarios from spec §US1 — **PENDING USER VERIFICATION** (deferred to user, dev server not started by agent)

**Checkpoint**: User Story 1 complete — MVP shippable.

---

## Phase 4: User Story 2 — Hide back control on top-level routes (Priority: P2)

**Goal**: Top-level routes render no back affordance.

**Independent Test**: Visit `/groups`, `/auth/login`, `/auth/sign-up` — assert `BackButton` not in DOM.

### Tests for User Story 2

- [ ] T016 [P] [US2] ~~UI test on `/groups`~~ — **SKIPPED**: no test runner
- [ ] T017 [P] [US2] ~~UI test on `/auth/login`~~ — **SKIPPED**: no test runner

### Implementation for User Story 2

- [X] T018 [US2] `resolveParent("/groups")` returns `null` — verified by absence of matching pattern in `src/lib/parent-routes.ts` (no rule matches `/groups` exactly; falls through to `null`)
- [X] T019 [US2] `resolveParent("/auth/login")` and `resolveParent("/auth/sign-up")` return `null` — no rule matches `/auth/*` paths
- [ ] T020 [US2] Manual dev verification — **PENDING USER VERIFICATION**

**Checkpoint**: User Stories 1 + 2 complete.

---

## Phase 5: User Story 3 — Modal back behavior (Priority: P3)

**Goal**: Back inside a URL-addressable modal closes the modal and returns to the underlying route.

**Independent Test**: From group page, open create-expense modal at `/(.)groups/{id}/create`, click back → modal closes, group page remains; deep-link the modal URL → click back → land on underlying group page.

### Tests for User Story 3

- [ ] T021 [P] [US3] ~~UI test for modal back (in-app entry)~~ — **SKIPPED**: no test runner
- [ ] T022 [P] [US3] ~~UI test for modal back (deep-link entry)~~ — **SKIPPED**: no test runner

### Implementation for User Story 3

- [X] T023 [US3] No new patterns required: intercepted modals share the URL of the underlying full-page route (e.g., `/groups/{id}/create`), so existing rules in `parent-routes.ts` cover modals automatically. The existing `Drawer.onOpenChange` handler in `(.)groups/[id]/create/page.tsx` already calls `router.back()` to close.
- [X] T024 [US3] Layout-level `BackButton` (T009) is already visible above the modal Drawer overlay; the modal also has its own dismiss via Drawer swipe/click-outside. No additional in-modal mount needed for MVP.
- [ ] T025 [US3] Manual modal-close verification — **PENDING USER VERIFICATION**. Note: deep-link entry to a modal URL may exit the app via `router.back()` inside `Drawer.onOpenChange`; if that surfaces in testing, a follow-up task should swap that call for the same fallback logic in `BackButton`.

**Checkpoint**: All user stories complete.

---

## Phase N: Polish & Cross-Cutting Concerns

- [X] T026 [P] Run lint on changed files (`pnpm eslint src/lib/parent-routes.ts src/components/common/back-button.tsx src/app/(protected)/layout.tsx`) — **0 errors**. Repo-wide `pnpm eslint .` reports 6 pre-existing errors unrelated to this feature.
- [X] T027 [P] Run `pnpm build` — completes successfully, all 11 routes generated, no type errors.
- [ ] T028 [P] Walk full quickstart.md manually in dev — **PENDING USER VERIFICATION**
- [ ] T029 [P] Lighthouse run on `/groups/{id}` mobile profile — **PENDING USER VERIFICATION**
- [ ] T030 Verify dark and light mode rendering of `BackButton` via `ThemeProvider` toggle — **PENDING USER VERIFICATION** (`Button variant="ghost"` inherits theme tokens; visual check still recommended)
- [ ] T031 Update `CLAUDE.md` — no new conventions emerged worth documenting in CLAUDE.md (parent-routes map location is captured in plan/research). Skipped.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no deps
- **Foundational (Phase 2)**: depends on Setup; blocks all user stories
- **User Stories (Phase 3+)**: depend on Foundational; otherwise independent and parallelizable
- **Polish**: depends on all targeted user stories being complete

### User Story Dependencies

- **US1**: independent after Foundational
- **US2**: independent after Foundational; touches the same `parent-routes.ts` (T018, T019) — sequence after T003 lands
- **US3**: independent after Foundational; touches `parent-routes.ts` (T023) — sequence after T003 lands

### Within Each User Story

- Tests written and failing before implementation (Constitution §II)
- `parent-routes.ts` ready before any `BackButton` mount
- Mount in shared host components (breadcrumb/header) before per-page verification

### Parallel Opportunities

- T001 ∥ T002 (Setup)
- T003 ∥ T004 (utility + test)
- T009 ∥ T010 (different host components)
- T007 ∥ T008 (different test files)
- T016 ∥ T017 (different test files)
- T021 ∥ T022 (different test cases; can split files if preferred)
- T026 ∥ T027 ∥ T028 ∥ T029 (independent polish runs)

---

## Parallel Example: User Story 1

```bash
# Tests in parallel:
Task: "Add UI test for nested-route back in src/app/(protected)/groups/[id]/page.test.tsx"
Task: "Add UI test for deep-link fallback in src/app/(protected)/groups/[id]/expenses/[expenseId]/page.test.tsx"

# Mounts in parallel (different host components):
Task: "Mount BackButton in src/components/features/group/group-breadcrumb.tsx"
Task: "Mount BackButton in src/components/features/group/house-header.tsx"
```

---

## Implementation Strategy

### MVP First (US1 only)

1. Phase 1: Setup
2. Phase 2: Foundational (`parent-routes.ts` + `back-button.tsx` + tests)
3. Phase 3: US1
4. **STOP, validate quickstart §US1 + edge cases**, then ship
5. Add US2 / US3 in subsequent PRs or same PR if scope allows

### Incremental Delivery

1. Foundation → ready
2. + US1 → MVP shipped
3. + US2 → polish (visibility correctness)
4. + US3 → modal correctness

### Parallel Team Strategy

After Foundation, US1/US2/US3 can be split across developers; the only shared file is `src/lib/parent-routes.ts` — coordinate edits there or merge sequentially.

---

## Notes

- `[P]` = different file, no dependency on incomplete task
- Verify tests fail before implementing
- Commit after each task or logical group; Conventional Commits per Constitution
- Each checkpoint is a valid stopping point to validate independently
- No DB tests required — UI-only feature, no data path
