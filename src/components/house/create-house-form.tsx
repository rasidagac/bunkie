import FormSubmitButton from "@/components/form-submit-button";
import { createHouse } from "@actions/houses/createHouse";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import Form from "next/form";

export default function CreateHouseForm() {
  return (
    <Form
      id="create-house-form"
      className="grid gap-4 py-4"
      action={createHouse}
    >
      <div className="flex items-center gap-4">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" className="col-span-4" required />
      </div>
      <FormSubmitButton>Create House</FormSubmitButton>
    </Form>
  );
}
