"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/utils/supabase/server";

export async function deleteExpense(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/group/[id]");
}
