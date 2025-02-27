import { ExpensesTable } from "@/components/features/group/expenses-table";
import { GroupBreadcrumb } from "@/components/features/group/group-breadcrumb";
import { GroupHeader } from "@/components/features/group/house-header";
import { Tables } from "@/types/supabase";
import { Button } from "@ui/button";
import { Separator } from "@ui/separator";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

type ExpenseWithProfile = {
  id: string;
  created_at: string;
  title: string;
  full_name: string | null;
  image_url: string | null;
  amount: string;
  debt: { text: string; amount: string };
};

interface GroupPageContentProps {
  currentGroup: Tables<"groups">;
  formattedExpenses: ExpenseWithProfile[];
}

export async function GroupPageContent({
  currentGroup,
  formattedExpenses,
}: GroupPageContentProps) {
  const { id: groupId, name, code } = currentGroup;

  return (
    <div>
      <div className="mb-4">
        <GroupBreadcrumb name={name} groupId={groupId} />
      </div>
      <div className="grid gap-6">
        <div>
          <GroupHeader groupName={name} groupCode={code} />
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Latest Expenses</h2>
              <Link href={`/dashboard/groups/${groupId}/create`}>
                <Button size="sm" variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Expense
                </Button>
              </Link>
            </div>
            <Separator className="my-2" />
            <ExpensesTable data={formattedExpenses} />
          </div>
        </div>
      </div>
    </div>
  );
}
