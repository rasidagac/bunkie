import type { Tables } from "@/types/supabase";
import type { User } from "@supabase/auth-js";

import { currentUser } from "@/lib/supabase/current-user";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@ui/drawer";
import { Eye } from "lucide-react";

interface LiabilitiesDrawerProps {
  groupId: Tables<"groups">["id"];
}

export async function LiabilitiesDrawer({ groupId }: LiabilitiesDrawerProps) {
  const { user } = await currentUser();

  const supabase = await createClient();
  const user_balances = await supabase
    .from("user_balances")
    .select(
      `
      *,
      debtor:profiles!debtor (
        full_name    
      ),
      creditor:profiles!creditor (
        full_name    
      )
    `,
    )
    .neq("creditor", (user as User).id)
    .eq("group_id", groupId);

  return (
    <Drawer autoFocus>
      <DrawerTrigger asChild className="w-fit">
        <Button variant="outline" size="sm" className="rounded-full">
          <Eye className="h-4 w-4" /> View Liabilities
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Liabilities</DrawerTitle>
          <DrawerDescription>
            View your current liabilities in this house
          </DrawerDescription>
        </DrawerHeader>
        <div className="space-y-2 p-4">
          {user_balances.data?.length ? (
            user_balances.data?.map((balance) => (
              <div
                key={balance.id}
                className="flex items-center justify-between gap-2 rounded-full border px-3 py-2 text-base"
              >
                <div>{balance.creditor?.full_name}</div>
                <div>
                  {balance.amount?.toLocaleString("tr-TR", {
                    currency: "TRY",
                    style: "currency",
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              No liabilities found.
            </div>
          )}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
