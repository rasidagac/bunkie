import type { ReactNode } from "react";

import ThemeToggle from "@/components/theme-toggle";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "@ui/button";
import Link from "next/link";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="flex h-16 items-center justify-between border-b px-4">
        <Link className="text-lg font-bold" href="/">
          Bunkie
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <SignedOut>
            <SignInButton>
              <Button className="rounded-full">Sign in</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button className="rounded-full" size="sm">
                Dashboard
              </Button>
            </Link>
          </SignedIn>
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
