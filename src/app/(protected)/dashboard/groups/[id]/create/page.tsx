import { getById } from "@/actions/groups/getById";
import CreateExpenseForm from "@/components/features/expense/create-expense-form";
import BreadcrumbWrapper from "@/components/layout/breadcrumb-wrapper";
import { currentUser } from "@/lib/supabase";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@ui/breadcrumb";
import { Separator } from "@ui/separator";
import Link from "next/link";
import { notFound } from "next/navigation";

// Explicit component for breadcrumb
function CreateExpenseBreadcrumb({
  groupName,
  groupId,
}: {
  groupName: string;
  groupId: string;
}) {
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href={`/dashboard/groups/${groupId}`}>{groupName}</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
    </>
  );
}

export default async function CreateExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: groupId } = await params;

  const { user } = await currentUser();

  const { data: group, error } = await getById(groupId);

  if (error) {
    notFound();
  }

  return (
    <div>
      <div className="mb-4">
        <BreadcrumbWrapper>
          <CreateExpenseBreadcrumb groupName={group.name} groupId={groupId} />
        </BreadcrumbWrapper>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold">Create Expense</h1>
        <Separator className="w-1/3" />
        <CreateExpenseForm groupId={group.id} userId={user?.id as string} />
      </div>
    </div>
  );
}
