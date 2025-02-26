"use client";

import { useGroupContext } from "@/components/features/group/use-group-context";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Skeleton } from "@ui/skeleton";

export function GroupInfo() {
  const { group, isLoading, groupName, groupCode, groupMembers } =
    useGroupContext();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="mb-2 h-4 w-1/4" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!group) {
    return <div>Group not found</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{groupName}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          Group Code: <span className="font-mono">{groupCode}</span>
        </p>
        <div>
          <h3 className="mb-2 text-sm font-medium">Members</h3>
          <div className="flex flex-wrap gap-2">
            {groupMembers.map((member) => (
              <Avatar key={member.id} className="border-2 drop-shadow-sm">
                <AvatarImage
                  src={member.avatar_url || undefined}
                  alt={member.username || member.full_name || "Member"}
                />
                <AvatarFallback>
                  {(
                    member.username?.[0] ||
                    member.full_name?.[0] ||
                    "U"
                  ).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
