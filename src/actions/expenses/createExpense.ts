"use server";

import type { TablesInsert } from "@/types/supabase";

import { createClient } from "@/utils/supabase/server";
import uploadFile from "@actions/upload/uploadFile";
import { revalidatePath } from "next/cache";

export default async function createExpense(
  groupId: string,
  userId: string,
  values: TablesInsert<"expenses"> & { image: File[] },
) {
  const { title, amount, currency, image, split_type } = values;
  let image_url = null;

  if (image?.length) {
    try {
      const blob = await uploadFile(image[0], groupId);
      image_url = blob.downloadUrl;
    } catch (error) {
      console.error(error);
    }
  }

  try {
    const supabase = await createClient();

    await supabase.from("expenses").insert({
      title,
      amount,
      image_url,
      currency,
      split_type,
      user_id: userId,
      group_id: groupId,
    });

    revalidatePath(`/dashboard/groups/${groupId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to create expense:", error);
    return { success: false, error: "Failed to create expense" };
  }
}
