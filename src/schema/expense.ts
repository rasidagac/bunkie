import { z } from "zod";

import { Constants } from "@/types/supabase";

const currencyEnum = Constants.public.Enums.currency_enum;

export const formSchema = z.object({
  title: z.string().nonempty(),
  amount: z.coerce.number().positive(),
  currency: z.enum(currencyEnum).optional(),
  split_type: z.enum(["equal", "custom", "percentage"]).default("equal"),
  image: z.array(z.union([z.instanceof(File), z.string()])).optional(),
});
