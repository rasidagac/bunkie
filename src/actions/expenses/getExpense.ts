"use server";

import { createClient } from "@/utils/supabase/server";

export async function getExpense(id: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("expenses")
    .select("*")
    .eq("id", id)
    .single()
    .throwOnError();

  return data;
}
