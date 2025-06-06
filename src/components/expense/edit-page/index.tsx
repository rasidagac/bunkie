"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui/alert-dialog";
import { Button } from "@ui/button";
import { Separator } from "@ui/separator";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import type { Expense, ExpenseCreateFormValues } from "@/types/expenses";

import { deleteExpense } from "@/actions/expenses/deleteExpense";
import { updateExpense } from "@/actions/expenses/updateExpense";
import { getFileFromImageUrl } from "@/lib/utils";

import { ExpenseForm } from "../expense-form";

interface EditPageProps {
  expense: Expense;
  groupId: string;
}

export function EditPage({ expense, groupId }: EditPageProps) {
  const { amount, currency, id, image_url, split_type, title } = expense;
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);

  async function onValid(values: ExpenseCreateFormValues) {
    try {
      await updateExpense(id, groupId, values);
      toast.success("Expense updated");
    } catch {
      toast.error("Failed to update expense");
    }
  }

  function onDelete() {
    const res = deleteExpense(id);
    toast.promise(res, {
      error: "Failed to delete expense",
      loading: "Deleting expense...",
      success: "Expense deleted",
    });

    router.push(`/groups/${groupId}`);
  }

  async function defaultValues() {
    let image: File[] = [];
    if (image_url) {
      image = [await getFileFromImageUrl(image_url)];
    }

    return {
      amount,
      currency,
      image,
      split_type,
      title,
    };
  }

  return (
    <>
      <div className="grid grid-cols-12 items-center gap-2">
        <div className="col-span-9 truncate text-xl font-bold">{title}</div>
        <div className="col-span-3 flex justify-end gap-2">
          <Button
            className="justify-self-end"
            onClick={() => setIsEditing(!isEditing)}
            size="icon"
            variant="outline"
          >
            <Pencil className="size-4" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="justify-self-end"
                size="icon"
                variant="destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  expense.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} variant="destructive">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <Separator />
      <ExpenseForm
        defaultValues={defaultValues}
        disabled={!isEditing}
        onValid={onValid}
      />
    </>
  );
}
