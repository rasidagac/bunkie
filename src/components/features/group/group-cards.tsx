"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ui/card";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

import type { Tables } from "@/types/supabase";

import { setCurrentGroup } from "@/actions/groups/setCurrentGroup";

interface GroupCardsProps {
  groupsData: GroupsData;
}

type GroupsData = {
  all_users: {
    memberships: Array<{
      profiles: null | Tables<"profiles">;
    }> | null;
  } | null;
  groups: null | Tables<"groups">;
}[];

export function GroupCards({ groupsData }: GroupCardsProps) {
  const router = useRouter();

  async function handleCardClick(group: Tables<"groups">) {
    await setCurrentGroup(group.id);
    router.push(`/groups/${group.id}`);
  }

  return groupsData.map(({ all_users, groups }) => (
    <Card
      className="mb-4 cursor-pointer transition-shadow hover:shadow-md"
      key={groups?.id}
      onClick={() => handleCardClick(groups!)}
    >
      <CardHeader>
        <CardTitle className="text-xl">{groups?.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-2 pb-0">
        <div className="flex -space-x-5 hover:-space-x-2">
          {all_users?.memberships?.map(({ profiles }) => (
            <Avatar
              className="border-2 drop-shadow-xs transition-all ease-in-out"
              key={profiles?.id}
            >
              <AvatarImage
                alt={profiles?.username as string}
                src={profiles?.avatar_url as string}
              />
              <AvatarFallback>{profiles?.username?.[0]}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-end text-sm">
        View House <ChevronRight />
      </CardFooter>
    </Card>
  ));
}
