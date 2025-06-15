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
import { toast } from "sonner";

import { getCurrentGroup } from "@/actions/groups/getCurrentGroup";
import { getUserGroups } from "@/actions/groups/getUserGroups";

import { GroupList } from "./group-list";

export async function GroupSwitcher() {
  const { data: currentGroup } = await getCurrentGroup();

  const { data: groups, error } = await getUserGroups();

  if (error) {
    toast.error("Error while fetching groups, please try again later.");
    return null;
  }

  return (
    <Drawer autoFocus>
      <DrawerTrigger asChild>
        <Button className="justify-start" variant="outline">
          {currentGroup ? currentGroup.name : "Select group"}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="px-4 py-0 text-left">
          <DrawerTitle>Select group</DrawerTitle>
          <DrawerDescription>Select a group to continue.</DrawerDescription>
        </DrawerHeader>
        <div className="mt-4 border-t">
          <GroupList data={groups} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
