"use server";

import { cache } from "react";

import { createClient } from "@/utils/supabase/server";

export const getDebtsWithProfiles = cache(async (groupId: string) => {
  const supabase = await createClient();

  const { data: balances, error: balancesError } = await supabase
    .from("group_balances")
    .select("user_id, balance")
    .eq("group_id", groupId);

  if (balancesError) {
    return {
      data: null,
      error: balancesError,
    };
  }

  const userIds = balances.map((b) => b.user_id);

  const { data: users, error: usersError } = await supabase
    .from("profiles")
    .select("*")
    .in("id", userIds);

  if (usersError) {
    return {
      data: null,
      error: usersError,
    };
  }

  const enriched = balances.map((balance) => ({
    ...balance,
    user: users.find((u) => u.id === balance.user_id)!,
  }));

  return {
    data: enriched,
    error: null,
  };
});
