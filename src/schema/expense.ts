import { z } from "zod";

import { Constants } from "@/types/supabase";

const currencyEnum = Constants.public.Enums.currency_enum;

export const formSchema = z.object({
  amount: z.coerce.number<number>().positive(),
  currency: z.enum(currencyEnum).optional(),
  image: z.array(z.instanceof(File)).optional(),
  split_type: z.enum(["equal", "custom", "percentage"]),
  title: z.string().nonempty(),
});
