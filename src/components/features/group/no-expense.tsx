import type { Tables } from "@/types/supabase";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "lucide-react";

import { GroupBreadcrumb } from "./group-breadcrumb";

export function NoExpense({
  currentGroup,
}: {
  currentGroup: Tables<"groups">;
}) {
  return (
    <div>
      <div className="mb-4">
        <GroupBreadcrumb name={currentGroup.name} groupId={currentGroup.id} />
      </div>
      <div className="grid gap-6">
        <div className="rounded-lg border p-6 text-center">
          <p className="text-lg font-medium">No expenses yet</p>
          <p className="text-muted-foreground mb-4 text-sm">
            Create your first expense to get started
          </p>
          <Link href={`/dashboard/groups/${currentGroup.id}/create`}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Expense
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
