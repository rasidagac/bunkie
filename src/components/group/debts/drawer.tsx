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

import type { Group } from "@/types/groups";

import { DebtsList } from "./list";

interface DebtsDrawerProps {
  groupId: Group["id"];
}

export function DebtsDrawer({ groupId }: DebtsDrawerProps) {
  return (
    <Drawer autoFocus>
      <DrawerTrigger asChild>
        <Button className="w-fit rounded-full" size="sm" variant="outline">
          <Eye className="h-4 w-4" /> View Debts
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Debts</DrawerTitle>
          <DrawerDescription>
            View your current debts in this house
          </DrawerDescription>
        </DrawerHeader>
        <DebtsList groupId={groupId} />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
