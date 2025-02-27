import { getById } from "@/actions/groups/getById";
import { ExpensesTable } from "@/components/features/group/expenses-table";
import { GroupBreadcrumb } from "@/components/features/group/group-breadcrumb";
import { GroupHeader } from "@/components/features/group/house-header";
import { LiabilitiesDrawer } from "@/components/features/group/liabilities-drawer";
import { NoExpense } from "@/components/features/group/no-expense";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getExpenseList } from "@actions/expenses/getExpenseList";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SingleGroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: groupId } = await params;

  const { data: currentGroup } = await getById(groupId);

  if (!currentGroup) {
    notFound();
  }

  const { data: formattedExpenses } = await getExpenseList({
    groupId,
    limit: 10,
  });

  if (!formattedExpenses?.length) {
    return <NoExpense currentGroup={currentGroup} />;
  }

  return (
    <div>
      <div className="mb-4">
        <GroupBreadcrumb name={currentGroup.name} groupId={currentGroup.id} />
      </div>
      <div className="flex flex-col gap-6">
        <GroupHeader
          groupName={currentGroup.name}
          groupCode={currentGroup.code}
        />
        <LiabilitiesDrawer groupId={groupId} />
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Latest Expenses</h2>
            <Link href={`/dashboard/groups/${groupId}/create`}>
              <Button size="sm" variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Expense
              </Button>
            </Link>
          </div>
          <Separator className="my-2" />
          <ExpensesTable data={formattedExpenses!} />
        </div>
      </div>
    </div>
  );
}
