import type { expenses, users } from "@prisma/client";

import { currentUser } from "@lib/supabase";
import { cn } from "@lib/utils";
import { ScrollArea } from "@ui/scroll-area";
import { format } from "date-fns";
import Image from "next/image";
import { JSX } from "react";

type expenseData = expenses & { users: users };

interface ExpensesTableProps {
  data: expenseData[];
  userCount: number;
}

const getMonthTitle = (date: Date | null) =>
  format(date || new Date(), "MMMM yyyy");

const MonthTitleRow = ({ title }: { title: string }) => (
  <h3 className="mt-4 text-sm font-bold first-of-type:mt-0">{title}</h3>
);

const ExpenseRow = async ({
  expense,
  userCount,
}: {
  expense: expenseData;
  userCount: number;
}) => {
  const { user } = await currentUser();
  const fullName = expense.users.full_name;
  const totalCost = expense.price.toNumber().toLocaleString("tr-TR", {
    style: "currency",
    currency: expense.currency,
  });

  const paidByUser = expense.users.id === user?.id;

  function getLiability() {
    const pricePerUser = expense.price.toNumber() / userCount;
    const localePricePerUser = pricePerUser.toLocaleString("tr-TR", {
      style: "currency",
      currency: expense.currency,
    });

    const text = paidByUser ? "you lent" : "you borrowed";

    return (
      <>
        <span>{text}</span>
        <span>{localePricePerUser}</span>
      </>
    );
  }

  return (
    <div className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-2.5 py-2">
      <div className="w-6 text-center text-xs">
        {format(expense.created_at, "MMM dd")}
      </div>
      <div className="w-7 bg-gray-200 p-1">
        <Image
          src={expense.image_url || "/file.svg"}
          alt={expense.title}
          width={24}
          height={24}
        />
      </div>
      <div className="title flex flex-col">
        <div className="text-xs font-bold">{expense.title}</div>
        <div className="text-xs text-gray-500">
          {`${fullName} paid ${totalCost}`}
        </div>
      </div>
      <div
        className={cn(
          "flex flex-col justify-end text-end text-xs font-medium",
          paidByUser ? "text-green-700" : "text-red-700",
        )}
      >
        {getLiability()}
      </div>
    </div>
  );
};

export async function ExpensesTable({ data, userCount }: ExpensesTableProps) {
  const { user } = await currentUser();

  if (!user) {
    return null;
  }

  const table = data.reduce<JSX.Element[]>((acc, expense, index) => {
    const currentMonth = getMonthTitle(expense.created_at as Date);
    const prevMonth =
      index > 0 ? getMonthTitle(data[index - 1].created_at as Date) : null;

    if (currentMonth !== prevMonth) {
      acc.push(<MonthTitleRow key={currentMonth} title={currentMonth} />);
    }

    acc.push(
      <ExpenseRow key={expense.id} expense={expense} userCount={userCount} />,
    );
    return acc;
  }, []);

  return (
    <ScrollArea className="h-[500px] grow after:absolute after:bottom-0 after:h-8 after:w-full after:bg-gradient-to-b after:from-transparent after:to-background after:opacity-90">
      {table}
    </ScrollArea>
  );
}
