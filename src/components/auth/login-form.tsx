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
import { Github } from "@ui/icons";
import { Input } from "@ui/input";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { SignInFormValues } from "@/types/auth";

import { signInSchema } from "@/schema/auth";
import { createClient } from "@/utils/supabase/client";

import { OAuthButton } from "./oauth-buttons";

export function SignInForm() {
  const router = useRouter();

  const form = useForm<SignInFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
  });

  async function onValid(values: SignInFormValues) {
    const supabase = createClient();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      if (data.user) {
        toast.success("Signed in successfully", {
          onAutoClose: () => router.replace("/groups"),
        });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign in failed");
      form.reset();
    }
  }

  return (
    <div className="space-y-4">
      <OAuthButton
        className="w-full"
        icon={<Github className="fill-foreground size-4" />}
        label="GitHub"
        provider="github"
        variant="outline"
      />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background text-muted-foreground px-2">
            Or continue with
          </span>
        </div>
      </div>
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
                    autoComplete="current-password"
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
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link className="underline underline-offset-4" href="/auth/sign-up">
          Sign up
        </Link>
      </div>
    </div>
  );
}
