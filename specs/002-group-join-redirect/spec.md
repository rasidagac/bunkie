# Feature Specification: Group Creator Auto-Membership & Redirect

**Feature Branch**: `002-group-join-redirect`
**Created**: 2026-04-24
**Status**: Draft
**Input**: User description: "After creating a group user should be member of newly created group. and user should be directed to that group's homepage"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Creator Joins Group on Creation (Priority: P1)

When a user creates a new group, they are automatically enrolled as a member of that
group and immediately taken to the group's homepage — no extra steps required.

**Why this priority**: Without auto-membership the creator cannot see or interact with
their own group. This is the minimum viable outcome of the create-group flow.

**Independent Test**: Create a new group, then verify the creator appears in the group's
member list and is viewing the group homepage.

**Acceptance Scenarios**:

1. **Given** an authenticated user submits a valid group creation form,
   **When** the group is successfully created,
   **Then** a membership record linking the creator to the new group is created
   automatically, and the user is redirected to that group's homepage.

2. **Given** an authenticated user submits a valid group creation form,
   **When** the group is successfully created,
   **Then** the creator is listed as a member on the group's member list with the same
   standing as any other member.

3. **Given** an authenticated user has just been redirected to the new group's homepage,
   **When** they view the page,
   **Then** they see the correct group name, their own name in the member list, and an
   empty expense/activity feed.

---

### User Story 2 - Creation Fails Atomically on Membership Error (Priority: P2)

If the system cannot enroll the creator as a member, the group creation is rolled back
entirely — no orphaned groups exist without an owner.

**Why this priority**: An orphaned group (created but with no members) is a data
integrity failure. Prevents ghost groups that no one can access or manage.

**Independent Test**: Simulate a membership creation failure and confirm neither the
group record nor any membership record persists.

**Acceptance Scenarios**:

1. **Given** an authenticated user submits a valid group creation form,
   **When** membership enrollment fails for any reason,
   **Then** the group record is also removed (or never persisted), the user sees a clear
   error message, and they remain on the group creation form with their input preserved.

2. **Given** a group creation attempt that failed,
   **When** the user checks their group list,
   **Then** the failed group does not appear.

---

### Edge Cases

- What happens if the user submits the group creation form twice in rapid succession
  (double-click / network retry)?
- What if the user navigates away immediately after submission before the redirect
  completes?
- What if the group is created but the redirect destination (group homepage) does not
  yet exist or fails to load?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: When a user successfully creates a group, the system MUST automatically
  create a membership record linking that user to the new group.
- **FR-002**: Group creation and membership enrollment MUST succeed or fail together —
  partial success (group exists without creator membership) is not permitted.
- **FR-003**: After successful group creation and membership enrollment, the system MUST
  redirect the creator to the new group's homepage without requiring any additional user
  action.
- **FR-004**: The creator's membership MUST grant the same standing as memberships
  created through the group invite-code flow.
- **FR-005**: If group creation or membership enrollment fails, the system MUST display
  a clear error message and leave the user on the group creation form with their
  previously entered data intact.
- **FR-006**: The system MUST prevent duplicate group creation from rapid re-submission
  (e.g., double-click on the submit button).

### Key Entities

- **Group**: A shared household unit identified by a unique name and an auto-generated
  invite code. Created by an authenticated user.
- **Membership**: A record that links a user to a group. For the creator, this record is
  generated automatically at the moment of group creation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of successful group creation attempts result in the creator appearing
  in that group's member list immediately after creation.
- **SC-002**: Users reach the new group's homepage within 2 seconds of a successful
  group creation submission under normal network conditions.
- **SC-003**: Zero groups exist in the system without at least one member (the creator).
- **SC-004**: Users can complete the full "create group and land on its homepage" journey
  in under 60 seconds from first interaction.

## Assumptions

- The group creation form already exists; this feature changes only the post-submission
  behavior (auto-membership + redirect).
- The group homepage URL is derived from the group's unique identifier and is always
  reachable immediately after creation.
- The user is authenticated before accessing the group creation flow; unauthenticated
  access is already blocked by existing middleware.
- All group members, including the creator, have the same permissions within a group
  (there is no separate "owner" role distinct from member).
- The invite-code-based join flow is out of scope for this feature; only the
  creator-auto-join path is addressed here.
