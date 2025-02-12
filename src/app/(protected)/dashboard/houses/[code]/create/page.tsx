import CreateExpenseForm from "@/components/expense/create-expense-form";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@lib/prisma";
import { Separator } from "@ui/separator";
import { notFound } from "next/navigation";

export default async function CreateExpensePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const user = await currentUser();

  const house = await prisma.houses.findFirst({
    where: { code },
    select: { id: true },
  });

  if (!house) {
    notFound();
  }

  return (
    <div className="flex h-full flex-col gap-2">
      <h1 className="text-xl font-bold">Create expense</h1>
      <Separator className="w-1/3" />
      <CreateExpenseForm house_id={house.id} user_id={user?.id as string} />
    </div>
  );
}
