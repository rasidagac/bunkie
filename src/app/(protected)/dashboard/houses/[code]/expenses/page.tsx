import ExpensesTable from "@/components/house/expenses-table";
import prisma from "@lib/prisma";
import { Separator } from "@ui/separator";
import { notFound } from "next/navigation";

export default async function ExpensesPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

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
  });

  const usersCountOfHouse = await prisma.house_users.count({
    where: { house_id: house.id },
  });

  return (
    <div className="flex h-full flex-col gap-2">
      <h1 className="text-xl font-bold">All expenses</h1>
      <Separator className="w-1/3" />
      <ExpensesTable data={expenses} userCount={usersCountOfHouse} />
    </div>
  );
}
