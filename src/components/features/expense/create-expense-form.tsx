"use client";

import createExpense from "@actions/expenses/createExpense";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
import { Input } from "@ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { ExpenseCreateFormValues } from "@/types/expenses";

import FormSubmitButton from "@/components/common/form-submit-button";
import { FileInput } from "@/components/ui/file-input";
import { formSchema } from "@/schema/expense";

interface CreateExpenseFormProps {
  groupId: string;
  userId: string;
}

export default function CreateExpenseForm({
  groupId,
  userId,
}: CreateExpenseFormProps) {
  const form = useForm<ExpenseCreateFormValues>({
    defaultValues: {
      amount: 0,
      currency: "TRY",
      image: [],
      split_type: "equal",
      title: "",
    },
    resolver: zodResolver(formSchema),
  });

  async function handleSubmit(values: ExpenseCreateFormValues) {
    try {
      await createExpense(groupId, userId, values);
      form.reset();
      toast.success("Expense created successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create expense");
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expense Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <FileInput accept="image/*" maxFiles={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormSubmitButton>Create Expense</FormSubmitButton>
      </form>
    </Form>
  );
}
