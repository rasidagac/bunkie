"use server";

import { cookies } from "next/headers";
import { cache } from "react";
import { validate } from "uuid";

import { createClient } from "@/utils/supabase/server";

export const getCurrentGroup = cache(async () => {
  const cookieStore = await cookies();
  const currentGroup = cookieStore.get("currentGroup");

  const supabase = await createClient();

  if (currentGroup && validate(currentGroup.value)) {
    const { data: group } = await supabase
      .from("groups")
      .select("*")
      .eq("id", currentGroup.value)
      .single()
      .throwOnError();

    return group;
  }

  return null;
});
