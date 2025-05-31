"use server";

import { cookies } from "next/headers";
import { cache } from "react";

import type { Tables } from "@/types/supabase";

export const getCurrentGroup = cache(async () => {
  const cookieStore = await cookies();
  const currentGroup = cookieStore.get("currentGroup");

  if (currentGroup?.value) {
    return JSON.parse(currentGroup.value) as Tables<"groups">;
  }

  return null;
});
