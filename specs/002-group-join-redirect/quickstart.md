# Quickstart: Group Creator Auto-Membership & Redirect

## Prerequisites

- Local Supabase running: `supabase start`
- Dev server running: `pnpm dev`
- At least one user account created

## Manual Verification (Golden Path)

1. Sign in as a test user.
2. Navigate to the group creation page (wherever "Create Group" is linked).
3. Enter a group name and submit.
4. **Expected**: You are immediately redirected to `/groups/{new-id}` and the page
   displays the group name, your name in the member list, and an empty activity feed.
5. Open a Supabase table viewer (or run a query): confirm a `memberships` row exists
   linking your user ID to the new group ID.

## Atomic Failure Verification

1. Temporarily break the membership insert (e.g., disable the `memberships` INSERT RLS
   policy for your test user in the Supabase dashboard).
2. Submit the group creation form.
3. **Expected**: An error toast appears. The user stays on the creation form with the
   group name still populated.
4. Confirm in Supabase that no orphaned group was created for this attempt.
5. Re-enable the RLS policy.

## Integration Test Commands

```bash
# Run all integration tests (requires supabase start)
pnpm test

# Run only group-creation tests
pnpm test -- --testPathPattern="createGroup"
```
