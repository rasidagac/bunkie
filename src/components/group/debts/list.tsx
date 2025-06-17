import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import { toast } from "sonner";

import type { Group } from "@/types/groups";

import { getDebtsWithProfiles } from "@/actions/debts/getDebtsWithProfiles";
import { settleDebts } from "@/lib/utils";

import { DebtsItem } from "./item";

interface DebtsListProps {
  groupId: Group["id"];
}

export async function DebtsList({ groupId }: DebtsListProps) {
  const { data: balances, error } = await getDebtsWithProfiles(groupId);

  if (error) {
    toast.error("Failed to fetch debts");
    return null;
  }

  const debts = settleDebts(balances);

  return (
    <Table className="mx-auto w-11/12">
      <TableHeader>
        <TableRow>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {debts.length > 0 ? (
          debts.map((debt) => <DebtsItem key={debt.id} {...debt} />)
        ) : (
          <TableRow>
            <TableCell className="text-center" colSpan={3}>
              No debts found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
