import type { ReactNode } from "react";

import prisma from "@lib/prisma";
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

  const house = await prisma.houses.findFirst({
    where: { code },
  });

  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href="/dashboard">{house?.title}</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      {children}
    </>
  );
}
