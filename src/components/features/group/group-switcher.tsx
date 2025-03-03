import { getCurrentGroup } from "@/actions/groups/getCurrentGroup";
import { getUserGroups } from "@/actions/groups/getUserGroups";
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

import { GroupList } from "./group-list";

export async function GroupSwitcher() {
  const currentGroup = await getCurrentGroup();

  const { data: groups } = await getUserGroups();

  return (
    <Drawer autoFocus>
      <DrawerTrigger asChild>
        <Button variant="outline" className="justify-start">
          {currentGroup?.name || "Set group"}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="px-4 py-0 text-left">
          <DrawerTitle>Select group</DrawerTitle>
          <DrawerDescription>Select a group to continue.</DrawerDescription>
        </DrawerHeader>
        <div className="mt-4 border-t">
          <GroupList data={groups ?? []} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
