import { z } from "zod";

export const formSchema = z.object({
  title: z.string().nonempty(),
  amount: z.coerce.number().positive(),
  currency: z.string().optional(),
  split_type: z.enum(["equal", "custom", "percentage"]).default("equal"),
  image: z.array(z.union([z.instanceof(File), z.string()])).optional(),
});
