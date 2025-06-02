import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@ui/breadcrumb";
import Link from "next/link";

import { getCurrentGroup } from "@/actions/groups/getCurrentGroup";
import BreadcrumbWrapper from "@/components/layout/breadcrumb-wrapper";

export default async function CreateExpenseBreadcrumb() {
  const currentGroup = await getCurrentGroup();

  return (
    <BreadcrumbWrapper>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href={`/groups/${currentGroup?.id}`}>{currentGroup?.name}</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
    </BreadcrumbWrapper>
  );
}
