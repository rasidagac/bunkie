import CreateHouseForm from "@/components/features/group/create-house-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";

export default function CreateHousePage() {
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
