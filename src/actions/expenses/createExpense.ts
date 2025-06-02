"use server";

import uploadFile from "@actions/upload/uploadFile";
import { revalidatePath } from "next/cache";

import type { ExpenseCreateFormValues } from "@/types/expenses";

import { createClient } from "@/utils/supabase/server";

export default async function createExpense(
  groupId: string,
  userId: string,
  values: ExpenseCreateFormValues,
) {
  const { title, amount, currency, image, split_type } = values;
  let image_url = null;
  const supabase = await createClient();

  if (image && image.length > 0) {
    try {
      const blob = await uploadFile(image[0], `${groupId}/${image[0].name}`);
      image_url = blob.downloadUrl;
    } catch (error) {
      throw error;
    }
  }

  const { data, error } = await supabase
    .from("expenses")
    .insert({
      title,
      amount,
      image_url,
      currency,
      split_type,
      user_id: userId,
      group_id: groupId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/dashboard/groups/${groupId}`);
  return data;
}
