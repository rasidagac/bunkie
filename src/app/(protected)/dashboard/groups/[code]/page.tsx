import HouseHeader from "@/components/house/house-header";
import { LiabilitiesDrawer } from "@/components/house/liabilities-drawer";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@ui/button";
import { Separator } from "@ui/separator";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function HousePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const decodedCode = decodeURIComponent(code);

  const supabase = await createClient();
  const { data: group } = await supabase
    .from("groups")
    .select()
    .eq("code", decodedCode)
    .single();

  if (!group) {
    notFound();
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <HouseHeader houseTitle={group.name} code={code} />
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline">
          Settle up
        </Button>
        <LiabilitiesDrawer group={group} />
        <Link href={`/dashboard/houses/${decodedCode}/create`}>
          <Button size="sm" variant="outline">
            <PlusCircle /> Add expense
          </Button>
        </Link>
      </div>
      <Separator className="w-1/3" />
      {/* <ExpensesTable data={expenses} userCount={usersCountOfHouse} /> */}
      <Link href={`/dashboard/houses/${decodedCode}/expenses`}>
        <Button size="sm" variant="outline" className="w-full">
          View all expenses
        </Button>
      </Link>
    </div>
  );
}
