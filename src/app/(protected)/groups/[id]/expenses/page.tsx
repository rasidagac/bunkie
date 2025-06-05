import { getExpenseList } from "@actions/expenses/getExpenseList";
import { Separator } from "@ui/separator";
import { notFound } from "next/navigation";

import { getById } from "@/actions/groups/getById";
import { ExpensesTable } from "@/components/features/group/expenses-table";

export default async function ExpensesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: group, error } = await getById(id);

  if (error) {
    notFound();
  }

  const { data: formattedExpenses } = await getExpenseList({
    groupId: group.id,
  });

  if (formattedExpenses.length === 0) {
    return <div>No expenses yet</div>;
  }

  return (
    <div className="flex h-full flex-col gap-2">
      <h1 className="text-xl font-bold">All expenses</h1>
      <Separator className="w-1/3" />
      <ExpensesTable data={formattedExpenses} groupId={group.id} />
    </div>
  );
}
