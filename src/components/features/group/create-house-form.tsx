"use client";

import { createGroup } from "@actions/groups/createGroup";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { useActionState } from "react";

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
        <p className="text-destructive text-sm">{state.error}</p>
      )}
      <FormSubmitButton>Create House</FormSubmitButton>
    </form>
  );
}
