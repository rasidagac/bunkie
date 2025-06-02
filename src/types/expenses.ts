import { z } from "zod";

import { formSchema } from "@/schema/expense";

import type { Tables } from "./supabase";

export type Expense = Tables<"expenses">;

export type ExpensesWithProfiles = Expense & {
  profile: {
    full_name: string | null;
  };
};

export type ExpenseCreateFormValues = z.infer<typeof formSchema>;
