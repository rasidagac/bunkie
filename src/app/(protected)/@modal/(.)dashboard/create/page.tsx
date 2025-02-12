"use client";

import CreateHouseForm from "@/components/house/create-house-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@ui/dialog";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function CreateHousePage() {
  const router = useRouter();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function handleOpenChange(open: boolean) {
    if (!open) {
      timeoutRef.current = setTimeout(() => router.back(), 200);
    }
  }

  return (
    <Dialog defaultOpen onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm rounded-md">
        <DialogHeader>
          <DialogTitle>Create a House</DialogTitle>
          <DialogDescription>
            Create a new house to get started.
          </DialogDescription>
        </DialogHeader>
        <CreateHouseForm />
      </DialogContent>
    </Dialog>
  );
}
