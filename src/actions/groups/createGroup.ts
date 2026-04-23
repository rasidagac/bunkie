"use server";

import { redirect } from "next/navigation";

import { setCurrentGroup } from "@/actions/groups/setCurrentGroup";
import { createClient } from "@/utils/supabase/server";

export async function createGroup(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const title = (formData.get("title") as string)?.trim();

  if (!title) {
    return { error: "Group name is required." };
  }

  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getUser();

  const { data: group, error: groupError } = await supabase
    .from("groups")
    .insert({
      name: title,
    })
    .select()
    .single();

  if (groupError || !group) {
    return { error: "Failed to create group. Please try again." };
  }

  const { error: membershipError } = await supabase.from("memberships").insert({
    group_id: group.id,
    user_id: authData.user?.id,
  });

  if (membershipError) {
    return {
      error:
        "Group created but membership could not be set. Please contact support.",
    };
  }

  await setCurrentGroup(group.id);
  redirect(`/groups/${group.id}`);
}
