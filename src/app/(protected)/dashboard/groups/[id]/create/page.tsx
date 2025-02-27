import CreateExpenseBreadcrumb from "@/components/features/expense/create-expense-breadcrumb";
import CreateExpenseForm from "@/components/features/expense/create-expense-form";
import { currentUser } from "@/lib/supabase";
import { Separator } from "@ui/separator";
import { redirect } from "next/navigation";

export default async function CreateExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: groupId } = await params;

  const { user } = await currentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <div className="mb-4">
        <CreateExpenseBreadcrumb />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold">Create Expense</h1>
        <Separator className="w-1/3" />
        <CreateExpenseForm groupId={groupId} userId={user!.id as string} />
      </div>
    </div>
  );
}
