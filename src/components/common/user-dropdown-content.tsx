"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { createClient } from "@/utils/supabase/client";

import { DropdownMenuItem } from "../ui/dropdown-menu";

export default function UserDropdownContent() {
  const { auth } = createClient();
  const router = useRouter();

  async function handleSignOut() {
    await auth.signOut();
    router.push("/");
  }

  return (
    <>
      {/* <DropdownMenuItem asChild>
        <Link href="/dashboard" className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          Manage Account
        </Link>
      </DropdownMenuItem> */}
      <DropdownMenuItem
        className="text-destructive focus:text-destructive cursor-pointer"
        onClick={handleSignOut}
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>Sign Out</span>
      </DropdownMenuItem>
    </>
  );
}
