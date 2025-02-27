"use client";

import BreadcrumbWrapper from "@/components/layout/breadcrumb-wrapper";
import { useGroup } from "@/hooks/use-group";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@ui/breadcrumb";
import Link from "next/link";

export default function CreateExpenseBreadcrumb() {
  const { currentGroup } = useGroup();

  if (!currentGroup) {
    return null;
  }

  return (
    <BreadcrumbWrapper>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href={`/dashboard/groups/${currentGroup.id}`}>
            {currentGroup.name}
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
    </BreadcrumbWrapper>
  );
}
