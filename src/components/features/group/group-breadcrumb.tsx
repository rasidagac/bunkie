import BreadcrumbWrapper from "@/components/layout/breadcrumb-wrapper";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@ui/breadcrumb";
import Link from "next/link";

export function GroupBreadcrumb({
  name,
  groupId,
}: {
  name: string;
  groupId: string;
}) {
  return (
    <BreadcrumbWrapper>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href={`/dashboard/groups/${groupId}`}>{name}</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
    </BreadcrumbWrapper>
  );
}
