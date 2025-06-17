"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { deleteExpense } from "@/actions/expenses/deleteExpense";
import { SwipeableList } from "@/components/swipeable-list";

interface ExpensesTableProps {
  data: ExpenseWithProfile[];
  groupId: string;
}

type ExpenseWithProfile = {
  amount: string;
  created_at: string;
  debt: { amount: string; text: string };
  full_name: null | string;
  id: string;
  image_url: null | string;
  title: string;
};

export function ExpensesTable({ data, groupId }: ExpensesTableProps) {
  const router = useRouter();

  const handleEdit = (item: ExpenseWithProfile) => {
    router.push(`/groups/${groupId}/expenses/${item.id}`);
  };

  const handleDelete = async (id: string) => {
    await deleteExpense(id);
  };

  const renderItem = useCallback((expense: ExpenseWithProfile) => {
    return (
      <div className="grid grid-cols-12 grid-rows-1 items-center gap-2 text-xs">
        <div className="w-min text-center">{expense.created_at}</div>
        <div className="relative aspect-square bg-gray-200">
          <Image
            alt={expense.title}
            className="p-0.5"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={expense.image_url || "/receipt-text.svg"}
          />
        </div>
        <div className="col-span-7 flex flex-col">
          <div className="truncate font-semibold">{expense.title}</div>
          <div className="text-muted-foreground flex items-center gap-1">
            <span className="truncate font-semibold">{expense.full_name}</span>
            <span className="font-semibold">paid</span>
            <span className="font-semibold">{expense.amount}</span>
          </div>
        </div>
        <div className="col-span-3 col-start-10 text-right">
          <div>{expense.debt.text}</div>
          <div className="truncate">{expense.debt.amount}</div>
        </div>
      </div>
    );
  }, []);

  return (
    <SwipeableList
      data={data}
      onDelete={handleDelete}
      onEdit={handleEdit}
      renderItem={renderItem}
    />
  );
}
