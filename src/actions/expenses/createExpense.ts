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
  const { title, price, currency, image } = values;
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
    await prisma.expenses.create({
      data: { title, price, currency, image_url, user_id, house_id },
    });
  } catch (error) {
    console.error(error);
  }

  revalidatePath(`/dashboard/houses/${house_id}`);
}
