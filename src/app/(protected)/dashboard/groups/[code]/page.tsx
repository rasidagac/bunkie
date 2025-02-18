import { ExpensesTable } from "@/components/house/expenses-table";
import HouseHeader from "@/components/house/house-header";
import { LiabilitiesDrawer } from "@/components/house/liabilities-drawer";
import { getExpenseList } from "@actions/expenses/getExpenseList";
import { getByCode } from "@actions/groups/getByCode";
import { Button } from "@ui/button";
import { Separator } from "@ui/separator";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

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
    return <div>No expenses yet</div>;
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <HouseHeader houseTitle={group.name} code={code} />
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline">
          Settle up
        </Button>
        <LiabilitiesDrawer groupId={group.id} />
        <Link href={`/dashboard/groups/${decodedCode}/create`}>
          <Button size="sm" variant="outline">
            <PlusCircle /> Add expense
          </Button>
        </Link>
      </div>
      <Separator className="w-1/3" />
      <ExpensesTable data={formattedExpenses} />
      <Link href={`/dashboard/groups/${decodedCode}/expenses`}>
        <Button size="sm" variant="outline" className="w-full">
          View all expenses
        </Button>
      </Link>
    </div>
  );
}
