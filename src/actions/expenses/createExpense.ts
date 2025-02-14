"use server";

import { CreateExpenseValues } from "@/components/expense/create-expense-form";
import uploadFile from "@actions/upload/uploadFile";
import prisma from "@lib/prisma";
import { revalidatePath } from "next/cache";

export default async function createExpense(
  house_id: string,
  user_id: string,
  values: CreateExpenseValues,
) {
  const { title, price, currency, image, split_type } = values;
  let image_url = null;

  if (image?.length) {
    try {
      const blob = await uploadFile(image[0], house_id);
      image_url = blob.downloadUrl;
    } catch (error) {
      console.error(error);
    }
  }

  try {
    const expense = await prisma.expenses.create({
      data: {
        title,
        price,
        currency,
        split_type,
        image_url,
        user_id,
        house_id,
      },
    });

    // Create equal splits based on split_type
    if (split_type === "equal") {
      const houseUsers = await prisma.house_users.findMany({
        where: {
          house_id: house_id,
          user_id: { not: null },
        },
      });

      const splitAmount = price / houseUsers.length;

      await prisma.expense_splits.createMany({
        data: houseUsers.map((user) => ({
          expense_id: expense.id,
          user_id: user.user_id!,
          amount: splitAmount,
        })),
      });
    }
    // For now, other split types will be handled in future implementations

    revalidatePath(`/dashboard/houses/${house_id}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to create expense:", error);
    return { success: false, error: "Failed to create expense" };
  }
}
