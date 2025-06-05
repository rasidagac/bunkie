"use client";

import type {
  SubmitHandler,
  SubmitErrorHandler,
  UseFormProps,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ui/button";
import { FileInput } from "@ui/file-input";
import {
  Form,
  FormLabel,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
} from "@ui/form";
import { Input } from "@ui/input";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { formSchema } from "@/schema/expense";
import { ExpenseCreateFormValues } from "@/types/expenses";

interface ExpenseFormProps {
  onValid: SubmitHandler<ExpenseCreateFormValues>;
  onInvalid?: SubmitErrorHandler<ExpenseCreateFormValues>;
  defaultValues: UseFormProps<ExpenseCreateFormValues>["defaultValues"];
}

export function ExpenseForm({
  onValid,
  onInvalid,
  defaultValues,
}: ExpenseFormProps) {
  const form = useForm<ExpenseCreateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const buttonDisabled = useMemo(
    () => form.formState.isSubmitting || !form.formState.isDirty,
    [form.formState.isSubmitting, form.formState.isDirty],
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onValid, onInvalid)}
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
        <Button type="submit" disabled={buttonDisabled}>
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="animate-spin" />
              Creating...
            </>
          ) : (
            "Create Expense"
          )}
        </Button>
      </form>
    </Form>
  );
}
