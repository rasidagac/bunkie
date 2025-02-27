import type { ReactNode } from "react";

import ThemeToggle from "@/components/common/theme-toggle";
import UserAvatar from "@/components/common/user-avatar";
import { AppSidebar } from "@/components/layout";
import { GroupProvider } from "@/components/providers/group-provider";
import { Separator } from "@ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@ui/sidebar";

export default function PublicLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <GroupProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b-2 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="h-4" />
              <UserAvatar />
            </div>
            <ThemeToggle />
          </header>
          <main className="container flex-grow p-4">{children}</main>
        </SidebarInset>
      </SidebarProvider>
      <div>{modal}</div>
    </GroupProvider>
  );
}
