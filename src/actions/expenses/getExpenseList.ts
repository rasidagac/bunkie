"use server";

import { format } from "date-fns";
import { cache } from "react";

import { createClient } from "@/utils/supabase/server";

type ExpensesWithProfiles = {
  id: string;
  created_at: string;
  title: string;
  amount: number;
  image_url: string | null;
  currency: string;
  user_id: string;
  profiles: {
    full_name: string | null;
  };
};

export const getExpenseList = cache(
  async ({ groupId, limit }: { groupId: string; limit?: number }) => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const query = supabase
      .from("expenses")
      .select(
        `
    id,
    created_at,
    title,
    amount,
    image_url,
    currency,
    user_id,
    profiles (
      full_name
    )
  `,
      )
      .eq("group_id", groupId);

    if (limit) {
      query.limit(limit);
    }

    const { data: expensesWithProfiles, error } = await query;

    const { data: groupUsers, error: groupUsersError } = await supabase
      .from("group_users")
      .select("user_id")
      .eq("group_id", groupId);

    if (error || groupUsersError) {
      console.error(error || groupUsersError);
    }

    const userCount = groupUsers ? groupUsers.length : 1;

    const data = formattedExpenses(
      expensesWithProfiles,
      userCount,
      user?.id as string,
    );

    return { data, error: error || groupUsersError };
  },
);

function formattedExpenses(
  data: ExpensesWithProfiles[] | null,
  userCount: number,
  userId: string,
) {
  return data?.map((expense) => {
    const pricePerUser = expense.amount / userCount;

    const debtAmount = pricePerUser.toLocaleString("tr-TR", {
      style: "currency",
      currency: expense.currency,
    });

    const debtInfo = {
      text: expense.user_id === userId ? "You lent" : "You borrowed",
      amount: debtAmount,
    };

    return {
      id: expense.id,
      created_at: format(expense.created_at, "MMM \n dd"),
      title: expense.title,
      full_name: expense.profiles.full_name,
      image_url: expense.image_url,
      amount: expense.amount.toLocaleString("tr-TR", {
        style: "currency",
        currency: expense.currency,
      }),
      debt: debtInfo,
    };
  });
}
