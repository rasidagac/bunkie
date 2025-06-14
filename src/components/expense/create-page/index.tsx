"use client";

import { Separator } from "@ui/separator";
import { toast } from "sonner";

import type { ExpenseCreateFormValues } from "@/types/expenses";

import createExpense from "@/actions/expenses/createExpense";

import { ExpenseForm } from "../expense-form";

interface CreatePageProps {
  groupId: string;
  userId: string;
}

export function CreatePage({ groupId, userId }: CreatePageProps) {
  function onValid(data: ExpenseCreateFormValues) {
    const createExpensePromise = createExpense(groupId, userId, data);

    toast.promise(createExpensePromise, {
      error: "Failed to create expense",
      loading: "Creating expense...",
      success: "Expense created successfully",
    });
  }

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-bold">Create Expense</h1>
      <Separator className="w-1/3" />
      <ExpenseForm
        defaultValues={{
          amount: 0,
          currency: "TRY",
          image: [],
          split_type: "equal",
          title: "",
        }}
        onInvalid={(data) => {
          console.log(data);
        }}
        onValid={onValid}
      />
    </div>
  );
}

export { CreatePageSkeleton } from "./skeleton";
