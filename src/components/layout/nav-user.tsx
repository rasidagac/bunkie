"use client";

import { useAuth } from "@/lib/supabase/use-auth";
import { Button } from "@ui/button";
import { Loader2 } from "lucide-react";

export default function NavUser() {
  const { user, signOut, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">{user.email}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => signOut()}
        className="h-8 w-8 p-0"
      >
        Sign out
      </Button>
    </div>
  );
}
