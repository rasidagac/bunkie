"use client";

import Image from "next/image";

import { deleteExpense } from "@/actions/expenses/deleteExpense";
import { SwipeableList } from "@/components/swipeable-list";

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

export function ExpensesTable({ data }: ExpensesTableProps) {
  const handleEdit = async (item: ExpenseWithProfile) => {
    console.log("Edit item:", item);
  };

  const handleDelete = async (id: string) => {
    await deleteExpense(id);
  };

  const renderItem = (expense: ExpenseWithProfile) => {
    return (
      <div className="grid grid-cols-10 grid-rows-1 items-center gap-2 text-xs">
        <div className="w-min text-center">{expense.created_at}</div>
        <div className="relative aspect-square bg-gray-200">
          <Image
            src={expense.image_url || "/receipt-text.svg"}
            fill
            objectFit="cover"
            className="p-0.5"
            alt={expense.title}
          />
        </div>
        <div className="col-span-6 flex flex-col">
          <div className="truncate font-semibold">{expense.title}</div>
          <div className="text-muted-foreground truncate">{`${expense.full_name} paid ${expense.amount}`}</div>
        </div>
        <div className="col-span-2 col-start-9 text-right">
          <div>{expense.debt.text}</div>
          <div className="truncate">{expense.debt.amount}</div>
        </div>
      </div>
    );
  };

  return (
    <SwipeableList
      data={data}
      renderItem={renderItem}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
