"use client";

import Image from "next/image";
import { useCallback } from "react";

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

  const renderItem = useCallback((expense: ExpenseWithProfile) => {
    return (
      <div className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-2 gap-x-2 text-xs">
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
    );
  }, []);

  return (
    <SwipeableList
      data={data}
      renderItem={renderItem}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
