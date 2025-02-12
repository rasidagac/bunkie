import CopyToClipboard from "@/components/copy-to-clipboard";
import ExpensesTable from "@/components/house/expenses-table";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@lib/prisma";
import { Button } from "@ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@ui/drawer";
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

  const user = await currentUser();

  const house = await prisma.houses.findFirst({
    where: { code },
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
            es.user_id AS debtor_id,
            debtor.full_name AS debtor_name,  
            e.user_id AS creditor_id,
            creditor.full_name AS creditor_name, 
            SUM(es.amount) AS amount 
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
      <div>
        <h1 className="text-xl font-bold">{house.title}</h1>
        <CopyToClipboard
          textToCopy={code}
          label="Copy code"
          variant="ghost"
          className="h-fit p-0 text-gray-500"
        />
        <div className="mt-2 flex items-center gap-2">
          <Button size="sm" variant="outline">
            Settle up
          </Button>
          <Drawer>
            <DrawerTrigger asChild>
              <Button size="sm" variant="outline">
                Liabilities
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Liabilities for {house.title}</DrawerTitle>
                <DrawerDescription>
                  Settle up with your friends and housemates
                </DrawerDescription>
              </DrawerHeader>
              <div className="flex flex-col gap-2 p-6">
                {balances.map((debt, index) => (
                  <div
                    key={index}
                    className="flex justify-between rounded-full border border-gray-200 px-4 py-2 text-base"
                  >
                    <span>{debt.creditor_name}</span>
                    <span>{Number(debt.amount)}</span>
                  </div>
                ))}
              </div>
            </DrawerContent>
          </Drawer>
          <Link href={`/dashboard/houses/${code}/create`}>
            <Button size="sm" variant="outline">
              <PlusCircle /> Add expense
            </Button>
          </Link>
        </div>
      </div>
      <Separator className="w-1/3" />
      <ExpensesTable data={expenses} userCount={usersCountOfHouse} />
      <Link href={`/dashboard/houses/${code}/expenses`}>
        <Button size="sm" variant="outline" className="w-full">
          View all expenses
        </Button>
      </Link>
    </div>
  );
}
