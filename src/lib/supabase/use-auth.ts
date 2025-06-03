"use client";

import type { User } from "@supabase/supabase-js";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { createClient } from "@/utils/supabase/client";

import { getRedirectURL } from "./get-redirect-url";

const redirectURL = getRedirectURL();

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithOAuth: (provider: Provider) => Promise<void>;
  signOut: () => Promise<void>;
}

type Provider = "github" | "google" | "discord" | "twitter";

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const { auth } = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [auth]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } = await auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      router.refresh();
    },
    [auth, router],
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      const { error } = await auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      router.refresh();
    },
    [auth, router],
  );

  const signOut = useCallback(async () => {
    const { error } = await auth.signOut();

    if (error) {
      throw error;
    }

    router.refresh();
  }, [router, auth]);

  const signInWithOAuth = useCallback(
    async (provider: Provider) => {
      const { error } = await auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${redirectURL}auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      router.refresh();
    },
    [auth, router],
  );

  return {
    user,
    isLoading,
    signIn,
    signUp,
    signInWithOAuth,
    signOut,
  };
}
