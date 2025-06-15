"use server";

import { cookies } from "next/headers";
import { validate } from "uuid";

import { createClient } from "@/utils/supabase/server";

export const getCurrentGroup = async () => {
  const cookieStore = await cookies();
  const currentGroup = cookieStore.get("currentGroup");

  const supabase = await createClient();

  if (currentGroup && validate(currentGroup.value)) {
    return await supabase
      .from("groups")
      .select("*")
      .eq("id", currentGroup.value)
      .single();
  }

  return { data: null, error: null };
};
