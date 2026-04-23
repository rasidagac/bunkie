# Quickstart: Group Auto-Membership and Redirect on Creation

**Feature**: 001-group-auto-membership-redirect  
**Date**: 2026-04-23

---

## What This Feature Does

When a user creates a new group they are automatically added as a member and
immediately taken to that group's homepage. Previously, the `currentGroup` cookie
was never set after creation, causing the group page to return a 404.

---

## Files Changed

| File | Change type |
|------|-------------|
| `src/actions/groups/createGroup.ts` | Modified — add `setCurrentGroup`, error handling, typed return |
| `src/components/features/group/create-house-form.tsx` | Modified — adopt `useActionState` for inline error display |

---

## Implementation Sketch

### `createGroup.ts` (after)

```ts
"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { setCurrentGroup } from "@/actions/groups/setCurrentGroup";

export async function createGroup(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const title = (formData.get("title") as string)?.trim();

  if (!title) {
    return { error: "Group name is required." };
  }

  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  const { data: group, error: groupError } = await supabase
    .from("groups")
    .insert({ name: title })
    .select()
    .single();

  if (groupError || !group) {
    return { error: "Failed to create group. Please try again." };
  }

  const { error: membershipError } = await supabase
    .from("memberships")
    .insert({ group_id: group.id, user_id: authData.user?.id });

  if (membershipError) {
    return { error: "Group created but membership could not be set. Please contact support." };
  }

  await setCurrentGroup(group.id);
  redirect(`/groups/${group.id}`);
}
```

### `create-house-form.tsx` (after)

```tsx
"use client";

import { useActionState } from "react";
import { createGroup } from "@actions/groups/createGroup";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import FormSubmitButton from "@/components/common/form-submit-button";

export default function CreateHouseForm() {
  const [state, action] = useActionState(createGroup, null);

  return (
    <form action={action} className="grid gap-4 py-4" id="create-house-form">
      <div className="flex items-center gap-4">
        <Label htmlFor="title">Title</Label>
        <Input className="col-span-4" id="title" name="title" required />
      </div>
      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      <FormSubmitButton>Create House</FormSubmitButton>
    </form>
  );
}
```

---

## Verification

1. Navigate to `/groups/create`.
2. Enter a group name and submit.
3. Expect: Redirect to `/groups/<new-id>` with the group homepage rendering (no 404).
4. Expect: Checking `memberships` table — creator's `user_id` is present for the new group.
5. Expect: The `currentGroup` cookie is set to the new group's ID.
6. Submit with an empty name — expect inline error, no redirect.

---

## Dependencies

- No new packages required.
- No database migrations required.
- `setCurrentGroup` is an existing server action at `src/actions/groups/setCurrentGroup.ts`.
