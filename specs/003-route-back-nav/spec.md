# Feature Specification: Route-level Go Back Functionality

**Feature Branch**: `003-route-back-nav`
**Created**: 2026-04-25
**Status**: Draft
**Input**: User description: "Add go back functionality for whole routes."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Return to previous page from any nested route (Priority: P1)

A user navigating deeper into the app (e.g., group → expense detail) wants a single, predictable control to return to the previous page without relying on the browser's back button or manually editing the URL.

**Why this priority**: Core navigation discoverability. Without it, users get stuck on detail pages, especially on mobile where browser back affordances may be hidden or unreliable. Unblocks every other secondary navigation flow.

**Independent Test**: From any nested route (e.g., `/groups/{id}/expenses/{expenseId}`), trigger the back control and confirm the user lands on the logical parent route. Test delivers immediate value as a standalone improvement.

**Acceptance Scenarios**:

1. **Given** a user on an expense detail page navigated from a group page, **When** they activate the back control, **Then** they return to that group page with their prior scroll position preserved.
2. **Given** a user on a group page navigated from the groups list, **When** they activate the back control, **Then** they return to the groups list.
3. **Given** a user opens an expense detail page directly via a shared URL (no in-app history), **When** they activate the back control, **Then** they navigate to the parent route (the containing group page) rather than leaving the app.

---

### User Story 2 - Hide back control on top-level routes (Priority: P2)

When a user is on a top-level route (groups list, dashboard, auth pages), there is no meaningful "back" target inside the app, so the back control must not appear or must be visibly disabled to avoid confusion.

**Why this priority**: Prevents user confusion and dead-end clicks. Lower priority than P1 because top-level pages already have clear navigation; back button just shouldn't add noise.

**Independent Test**: Visit each top-level route and confirm the back control is not rendered (or is in a disabled state with a tooltip explaining why).

**Acceptance Scenarios**:

1. **Given** a user on the groups list (top-level protected route), **When** the page renders, **Then** the back control is absent.
2. **Given** a user on a public/auth page (login, sign-up), **When** the page renders, **Then** the back control is absent.

---

### User Story 3 - Modal back behavior (Priority: P3)

When a user opens a modal that has its own URL (e.g., the create-expense modal opened from a group page), the back control inside the modal closes the modal and returns to the underlying page rather than navigating two steps back.

**Why this priority**: Important polish for the existing modal pattern, but only affects a subset of flows; primary back behavior must work first.

**Independent Test**: Open a URL-addressable modal from a group page, activate the back control inside the modal, and confirm the modal closes leaving the user on the group page (not navigated further back).

**Acceptance Scenarios**:

1. **Given** a user opens the create-expense modal from a group page, **When** they activate the back control inside the modal, **Then** the modal closes and they remain on that group page.
2. **Given** a user opened a modal directly via URL (no underlying history), **When** they activate the back control, **Then** they navigate to the modal's logical parent route.

---

### Edge Cases

- User opens a deep link in a fresh tab (no in-app history); back control must still navigate to a sensible parent route, not exit the app.
- Rapid double-click on the back control must not navigate two steps back; only one navigation must occur.
- Back during in-flight server actions (e.g., form submission) must not lose unsaved data without warning if applicable.
- Back from a route where the parent no longer exists (e.g., group was deleted in another tab) must land on a higher-level route (groups list) instead of a 404 loop.
- Keyboard users must be able to focus and activate the back control via keyboard alone.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a visible back control on every non–top-level authenticated route.
- **FR-002**: System MUST navigate the user to the logical parent route when the back control is activated, falling back to browser history when in-app context is available and to a static parent route when history is empty.
- **FR-003**: System MUST omit (or disable) the back control on top-level routes where no parent exists (groups list, public/auth pages).
- **FR-004**: System MUST close any open modal when the back control inside that modal is activated, returning the user to the underlying route.
- **FR-005**: System MUST be reachable via keyboard navigation and expose an accessible label for screen readers.
- **FR-006**: System MUST debounce repeated activations so a single user action results in a single navigation.
- **FR-007**: System MUST handle deep-link entries (no prior in-app history) by routing to a sensible parent rather than exiting the app or entering a 404 loop.

### Key Entities

Not applicable — this feature is presentational and does not introduce or modify domain data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: From any nested route, users can return to the parent route in a single interaction (one click or one keypress).
- **SC-002**: 100% of non–top-level authenticated routes expose the back control; 100% of top-level routes do not.
- **SC-003**: In usability testing, at least 90% of new users locate and use the back control without instruction on their first nested-page visit.
- **SC-004**: Zero reported cases of users exiting the app unintentionally when activating back from a deep-linked nested page.
- **SC-005**: Back control is operable end-to-end via keyboard and announced correctly by screen readers (verified against WCAG 2.1 AA).

## Assumptions

- Scope is limited to authenticated (`(protected)`) and authentication routes; marketing/landing pages are out of scope unless they grow nested structure.
- A logical parent-route map can be derived from the existing route hierarchy (e.g., an expense detail under a group returns to that group page); no new routing metadata is required.
- The back control is a UI affordance only — it does not modify route definitions, server actions, or database schema.
- Existing breadcrumb and header components can host the control without a separate new shell.
- Mobile and desktop share one design; no separate mobile-only navigation drawer is introduced as part of this feature.
