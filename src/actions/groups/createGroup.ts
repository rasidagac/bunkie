"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export type CreateGroupState = { error: string } | null;

export async function createGroup(
  _prevState: CreateGroupState,
  formData: FormData,
): Promise<CreateGroupState> {
  const title = formData.get("title") as string;

  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  const { data: group, error: groupError } = await supabase
    .from("groups")
    .insert({
      name: title,
    })
    .select()
    .single();

  if (groupError) {
    console.error(groupError);
    return { error: "Failed to create group. Please try again." };
  }

  const { error: membershipError } = await supabase.from("memberships").insert({
    group_id: group.id,
    user_id: data.user?.id,
  });

  if (membershipError) {
    console.error(membershipError);
    await supabase.from("groups").delete().eq("id", group.id);
    return { error: "Failed to create group. Please try again." };
  }

  redirect(`/groups/${group.id}`);
}
