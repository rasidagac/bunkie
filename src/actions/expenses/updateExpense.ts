"use server";

import { revalidatePath } from "next/cache";

import type { ExpenseCreateFormValues } from "@/types/expenses";

import { getImageUrl } from "@/utils/image/get-image-url";
import { createClient } from "@/utils/supabase/server";

/**
 * Updates an expense in the database and revalidates the group dashboard page.
 */
export async function updateExpense(
  id: string,
  groupId: string,
  data: ExpenseCreateFormValues,
) {
  const supabase = await createClient();
  let image_url: string | null = null;

  try {
    image_url = await getImageUrl(data.image, groupId);

    const rest = data;
    const { error } = await supabase
      .from("expenses")
      .update({
        ...rest,
        image_url,
      })
      .eq("id", id);

    if (error) throw error;

    revalidatePath(`/dashboard/groups/${groupId}`, "page");
  } catch (error) {
    throw error;
  }
}
