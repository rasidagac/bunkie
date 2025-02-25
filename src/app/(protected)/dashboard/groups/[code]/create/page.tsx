import BreadcrumbWrapper from "@/components/breadcrumb/breadcrumb-wrapper";
import CreateExpenseForm from "@/components/expense/create-expense-form";
import { currentUser } from "@/lib/supabase";
import { getByCode } from "@actions/groups/getByCode";
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
  code,
}: {
  groupName: string;
  code: string;
}) {
  return (
    <>
      <BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbLink asChild>
          <Link href={`/dashboard/groups/${code}`}>{groupName}</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>Create Expense</BreadcrumbItem>
    </>
  );
}

export default async function CreateExpensePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const decodedCode = decodeURIComponent(code);

  const { user } = await currentUser();

  const { data: group, error } = await getByCode(decodedCode);

  if (error) {
    notFound();
  }

  return (
    <div>
      <div className="mb-4">
        <BreadcrumbWrapper>
          <CreateExpenseBreadcrumb groupName={group.name} code={code} />
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
