"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
import { Input } from "@ui/input";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { SignUpFormValues } from "@/types/auth";

import { signUpSchema } from "@/schema/auth";
import { createClient } from "@/utils/supabase/client";

export function SignUpForm() {
  const router = useRouter();

  const form = useForm<SignUpFormValues>({
    defaultValues: {
      confirmPassword: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(signUpSchema),
  });

  async function onValid(values: SignUpFormValues) {
    const supabase = createClient();

    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (error) {
        throw error;
      }
      await new Promise((resolve) => {
        if (data.user) {
          toast.success("Signed up successfully", {
            onAutoClose: () => {
              resolve(true);
            },
          });
          router.replace("/groups");
        }
        resolve(false);
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign up failed");
    }
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onValid)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input autoComplete="email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="new-password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="new-password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="w-full"
            disabled={form.formState.isSubmitting}
            type="submit"
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link className="underline underline-offset-4" href="/auth/login">
          Sign in
        </Link>
      </div>
    </div>
  );
}
