import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@ui/breadcrumb";
import { notFound } from "next/navigation";

import { getCurrentUser } from "@/actions/auth/getCurrentUser";
import { getById } from "@/actions/groups/getById";
import { CreatePage } from "@/components/expense/create-page";
import { BreadcrumbWrapper } from "@/components/layout";

export default async function CreateExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: groupId } = await params;
  const { data: group, error } = await getById(groupId);

  if (error) {
    return notFound();
  }

  const user = await getCurrentUser();

  return (
    <>
      <BreadcrumbWrapper>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={`/groups/${groupId}`}>
            {group.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
      </BreadcrumbWrapper>
      <CreatePage groupId={groupId} userId={user.id} />
    </>
  );
}
