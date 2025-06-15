"use server";

import { revalidatePath } from "next/cache";

import type { ExpenseCreateFormValues } from "@/types/expenses";

import { getImageUrl } from "@/utils/image/get-image-url";
import { createClient } from "@/utils/supabase/server";

export default async function createExpense(
  groupId: string,
  userId: string,
  values: ExpenseCreateFormValues,
) {
  const { amount, currency, image, split_type, title } = values;
  const supabase = await createClient();
  let image_url: null | string = null;
  image_url = await getImageUrl(image, groupId);

  const { data, error } = await supabase
    .from("expenses")
    .insert({
      amount,
      currency,
      group_id: groupId,
      image_url,
      split_type,
      title,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath(`/groups/${groupId}`, "page");
  return data;
}
