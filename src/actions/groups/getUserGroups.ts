"use server";

import { cache } from "react";

import { createClient } from "@/utils/supabase/server";

import { getCurrentUser } from "../auth/getCurrentUser";

export const getUserGroups = cache(async () => {
  const supabase = await createClient();
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from("memberships")
    .select("groups(*)")
    .eq("user_id", user.id);

  if (error) {
    return { data: [], error };
  }
  const groups = data?.map((entry) => entry.groups) ?? [];

  return { data: groups, error: null };
});
