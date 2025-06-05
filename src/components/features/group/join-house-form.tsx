"use client";

import { joinGroup } from "@actions/groups/joinGroup";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { useActionState } from "react";

import FormSubmitButton from "@/components/common/form-submit-button";

const initialState = {
  error: "",
};

export default function JoinHouseForm() {
  const [state, formAction] = useActionState(joinGroup, initialState);

  return (
    <form action={formAction} className="grid gap-4 py-4">
      <div className="grid grid-cols-6 items-center gap-2">
        <Label htmlFor="code">Code</Label>
        <Input
          className={state.error ? "col-span-5 border-red-600" : "col-span-5"}
          id="code"
          name="code"
          required
        />
        {state.error && (
          <p className="col-span-5 col-start-2 text-sm text-red-500">
            {state.error}
          </p>
        )}
      </div>
      <FormSubmitButton type="submit">Join House</FormSubmitButton>
    </form>
  );
}
