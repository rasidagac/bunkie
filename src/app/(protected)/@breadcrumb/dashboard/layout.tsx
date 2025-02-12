import type { User } from "@clerk/nextjs/server";
import type { ReactNode } from "react";

import { currentUser } from "@clerk/nextjs/server";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@ui/breadcrumb";
import Link from "next/link";

export default async function Layout({ children }: { children: ReactNode }) {
  const user = (await currentUser()) as User;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">{user.username}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {children}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
