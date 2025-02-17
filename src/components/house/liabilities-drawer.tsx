import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/auth-js";
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

interface LiabilitiesDrawerProps {
  group: Tables<"groups">;
}

export async function LiabilitiesDrawer({ group }: LiabilitiesDrawerProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
    .neq("debtor", (user as User)?.id)
    .eq("group_id", group.id);

  console.log(user_balances);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          View Liabilities
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
          {user_balances.data?.map((balance) => (
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
          ))}
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
