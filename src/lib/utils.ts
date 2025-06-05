import type { ClassValue } from "clsx";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
