"use client";

import type { User } from "@supabase/supabase-js";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@ui/drawer";
import { useRouter } from "next/navigation";
import { use, useEffect, useState, useTransition } from "react";

import { getCurrentUser } from "@/actions/auth/getCurrentUser";
import {
  CreatePage,
  CreatePageSkeleton,
} from "@/components/expense/create-page";

const MODAL_CLOSE_DELAY_MS = 200;

export default function CreateExpenseModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: groupId } = use(params);
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState<null | User>(null);

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => {
        router.back();
      }, MODAL_CLOSE_DELAY_MS); // Delay to allow modal close animation to complete
    }
  }

  useEffect(() => {
    startTransition(async () => {
      const user = await getCurrentUser();
      setUser(user);
    });
  }, []);

  return (
    <Drawer onOpenChange={handleOpenChange} open={isOpen}>
      <DrawerContent className="p-4">
        <DrawerHeader className="hidden">
          <DrawerTitle>Create Expense</DrawerTitle>
          <DrawerDescription>
            Create a new expense for the group.
          </DrawerDescription>
        </DrawerHeader>
        {isPending || !user ? (
          <CreatePageSkeleton />
        ) : (
          <CreatePage groupId={groupId} userId={user.id} />
        )}
      </DrawerContent>
    </Drawer>
  );
}
