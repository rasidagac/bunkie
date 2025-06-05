import type { ExpenseCreateFormValues } from "@/types/expenses";

import uploadFile from "@/actions/upload/uploadFile";

/**
 * Handles image upload and returns the image URL or null.
 * @param image - The image data from the form
 * @param groupId - The ID of the group for file path construction
 * @returns Promise<string | null> - The URL of the uploaded image or null if no image
 */
export async function getImageUrl(
  image: ExpenseCreateFormValues["image"],
  groupId: string,
): Promise<string | null> {
  if (!image || image.length === 0) return null;

  const firstImage = image[0];
  if (firstImage instanceof File) {
    const blob = await uploadFile(firstImage, `${groupId}/${firstImage.name}`);
    return blob.url;
  }
  return firstImage;
}
