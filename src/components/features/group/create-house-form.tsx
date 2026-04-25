"use client";

import { createGroup } from "@actions/groups/createGroup";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import Form from "next/form";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import FormSubmitButton from "@/components/common/form-submit-button";

export default function CreateHouseForm() {
  const [state, action] = useActionState(createGroup, null);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <Form action={action} className="grid gap-4 py-4" id="create-house-form">
      <div className="flex items-center gap-4">
        <Label htmlFor="title">Title</Label>
        <Input className="col-span-4" id="title" name="title" required />
      </div>
      <FormSubmitButton>Create House</FormSubmitButton>
    </Form>
  );
}
