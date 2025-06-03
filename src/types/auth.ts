import { z } from "zod";

import { signInSchema, signUpSchema } from "@/schema/auth";

import type { Tables } from "./supabase";

export type User = Tables<"profiles">;

// Auth forms values
export type SignInFormValues = z.infer<typeof signInSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
