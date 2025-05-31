import { Separator } from "@ui/separator";
import { redirect } from "next/navigation";

import CreateExpenseBreadcrumb from "@/components/features/expense/create-expense-breadcrumb";
import CreateExpenseForm from "@/components/features/expense/create-expense-form";
import { currentUser } from "@/lib/supabase";

export default async function CreateExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: groupId } = await params;

  const { user, error } = await currentUser();

  if (error) {
    redirect("/login");
  }

  return (
    <>
      <CreateExpenseBreadcrumb />
      <div className="mt-4 flex flex-col gap-2">
        <h1 className="text-xl font-bold">Create Expense</h1>
        <Separator className="w-1/3" />
        <CreateExpenseForm groupId={groupId} userId={user!.id} />
      </div>
    </>
  );
}
