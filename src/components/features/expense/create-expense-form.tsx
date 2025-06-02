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

import FormSubmitButton from "@/components/common/form-submit-button";
import { FileInput } from "@/components/ui/file-input";
import { toast } from "@/hooks/use-toast";
import { formSchema } from "@/schema/expense";
import { ExpenseCreateFormValues } from "@/types/expenses";

interface CreateExpenseFormProps {
  groupId: string;
  userId: string;
}

export default function CreateExpenseForm({
  groupId,
  userId,
}: CreateExpenseFormProps) {
  const form = useForm<ExpenseCreateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      amount: 0,
      currency: "TRY",
      split_type: "equal",
      image: [],
    },
  });

  async function handleSubmit(values: ExpenseCreateFormValues) {
    try {
      await createExpense(groupId, userId, values);
      form.reset();
      toast({ title: "Expense created successfully" });
    } catch (error) {
      console.error(error);
      toast({ title: "Failed to create expense" });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
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
