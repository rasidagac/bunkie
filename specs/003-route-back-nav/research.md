# Phase 0 Research — Route-level Go Back Functionality

No `NEEDS CLARIFICATION` markers entered Phase 0. Research below confirms key technical choices.

## R1 — Navigation API: `router.back()` vs custom history

- **Decision**: Use `useRouter().back()` from `next/navigation` as the primary action; detect "fresh entry" (no in-app history) and fall back to `router.push(parent)` from a static parent-route map.
- **Rationale**: `router.back()` preserves scroll position and forward-history semantics, matching FR-001 acceptance scenario 1. Falling back via `push` covers FR-007 (deep-link entries) and avoids exiting the app.
- **Detecting "fresh entry"**: Read `window.history.length` and `document.referrer`. If `history.length <= 1` or referrer is empty/cross-origin, assume no in-app history and use the static map.
- **Alternatives considered**:
  - **Always `router.back()`**: rejected — exits app on deep links (violates FR-007).
  - **Always `router.push(parent)`**: rejected — loses scroll restoration and breaks the natural back/forward stack.
  - **Maintain a custom history stack in Redux**: rejected — overkill, adds client state, violates Performance §IV (Redux only for genuinely shared state).

## R2 — Parent-route mapping

- **Decision**: Static map keyed by route patterns in `src/lib/parent-routes.ts`. Resolve current pathname against the patterns with simple precedence (longest match wins).
- **Rationale**: Route hierarchy is small and known (~5 segments). A declarative map is simpler and easier to test than runtime path-walking.
- **Mapping (initial)**:
  | Pattern                                       | Parent                  |
  |-----------------------------------------------|-------------------------|
  | `/groups/[id]/expenses/[expenseId]`           | `/groups/[id]`          |
  | `/groups/[id]/expenses`                       | `/groups/[id]`          |
  | `/groups/[id]/create`                         | `/groups/[id]`          |
  | `/groups/[id]`                                | `/groups`               |
  | (top-level `/groups`, `/auth/*`)              | none — hide button      |
- **Alternatives considered**:
  - **Inferring parent by stripping last segment**: rejected — breaks for parameterized routes and intercepted modals.
  - **Encoding parent in route metadata (Next.js segment config)**: rejected — adds boilerplate to every page; map keeps logic in one file.

## R3 — Modal back behavior

- **Decision**: Inside intercepted modal routes, the same `BackButton` component is rendered, but the parent-route map resolves the modal's slot pattern to the underlying route (e.g., `/(.)groups/[id]/create` → `/groups/[id]`). `router.back()` already closes the modal correctly when opened in-app; deep-link case uses `push` to the underlying route.
- **Rationale**: Reuses one component; avoids a "modal back" sibling component. Matches FR-004.
- **Alternatives considered**:
  - **Separate `<ModalBackButton />`**: rejected — duplicates logic.
  - **Calling `router.dismiss()` (not in stable API)**: rejected — not part of public Next.js API.

## R4 — Visibility on top-level routes

- **Decision**: `BackButton` returns `null` when the resolved parent is `none`. Hosting components (header/breadcrumb) render the button unconditionally; the button itself is the gatekeeper.
- **Rationale**: Single source of truth for visibility; no duplication of the rule across hosts. Matches FR-003.
- **Alternative**: Per-host conditional rendering — rejected, scatters the rule.

## R5 — Debouncing repeated activations

- **Decision**: Disable the button for one animation frame (or until route change resolves) after click. Implemented via local `useState` flag toggled by `useEffect` on `usePathname()` change.
- **Rationale**: Prevents the double-back bug in FR-006 / Edge Case 2 without pulling in a debounce library.

## R6 — Accessibility

- **Decision**:
  - Render as a shadcn/ui `Button` with `variant="ghost"` and a `lucide-react` `ArrowLeft` icon.
  - Visible label "Back" plus `aria-label="Go back"` for screen readers.
  - Keyboard focusable by default (native `<button>`); `Enter`/`Space` activate.
- **Rationale**: Matches Constitution §III (shadcn/ui only) and FR-005 / SC-005 (WCAG 2.1 AA). No custom focus handling needed.

## Decisions Summary

| Topic                | Decision                                                                 |
|----------------------|--------------------------------------------------------------------------|
| Navigation primitive | `useRouter().back()` with static-map fallback when history is empty      |
| Parent map location  | `src/lib/parent-routes.ts`                                               |
| Modal back           | Same component; map resolves modal slot to underlying route              |
| Top-level visibility | Component returns `null` when parent resolves to `none`                  |
| Debounce             | Local disabled flag, cleared on `usePathname()` change                   |
| A11y                 | shadcn `Button` + `ArrowLeft` icon + `aria-label="Go back"`              |
