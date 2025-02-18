"use server";
import { currentUser } from "@/lib/supabase";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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

  const { user } = await currentUser();

  if (!user) {
    return { error: "User not found" };
  }

  const { error: groupUserError } = await supabase.from("group_users").insert({
    user_id: user.id,
    group_id: group.id,
  });

  if (groupUserError) {
    return { error: "Failed to join house" };
  }

  redirect(`/dashboard/groups/${group.code}`);
}
