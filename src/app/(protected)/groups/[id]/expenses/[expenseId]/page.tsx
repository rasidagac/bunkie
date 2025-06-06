import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@ui/breadcrumb";
import { notFound } from "next/navigation";

import { getExpense } from "@/actions/expenses/getExpense";
import { getById } from "@/actions/groups/getById";
import { EditPage } from "@/components/expense/edit-page";
import { BreadcrumbWrapper } from "@/components/layout";

export default async function ExpensePage({
  params,
}: {
  params: Promise<{ expenseId: string; id: string }>;
}) {
  const { expenseId, id: groupId } = await params;
  const expense = await getExpense(expenseId);

  if (!expense) {
    notFound();
  }

  const group = await getById(groupId);

  return (
    <div className="space-y-4">
      <BreadcrumbWrapper>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={`/groups/${groupId}`}>
            {group.data?.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
      </BreadcrumbWrapper>
      <EditPage expense={expense} groupId={groupId} />
    </div>
  );
}
