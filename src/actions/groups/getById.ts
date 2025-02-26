"use server";

import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

export const getById = cache(async (id: string) => {
  const supabase = await createClient();
  return supabase.from("groups").select("*").eq("id", id).single();
});
