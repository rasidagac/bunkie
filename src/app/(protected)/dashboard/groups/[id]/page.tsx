import { ExpensesTable } from "@/components/features/group/expenses-table";
import { GroupInfo } from "@/components/features/group/group-info";
import HouseHeader from "@/components/features/group/house-header";
import { LiabilitiesDrawer } from "@/components/features/group/liabilities-drawer";
import BreadcrumbWrapper from "@/components/layout/breadcrumb-wrapper";
import { getExpenseList } from "@actions/expenses/getExpenseList";
import { getById } from "@actions/groups/getById";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@ui/breadcrumb";
import { Button } from "@ui/button";
import { Separator } from "@ui/separator";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Explicit component for breadcrumb
function GroupBreadcrumb({ name, groupId }: { name: string; groupId: string }) {
  return (
    <BreadcrumbItem>
      <BreadcrumbLink asChild>
        <Link href={`/dashboard/groups/${groupId}`}>{name}</Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
  );
}

export default async function HousePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: groupId } = await params;

  const { data: group } = await getById(groupId);

  if (!group) {
    notFound();
  }

  const { data: formattedExpenses } = await getExpenseList({
    groupId,
    limit: 10,
  });

  if (!formattedExpenses?.length) {
    return (
      <div>
        <div className="mb-4">
          <BreadcrumbWrapper>
            <GroupBreadcrumb name={group.name} groupId={groupId} />
          </BreadcrumbWrapper>
        </div>
        <div className="grid gap-6">
          <GroupInfo />
          <div className="rounded-lg border p-6 text-center">
            <p className="text-lg font-medium">No expenses yet</p>
            <p className="mb-4 text-sm text-muted-foreground">
              Create your first expense to get started
            </p>
            <Link href={`/dashboard/groups/${groupId}/create`}>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Expense
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <BreadcrumbWrapper>
          <BreadcrumbSeparator />
          <GroupBreadcrumb name={group.name} groupId={groupId} />
        </BreadcrumbWrapper>
      </div>
      <div className="grid gap-6">
        <GroupInfo />
        <div>
          <HouseHeader houseTitle={group.name} groupCode={group.code} />
          <div className="mt-6">
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
            <ExpensesTable data={formattedExpenses || []} />
          </div>

          <LiabilitiesDrawer groupId={group.id} />
        </div>
      </div>
    </div>
  );
}
