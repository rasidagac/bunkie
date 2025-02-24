import type { ReactNode } from "react";

import { getByCode } from "@/actions/groups/getByCode";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@ui/breadcrumb";
import Link from "next/link";

type Params = Promise<{ code: string }>;

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Params;
}) {
  const { code } = await params;
  const decodedCode = decodeURIComponent(code);

  const group = await getByCode(decodedCode);

  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href="/dashboard">{group.data?.name}</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      {children}
    </>
  );
}
