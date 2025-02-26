"use client";

import { useAuth } from "@/lib/supabase/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { Loader2 } from "lucide-react";

export default function UserAvatar() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Extract first letter of email for fallback
  const fallbackInitial = user.email?.[0] || "U";

  // Get display name (username from email or full name if available)
  const displayName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "";

  return (
    <div className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-muted">
      <Avatar className="h-6 w-6 border border-border">
        {user.user_metadata?.avatar_url ? (
          <AvatarImage
            src={user.user_metadata?.avatar_url}
            alt={user.email || ""}
          />
        ) : (
          <AvatarFallback className="text-xs">
            {fallbackInitial.toUpperCase()}
          </AvatarFallback>
        )}
      </Avatar>
      <span className="text-xs font-medium text-foreground">{displayName}</span>
    </div>
  );
}
