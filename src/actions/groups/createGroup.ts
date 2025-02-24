"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function createGroup(formData: FormData) {
  const title = formData.get("title") as string;

  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  const { data: group, error } = await supabase
    .from("groups")
    .insert({
      name: title,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return;
  }

  await supabase.from("group_users").insert({
    user_id: data.user?.id,
    group_id: group.id,
  });

  redirect(`../groups/${group?.code}`);
}
