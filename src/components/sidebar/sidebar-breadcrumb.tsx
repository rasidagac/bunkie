"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useMemo } from "react";

export default function SidebarBreadcrumb() {
  const pathname = usePathname();

  const breadcrumbItems = useMemo(
    () =>
      pathname
        .split("/")
        .slice(2)
        .map((item, index, array) => {
          if (array[index - 1] === "houses") {
            return <BreadcrumbSeparator key={item} />;
          }

          return (
            <Fragment key={item}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {item.charAt(0).toUpperCase() + item.substring(1)}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </Fragment>
          );
        }),
    [pathname],
  );

  return (
    <Breadcrumb id="breadcrumb">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbItems}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
