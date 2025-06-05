import { getExpense } from "@/actions/expenses/getExpense";
import { updateExpense } from "@/actions/expenses/updateExpense";
import { getById } from "@/actions/groups/getById";
import { ExpenseForm } from "@/components/expense/expense-form";
import { BreadcrumbWrapper } from "@/components/layout";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

export default async function ExpensePage({
  params,
}: {
  params: Promise<{ expenseId: string; id: string }>;
}) {
  const { expenseId, id: groupId } = await params;
  const { amount, currency, image_url, split_type, title } =
    await getExpense(expenseId);
  const group = await getById(groupId);

  const updateExpenseWithId = updateExpense.bind(null, expenseId, groupId);

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
      <div className="truncate text-xl font-bold">{title}</div>
      <Separator />
      <ExpenseForm
        defaultValues={{
          amount,
          currency,
          image: image_url ? [image_url] : [],
          split_type,
          title,
        }}
        onValid={updateExpenseWithId}
      />
    </div>
  );
}
