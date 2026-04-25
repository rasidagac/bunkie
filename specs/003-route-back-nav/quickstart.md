# Quickstart — Route-level Go Back Functionality

Goal: verify the back control behaves correctly across all required flows after implementation.

## Prerequisites

- `pnpm install`
- `pnpm dev` running locally
- Logged-in test user with at least one group containing one expense

## Manual verification (acceptance scenarios)

### US1 — Back from nested route

1. Navigate: `/groups` → click a group → click an expense → land on `/groups/{id}/expenses/{expenseId}`.
2. Activate the back control (click).
3. **Expect**: land on `/groups/{id}` with prior scroll position preserved.
4. Activate back again.
5. **Expect**: land on `/groups`.

### US1 — Deep link fallback

1. Open a new browser tab (no in-app history).
2. Paste a URL like `/groups/{id}/expenses/{expenseId}` and load it.
3. Activate the back control.
4. **Expect**: navigate to `/groups/{id}` (static-map fallback, not browser exit).

### US2 — Top-level routes

1. Navigate to `/groups`.
2. **Expect**: no back control rendered.
3. Navigate to `/auth/login` (logged-out).
4. **Expect**: no back control rendered.

### US3 — Modal back

1. From a group page, open the create-expense modal.
2. Activate the back control inside the modal.
3. **Expect**: modal closes; user remains on the group page.
4. Open the same modal directly via a deep-link URL.
5. Activate the back control.
6. **Expect**: navigate to the underlying group page (not browser-exit).

### Edge cases

- Double-click back: only one navigation occurs.
- Tab → focus the button → press `Enter`: navigates as if clicked.
- Screen reader: announces "Go back, button".

## Quality gates (Constitution §Quality Gates)

- `pnpm lint` exits 0.
- `pnpm build` completes without errors.
- Component tests for `BackButton` (history fallback, debounce, hidden when no parent) pass.
- Lighthouse mobile run on `/groups/{id}` shows no Web Vitals regression.

## Rollback

Pure UI feature; revert the PR. No data migration, no env vars.
