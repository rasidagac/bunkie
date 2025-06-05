import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";

import { getCurrentUser } from "@/actions/auth/getCurrentUser";

import UserDropdownContent from "./user-dropdown-content";
export default async function UserDropdown() {
  const { email: userEmail, user_metadata } = await getCurrentUser();

  const { avatarAlt, avatarFallback, avatarSrc, displayName, email } = {
    avatarAlt: user_metadata.full_name || userEmail?.split("@")[0] || "",
    avatarFallback: userEmail ? userEmail[0] : "U",
    avatarSrc: user_metadata.avatar_url,
    displayName: user_metadata.full_name || userEmail?.split("@")[0] || "",
    email: userEmail,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="hover:bg-muted flex items-center gap-2 rounded-md transition-colors focus:outline-hidden">
          <Avatar className="border-border h-8 w-8 border">
            <AvatarImage alt={avatarAlt} src={avatarSrc} />
            <AvatarFallback className="text-xs">
              {avatarFallback.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">{displayName}</p>
            <p className="text-muted-foreground text-xs leading-none">
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
