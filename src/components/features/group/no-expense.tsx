import { Frown, PlusCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { GroupBreadcrumb } from "./group-breadcrumb";

export function NoExpense({ groupId }: { groupId: string }) {
  return (
    <div className="space-y-6">
      <GroupBreadcrumb />
      <div className="space-y-4 rounded-lg border-2 border-dashed p-6 text-center">
        <Frown
          className="text-muted-foreground mx-auto h-10 w-10"
          aria-hidden="true"
        />
        <div>
          <p className="text-lg font-bold">No expenses yet</p>
          <p className="text-muted-foreground text-sm">
            Create your first expense to get started
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href={`/groups/${groupId}/create`}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Expense
          </Link>
        </Button>
      </div>
    </div>
  );
}
