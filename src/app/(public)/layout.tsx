import type { ReactNode } from "react";

import { Button } from "@ui/button";
import Link from "next/link";

import ThemeToggle from "@/components/common/theme-toggle";
import { createClient } from "@/utils/supabase/server";

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const headerButton = {
    href: user ? "/dashboard" : "/auth/login",
    label: user ? "Dashboard" : "Login",
  };

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b px-4">
        <Link className="text-lg font-bold" href="/">
          Bunkie
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href={headerButton.href}>
            <Button className="rounded-full">{headerButton.label}</Button>
          </Link>
        </div>
      </header>
      <main className="container grow">{children}</main>
      <footer className="h-14 bg-gray-100 py-4 shadow-xs">
        <p className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Bunkie. All rights reserved.
        </p>
      </footer>
    </>
  );
}
