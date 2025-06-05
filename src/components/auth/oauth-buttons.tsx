"use client";

import type { ButtonProps } from "@ui/button";
import type { ReactNode } from "react";

import { Provider } from "@supabase/supabase-js";
import { Button } from "@ui/button";
import { Form } from "@ui/form";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createClient } from "@/utils/supabase/client";

interface OAuthButtonProps extends ButtonProps {
  icon: ReactNode;
  label: string;
  provider: Provider;
}

export function OAuthButton({
  icon,
  label,
  provider,
  ...props
}: OAuthButtonProps) {
  const form = useForm();

  async function onValid() {
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
        provider,
      });

      if (error) throw error;
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to login with ${label}`,
      );
    }
  }

  const isLoading =
    form.formState.isSubmitting || form.formState.isSubmitSuccessful;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onValid)}>
        <Button disabled={isLoading} {...props}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : icon}
          {isLoading ? "Logging in..." : `Continue with ${label}`}
        </Button>
      </form>
    </Form>
  );
}
