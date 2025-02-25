import BreadcrumbWrapper from "@/components/breadcrumb/breadcrumb-wrapper";
import { ExpensesTable } from "@/components/house/expenses-table";
import HouseHeader from "@/components/house/house-header";
import { LiabilitiesDrawer } from "@/components/house/liabilities-drawer";
import { getExpenseList } from "@actions/expenses/getExpenseList";
import { getByCode } from "@actions/groups/getByCode";
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
function GroupBreadcrumb({ name, code }: { name: string; code: string }) {
  return (
    <BreadcrumbItem>
      <BreadcrumbLink asChild>
        <Link href={`/dashboard/groups/${code}`}>{name}</Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
  );
}

export default async function HousePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const decodedCode = decodeURIComponent(code);

  const { data: group } = await getByCode(decodedCode);

  if (!group) {
    notFound();
  }

  const { data: formattedExpenses } = await getExpenseList({
    groupId: group.id,
    limit: 10,
  });

  if (!formattedExpenses?.length) {
    return (
      <div>
        <div className="mb-4">
          <BreadcrumbWrapper>
            <GroupBreadcrumb name={group.name} code={code} />
          </BreadcrumbWrapper>
        </div>
        <div>No expenses yet</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <BreadcrumbWrapper>
          <BreadcrumbSeparator />
          <GroupBreadcrumb name={group.name} code={code} />
        </BreadcrumbWrapper>
      </div>
      <div>
        <HouseHeader houseTitle={group.name} code={code} />
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Latest Expenses</h2>
            <Link href={`/dashboard/groups/${code}/create`}>
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
  );
}
