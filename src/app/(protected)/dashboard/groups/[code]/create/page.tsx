import CreateExpenseForm from "@/components/expense/create-expense-form";
import { currentUser } from "@/lib/supabase";
import { getByCode } from "@actions/groups/getByCode";
import { Separator } from "@ui/separator";
import { notFound } from "next/navigation";

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
    <div className="flex h-full flex-col gap-2">
      <h1 className="text-xl font-bold">Create expense</h1>
      <Separator className="w-1/3" />
      <CreateExpenseForm groupId={group.id} userId={user?.id as string} />
    </div>
  );
}
