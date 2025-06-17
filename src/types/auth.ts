import type { z } from "zod";

import type { signInSchema, signUpSchema } from "@/schema/auth";

import type { Tables } from "./supabase";

export type Profile = Tables<"profiles">;

// Auth forms values
export type SignInFormValues = z.infer<typeof signInSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
