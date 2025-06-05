"use client";

import type {
  SubmitErrorHandler,
  SubmitHandler,
  UseFormProps,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ui/button";
import { FileInput } from "@ui/file-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
import { Input } from "@ui/input";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { formSchema } from "@/schema/expense";
import { ExpenseCreateFormValues } from "@/types/expenses";

interface ExpenseFormProps {
  defaultValues: UseFormProps<ExpenseCreateFormValues>["defaultValues"];
  onInvalid?: SubmitErrorHandler<ExpenseCreateFormValues>;
  onValid: SubmitHandler<ExpenseCreateFormValues>;
}

export function ExpenseForm({
  defaultValues,
  onInvalid,
  onValid,
}: ExpenseFormProps) {
  const form = useForm<ExpenseCreateFormValues>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const buttonDisabled = useMemo(
    () => form.formState.isSubmitting || !form.formState.isDirty,
    [form.formState.isSubmitting, form.formState.isDirty],
  );

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onValid, onInvalid)}
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
        <Button disabled={buttonDisabled} type="submit">
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
