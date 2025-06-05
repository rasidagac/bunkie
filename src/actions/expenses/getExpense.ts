"use server";

import { cache } from "react";

import { createClient } from "@/utils/supabase/server";

export const getExpense = cache(async (id: string) => {
  const supabase = await createClient();

  const { data } = await supabase
    .from("expenses")
    .select("*")
    .eq("id", id)
    .single()
    .throwOnError();

  return data;
});
