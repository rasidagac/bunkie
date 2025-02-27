import type { ReactNode } from "react";

import ThemeToggle from "@/components/common/theme-toggle";
import UserDropdown from "@/components/common/user-dropdown";
import { GroupProvider } from "@/components/providers/group-provider";
import { Separator } from "@ui/separator";

export default function ProtectedLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <GroupProvider>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b-2 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2"></div>
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
