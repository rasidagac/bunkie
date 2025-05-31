"use server";

import { cache } from "react";

import { currentUser } from "@/lib/supabase";
import { createClient } from "@/utils/supabase/server";

export const getUserGroups = cache(async () => {
  const supabase = await createClient();
  const { user } = await currentUser();

  const { data, error } = await supabase
    .from("group_users")
    .select(
      `
      groups:groups(*)
    `,
    )
    .eq("user_id", user!.id);

  if (error) {
    console.error("Error fetching user groups:", error);
    return { data: null, error };
  }

  const groups = data.map((group) => group.groups!);

  return { data: groups!, error: null };
});
