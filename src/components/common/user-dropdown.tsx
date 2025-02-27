import { currentUser } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";

import UserDropdownContent from "./user-dropdown-content";
export default async function UserDropdown() {
  const { user, error } = await currentUser();

  if (error) {
    return null;
  }

  const email = user?.email || "";
  const userMetadata = user?.user_metadata || {};

  // Extract first letter of email for fallback
  const fallbackInitial = email?.[0] || "U";

  // Get display name (username from email or full name if available)
  const displayName = userMetadata?.full_name || email?.split("@")[0] || "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-md transition-colors hover:bg-muted focus:outline-none">
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage src={userMetadata.avatar_url} alt={email} />
            <AvatarFallback className="text-xs">
              {fallbackInitial.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <UserDropdownContent />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
