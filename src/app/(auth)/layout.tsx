import type { ReactNode } from "react";

import ThemeToggle from "@/components/common/theme-toggle";
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-medium">
          <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Bunkie Inc.
        </Link>
        <ThemeToggle />
      </header>
      <main className="flex grow flex-col items-center justify-center">
        {children}
      </main>
    </>
  );
}
