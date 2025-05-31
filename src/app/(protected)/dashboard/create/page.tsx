import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";

import CreateHouseForm from "@/components/features/group/create-house-form";

export default function CreateGroupPage() {
  return (
    <Card className="lg:w-1/3">
      <CardHeader>
        <CardTitle>Create a House</CardTitle>
        <CardDescription>Create a new house to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <CreateHouseForm />
      </CardContent>
    </Card>
  );
}
