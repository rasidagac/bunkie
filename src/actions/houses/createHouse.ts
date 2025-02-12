"use server";

import prisma from "@lib/prisma";
import { redirect } from "next/navigation";

export async function createHouse(formData: FormData) {
  const title = formData.get("title") as string;
  const house = await prisma.houses.create({
    data: { title },
  });

  redirect(`../houses/${house.code}`);
}
