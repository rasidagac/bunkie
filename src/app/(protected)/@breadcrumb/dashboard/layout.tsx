import type { ReactNode } from "react";

import { createClient } from "@/utils/supabase/server";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@ui/breadcrumb";
import Link from "next/link";

export default async function Layout({ children }: { children: ReactNode }) {
  const supabase = await createClient();

  const user = await supabase.auth.getUser();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">
              {user.data.user?.user_metadata.username}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {children}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
