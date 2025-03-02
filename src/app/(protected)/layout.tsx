import type { ReactNode } from "react";

import ThemeToggle from "@/components/common/theme-toggle";
import UserDropdown from "@/components/common/user-dropdown";
import { GroupSwitcher } from "@/components/features/group/group-switcher";
import { GroupProvider } from "@/components/providers/group-provider";
import { Separator } from "@ui/separator";

export default async function ProtectedLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <GroupProvider>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b-2 px-4 transition-[width,height] ease-linear">
        <div className="flex items-center gap-3">
          <GroupSwitcher />
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Separator orientation="vertical" className="h-6" />
          <UserDropdown />
        </div>
      </header>
      <main className="container p-4">{children}</main>
      <div>{modal}</div>
    </GroupProvider>
  );
}
