"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

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

  await supabase.from("memberships").insert({
    group_id: group.id,
    user_id: data.user?.id,
  });

  redirect(`../groups/${group?.code}`);
}
