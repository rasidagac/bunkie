"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@ui/drawer";
import { usePathname, useRouter } from "next/navigation";

import { CreatePage } from "@/components/expense/create-page";

interface CreatePageDrawerProps {
  groupId: string;
  userId: string;
}

export function CreatePageDrawer({ groupId, userId }: CreatePageDrawerProps) {
  const router = useRouter();

  const pathname = usePathname();

  const isOpen = pathname === `/groups/${groupId}/create`;

  function handleOpenChange(open: boolean) {
    if (!open) {
      router.back();
    }
  }

  return (
    <Drawer onOpenChange={handleOpenChange} open={isOpen}>
      <DrawerContent className="p-4">
        <DrawerHeader className="hidden">
          <DrawerTitle>Create Expense</DrawerTitle>
          <DrawerDescription>
            Create a new expense for the group.
          </DrawerDescription>
        </DrawerHeader>
        <CreatePage groupId={groupId} userId={userId} />
      </DrawerContent>
    </Drawer>
  );
}
