import type { ClassValue } from "clsx";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

import type { Profile } from "@/types/auth";

type Balance = {
  balance: number;
  user: Profile;
  user_id: string;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getFileFromImageUrl(imageUrl: string): Promise<File> {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const extension = imageUrl.split(".").pop() || "jpg";
    const fileName = imageUrl.split("/").pop() || `${Date.now()}.${extension}`;

    const file = new File([blob], fileName, { type: blob.type });

    return file;
  } catch (error) {
    console.error("Error converting image URL to File:", error);
    throw error;
  }
}

export function settleDebts(balances: Balance[]) {
  const debtors = balances
    .filter((b) => b.balance > 0)
    .sort((a, b) => b.balance - a.balance);
  const creditors = balances
    .filter((b) => b.balance < 0)
    .sort((a, b) => a.balance - b.balance);

  const settlements = [];

  let i = 0,
    j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(debtor.balance, -creditor.balance);

    settlements.push({
      amount,
      from: debtor.user,
      id: uuidv4(),
      to: creditor.user,
    });

    debtor.balance -= amount;
    creditor.balance += amount;

    if (Math.abs(debtor.balance) < Number.EPSILON) i++;
    if (Math.abs(creditor.balance) < Number.EPSILON) j++;
  }

  return settlements;
}
