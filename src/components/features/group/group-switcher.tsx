import type { Tables } from "@/types/supabase";

import { getById } from "@/actions/groups/getById";
import { Button } from "@ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@ui/drawer";
import { ChevronDown } from "lucide-react";
import { cookies } from "next/headers";

import { GroupList } from "./group-list";

export async function GroupSwitcher() {
  const cookieStore = await cookies();
  const currentGroup = cookieStore.get("currentGroup");
  let group: Tables<"groups"> | null = null;

  if (currentGroup?.value) {
    const { data } = await getById(currentGroup.value);
    if (data) {
      group = data;
    }
  }

  return (
    <Drawer autoFocus>
      <DrawerTrigger asChild>
        <Button variant="outline" className="justify-start">
          {group?.name || "Set group"}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="px-4 py-0 text-left">
          <DrawerTitle>Select group</DrawerTitle>
          <DrawerDescription>Select a group to continue.</DrawerDescription>
        </DrawerHeader>
        <div className="mt-4 border-t">
          <GroupList />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
