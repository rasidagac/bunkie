import { z } from "zod";

export const formSchema = z.object({
  title: z.string().nonempty(),
  amount: z.coerce.number().positive(),
  currency: z.union([z.literal("TRY"), z.literal("USD"), z.literal("EUR")]),
  split_type: z.enum(["equal", "custom", "percentage"]).default("equal"),
  image: z.array(z.instanceof(File)).length(1),
});
