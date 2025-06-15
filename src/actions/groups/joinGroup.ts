"use server";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function joinGroup(
  _prevState: { error: string },
  formData: FormData,
) {
  const supabase = await createClient();
  const code = formData.get("code") as string;
  const { data: group } = await supabase
    .from("groups")
    .select()
    .eq("code", code)
    .single();

  if (!group) {
    return { error: "House not found" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "User not found" };
  }

  const { error: groupUserError } = await supabase.from("memberships").insert({
    group_id: group.id,
    user_id: user.id,
  });

  if (groupUserError) {
    return { error: "Failed to join house" };
  }

  redirect(`/groups/${group.id}`);
}
