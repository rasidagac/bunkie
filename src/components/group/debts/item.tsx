import { TableCell, TableRow } from "@ui/table";

import type { Profile } from "@/types/auth";

interface DebtsItemProps {
  amount: number;
  from: Profile;
  to: Profile;
}

export function DebtsItem({ amount, from, to }: DebtsItemProps) {
  return (
    <TableRow>
      <TableCell>
        <div>{from.full_name}</div>
      </TableCell>
      <TableCell>
        <div>{to.full_name}</div>
      </TableCell>
      <TableCell className="text-right font-bold">{amount}</TableCell>
    </TableRow>
  );
}
