"use server";

import { createClient } from "@/utils/supabase/server";

export async function getByCode(code: string) {
  const supabase = await createClient();
  return supabase.from("groups").select("*").eq("code", code).single();
}
