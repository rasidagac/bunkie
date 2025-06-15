"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const setCurrentGroup = async (groupId: string) => {
  const cookieStore = await cookies();

  cookieStore.set("currentGroup", groupId);

  revalidatePath("(protected)/", "layout");
};
