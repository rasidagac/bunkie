import ExpensesTable from "@/components/house/expenses-table";
import HouseHeader from "@/components/house/house-header";
import LiabilitiesDrawer from "@/components/house/liabilities-drawer";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@lib/prisma";
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

  const user = await currentUser();

  const house = await prisma.houses.findFirst({
    where: { code: decodedCode },
  });

  if (!house) {
    notFound();
  }

  const expenses = await prisma.expenses.findMany({
    where: { house_id: house.id },
    orderBy: { created_at: "desc" },
    include: { users: true },
    take: 10,
  });

  const usersCountOfHouse = await prisma.house_users.count({
    where: { house_id: house.id },
  });

  const balances: {
    amount: string;
    creditor: string;
    creditor_name: string;
    debtor: string;
    debtor_name: string;
  }[] = await prisma.$queryRaw`
    SELECT
      es.user_id AS debtor,
      debtor.full_name AS debtor_name,  
      e.user_id AS creditor,
      creditor.full_name AS creditor_name, 
      CAST(SUM(es.amount) AS TEXT) AS amount  -- Convert Decimal to string
    FROM expense_splits es
      JOIN expenses e ON es.expense_id = e.id
      JOIN users debtor ON es.user_id = debtor.id 
      JOIN users creditor ON e.user_id = creditor.id 
    WHERE es.user_id = ${user?.id}
      AND e.house_id = ${house.id} 
    GROUP BY es.user_id, debtor.full_name, e.user_id, creditor.full_name;
`;

  return (
    <div className="flex h-full flex-col gap-4">
      <HouseHeader houseTitle={house.title} code={code} />
      <div className="mt-2 flex items-center gap-2">
        <Button size="sm" variant="outline">
          Settle up
        </Button>
        <LiabilitiesDrawer houseTitle={house.title} balances={balances} />
        <Link href={`/dashboard/houses/${decodedCode}/create`}>
          <Button size="sm" variant="outline">
            <PlusCircle /> Add expense
          </Button>
        </Link>
      </div>
      <Separator className="w-1/3" />
      <ExpensesTable data={expenses} userCount={usersCountOfHouse} />
      <Link href={`/dashboard/houses/${decodedCode}/expenses`}>
        <Button size="sm" variant="outline" className="w-full">
          View all expenses
        </Button>
      </Link>
    </div>
  );
}
