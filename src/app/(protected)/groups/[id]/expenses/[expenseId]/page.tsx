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
  params: Promise<{ id: string; expenseId: string }>;
}) {
  const { expenseId, id: groupId } = await params;
  const { title, amount, currency, split_type, image_url } =
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
        onValid={updateExpenseWithId}
        defaultValues={{
          title,
          amount,
          currency,
          split_type,
          image: image_url ? [image_url] : [],
        }}
      />
    </div>
  );
}
