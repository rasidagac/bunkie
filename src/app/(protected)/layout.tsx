import type { ReactNode } from "react";

import { AppSidebar } from "@/components/sidebar";
import ThemeToggle from "@/components/theme-toggle";
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
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b-2 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
            <ThemeToggle />
          </header>
          <main className="container flex-grow p-4">{children}</main>
        </SidebarInset>
      </SidebarProvider>
      <div>{modal}</div>
    </>
  );
}
