import type { ReactNode } from "react";

import { currentUser } from "@/lib/supabase";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@ui/breadcrumb";
import Link from "next/link";

export default async function Layout({ children }: { children: ReactNode }) {
  const { user } = await currentUser();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">{user?.user_metadata.user_name}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {children}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
