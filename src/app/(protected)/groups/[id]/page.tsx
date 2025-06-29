import { getExpenseList } from "@actions/expenses/getExpenseList";
import { Button } from "@ui/button";
import { Separator } from "@ui/separator";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCurrentGroup } from "@/actions/groups/getCurrentGroup";
import { ExpensesTable } from "@/components/features/group/expenses-table";
import { GroupBreadcrumb } from "@/components/features/group/group-breadcrumb";
import { GroupHeader } from "@/components/features/group/house-header";
import { NoExpense } from "@/components/features/group/no-expense";
import { DebtsDrawer } from "@/components/group/debts";

export default async function SingleGroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: groupId } = await params;

  const { data: currentGroup, error } = await getCurrentGroup();

  if (error || !currentGroup) {
    notFound();
  }

  const { data: formattedExpenses } = await getExpenseList({
    groupId,
    limit: 10,
  });

  if (formattedExpenses.length === 0) {
    return <NoExpense groupId={groupId} />;
  }

  return (
    <>
      <GroupBreadcrumb />
      <div className="flex flex-col gap-6">
        <GroupHeader
          groupCode={currentGroup.code}
          groupName={currentGroup.name}
        />
        <DebtsDrawer groupId={groupId} />
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Latest Expenses</h2>
            <Link href={`/groups/${groupId}/create`}>
              <Button size="sm" variant="outline">
                <PlusCircle className="h-4 w-4" />
                Create Expense
              </Button>
            </Link>
          </div>
          <Separator className="my-2" />
          <ExpensesTable data={formattedExpenses} groupId={groupId} />
        </div>
      </div>
    </>
  );
}
