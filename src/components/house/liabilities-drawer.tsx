"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "@ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@ui/drawer";

interface LiabilitiesDrawerProps {
  houseTitle: string;
  balances: {
    amount: string;
    creditor: string;
    creditor_name: string;
    debtor: string;
    debtor_name: string;
  }[];
}

export default function LiabilitiesDrawer({
  houseTitle,
  balances,
}: LiabilitiesDrawerProps) {
  const { user } = useUser();

  const myDebtors = balances.filter((debt) => debt.creditor === user?.id);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size="sm" variant="outline">
          Liabilities
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Liabilities for {houseTitle}</DrawerTitle>
          <DrawerDescription>People who owe you money</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-2 p-6">
          {myDebtors.map((debt, index) => (
            <div
              key={index}
              className="flex justify-between rounded-full border border-gray-200 px-4 py-2 text-base"
            >
              <span>{debt.debtor_name}</span>
              <span>
                {Number(debt.amount).toLocaleString("tr-TR", {
                  style: "currency",
                  currency: "TRY",
                })}
              </span>
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
