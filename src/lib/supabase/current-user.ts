"use server";

import { createClient } from "@/utils/supabase/server";

export async function currentUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return { user, error };
}
