import type { Tables } from "./supabase";

export type Expense = Tables<"expenses">;

export type ExpensesWithProfiles = Expense & {
  profile: {
    full_name: string | null;
  };
};
