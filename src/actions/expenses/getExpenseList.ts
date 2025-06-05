"use server";

import { format } from "date-fns";
import { cache } from "react";

import type { ExpensesWithProfiles } from "@/types/expenses";

import { createClient } from "@/utils/supabase/server";

export const getExpenseList = cache(
  async ({ groupId, limit }: { groupId: string; limit?: number }) => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const query = supabase
      .from("expenses")
      .select("*, profile:profiles( full_name )")
      .eq("group_id", groupId);

    if (limit) {
      query.limit(limit);
    }

    const { data: expensesWithProfiles } = await query.throwOnError();

    const { data: groupUsers } = await supabase
      .from("memberships")
      .select("user_id")
      .eq("group_id", groupId)
      .throwOnError();

    const userCount = groupUsers ? groupUsers.length : 1;

    const data = formattedExpenses(
      expensesWithProfiles,
      userCount,
      user?.id as string,
    );

    return { data };
  },
);

function formattedExpenses(
  data: ExpensesWithProfiles[],
  userCount: number,
  userId: string,
) {
  return data.map((expense) => {
    const pricePerUser = expense.amount / userCount;

    const debtAmount = pricePerUser.toLocaleString("tr-TR", {
      currency: expense.currency,
      style: "currency",
    });

    const debtInfo = {
      amount: debtAmount,
      text: expense.user_id === userId ? "You lent" : "You borrowed",
    };

    return {
      amount: expense.amount.toLocaleString("tr-TR", {
        currency: expense.currency,
        style: "currency",
      }),
      created_at: format(expense.created_at, "MMM \n dd"),
      debt: debtInfo,
      full_name: expense.profile.full_name,
      id: expense.id,
      image_url: expense.image_url,
      title: expense.title,
    };
  });
}
