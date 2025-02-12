"use server";

import { currentUser } from "@clerk/nextjs/server";
import prisma from "@lib/prisma";
import { redirect } from "next/navigation";

export async function joinHouse(
  _prevState: { error: string },
  formData: FormData,
) {
  const code = formData.get("code") as string;
  const house = await prisma.houses.findFirst({
    where: { code },
  });

  if (!house) {
    return { error: "House not found" };
  }

  const user = await currentUser();
  await prisma.house_users.create({
    data: {
      user_id: user?.id,
      house_id: house.id,
    },
  });

  redirect(`/dashboard/houses/${house.code}`);
}
