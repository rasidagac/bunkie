# Data Model: Group Creator Auto-Membership & Redirect

No new entities or schema changes are required. This feature operates entirely on
existing tables.

## Existing Entities Used

### Group
Table: `groups`

| Field      | Type      | Notes                                     |
|------------|-----------|-------------------------------------------|
| `id`       | uuid (PK) | Auto-generated; used as redirect target   |
| `name`     | text      | Provided by user in the creation form     |
| `code`     | text      | Auto-generated 8-char invite code         |
| `created_at` | timestamp | Auto-set on insert                      |

RLS: SELECT open to all authenticated users; INSERT/UPDATE/DELETE to members only.

### Membership
Table: `memberships`

| Field        | Type      | Notes                                            |
|--------------|-----------|--------------------------------------------------|
| `id`         | uuid (PK) | Auto-generated                                   |
| `group_id`   | uuid (FK) | References `groups.id`                           |
| `user_id`    | uuid (FK) | References `profiles.id` — the creator's user ID |
| `created_at` | timestamp | Auto-set on insert                               |

RLS: SELECT open to all authenticated users; INSERT authenticated.

## Invariant

Every row in `groups` MUST have at least one corresponding row in `memberships`. This
feature enforces the invariant at the application layer by rolling back the group
creation if the membership insert fails.
