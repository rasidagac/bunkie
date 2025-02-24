import type { ReactNode } from "react";

import { BreadcrumbItem, BreadcrumbSeparator } from "@ui/breadcrumb";

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>Create Expense</BreadcrumbItem>
      {children}
    </>
  );
}
