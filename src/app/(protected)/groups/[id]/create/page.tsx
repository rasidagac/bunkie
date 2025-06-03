import { Separator } from "@ui/separator";

import CreateExpenseBreadcrumb from "@/components/features/expense/create-expense-breadcrumb";
import CreateExpenseForm from "@/components/features/expense/create-expense-form";
import { createClient } from "@/utils/supabase/server";

export default async function CreateExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: groupId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
