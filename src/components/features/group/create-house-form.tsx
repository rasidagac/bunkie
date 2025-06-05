import { createGroup } from "@actions/groups/createGroup";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import Form from "next/form";

import FormSubmitButton from "@/components/common/form-submit-button";

export default function CreateHouseForm() {
  return (
    <Form
      action={createGroup}
      className="grid gap-4 py-4"
      id="create-house-form"
    >
      <div className="flex items-center gap-4">
        <Label htmlFor="title">Title</Label>
        <Input className="col-span-4" id="title" name="title" required />
      </div>
      <FormSubmitButton>Create House</FormSubmitButton>
    </Form>
  );
}
