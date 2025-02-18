import { ScrollArea } from "@ui/scroll-area";
import Image from "next/image";

type ExpenseWithProfile = {
  id: string;
  created_at: string;
  title: string;
  full_name: string | null;
  image_url: string | null;
  amount: string;
  debt: { text: string; amount: string };
};

interface ExpensesTableProps {
  data: ExpenseWithProfile[];
}

export async function ExpensesTable({ data }: ExpensesTableProps) {
  return (
    <ScrollArea className="h-[500px] grow after:absolute after:bottom-0 after:h-8 after:w-full after:bg-gradient-to-b after:from-transparent after:to-background after:opacity-90">
      {data.map((expense) => (
        <div
          key={expense.id}
          className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-2 gap-x-4 text-xs"
        >
          <div className="w-min text-center">{expense.created_at}</div>
          <div className="bg-gray-200 p-1">
            <Image
              src={expense.image_url || "/window.svg"}
              width={25}
              height={25}
              alt={expense.title}
            />
          </div>
          <div className="flex flex-col">
            <div className="text-base font-bold">{expense.title}</div>
            <div className="text-gray-500">{`${expense.full_name} paid ${expense.amount}`}</div>
          </div>
          <div className="text-right">
            <div>{expense.debt.text}</div>
            <div>{expense.debt.amount}</div>
          </div>
        </div>
      ))}
    </ScrollArea>
  );
}
