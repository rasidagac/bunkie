import type { ReactNode } from "react";

import { Separator } from "@ui/separator";

import BackButton from "@/components/common/back-button";
import ThemeToggle from "@/components/common/theme-toggle";
import UserDropdown from "@/components/common/user-dropdown";
import { GroupSwitcher } from "@/components/features/group/group-switcher";

export default function ProtectedLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b-2 px-4 transition-[width,height] ease-linear">
        <div className="flex items-center gap-3">
          <BackButton />
          <GroupSwitcher />
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Separator className="h-6" orientation="vertical" />
          <UserDropdown />
        </div>
      </header>
      <main className="container p-4">{children}</main>
      <div>{modal}</div>
    </>
  );
}
