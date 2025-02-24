import { ExpensesTable } from "@/components/house/expenses-table";
import { getExpenseList } from "@actions/expenses/getExpenseList";
import { getByCode } from "@actions/groups/getByCode";
import { Separator } from "@ui/separator";
import { notFound } from "next/navigation";

export default async function ExpensesPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const decodedCode = decodeURIComponent(code);

  const { data: group, error } = await getByCode(decodedCode);

  if (error) {
    notFound();
  }

  const { data: formattedExpenses } = await getExpenseList({
    groupId: group.id,
  });

  if (!formattedExpenses?.length) {
    return <div>No expenses yet</div>;
  }

  return (
    <div className="flex h-full flex-col gap-2">
      <h1 className="text-xl font-bold">All expenses</h1>
      <Separator className="w-1/3" />
      <ExpensesTable data={formattedExpenses} />
    </div>
  );
}
