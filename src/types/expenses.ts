import type { z } from "zod";

import type { formSchema } from "@/schema/expense";

import type { Tables } from "./supabase";

export type Expense = Tables<"expenses">;

export type ExpenseCreateFormValues = z.infer<typeof formSchema>;

export type ExpensesWithProfiles = {
  profile: {
    full_name: null | string;
  };
} & Expense;
