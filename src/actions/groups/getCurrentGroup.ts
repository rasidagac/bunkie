"use server";

import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

export const getCurrentGroup = cache(async (groupId: string) => {
  const supabase = await createClient();

  // Get the group with its members
  const { data, error } = await supabase
    .from("groups")
    .select(
      `
      *,
      members:group_users(
        user:profiles(*)
      )
    `,
    )
    .eq("id", groupId)
    .single();

  if (error) {
    console.error("Error fetching group:", error);
    return { group: null, error };
  }

  return { group: data, error: null };
});
