import type { ReactNode } from "react";

import ThemeToggle from "@/components/common/theme-toggle";
import { currentUser } from "@/lib/supabase";
import { Button } from "@ui/button";
import Link from "next/link";

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = await currentUser();

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b px-4">
        <Link className="text-lg font-bold" href="/">
          Bunkie
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <Link href="/sign-in">
              <Button className="rounded-full">Sign in</Button>
            </Link>
          ) : (
            <Link href="/dashboard">
              <Button className="rounded-full" size="sm">
                Dashboard
              </Button>
            </Link>
          )}
        </div>
      </header>
      <main className="container flex-grow">{children}</main>
      <footer className="h-14 bg-gray-100 py-4 shadow-sm">
        <p className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Bunkie. All rights reserved.
        </p>
      </footer>
    </>
  );
}
