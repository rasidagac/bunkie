"use client";

import type { Tables } from "@/types/supabase";

import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ui/card";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

type GroupsData = {
  groups: Tables<"groups"> | null;
  all_users: {
    group_users: Array<{
      profiles: Tables<"profiles"> | null;
    }> | null;
  } | null;
}[];

interface GroupCardsProps {
  groupsData: GroupsData;
}

export function GroupCards({ groupsData }: GroupCardsProps) {
  const router = useRouter();

  async function handleCardClick(group: Tables<"groups">) {
    router.push(`/dashboard/groups/${group.id}`);
  }

  return groupsData.map(({ groups, all_users }) => (
    <Card
      onClick={() => handleCardClick(groups!)}
      key={groups?.id}
      className="mb-4 cursor-pointer transition-shadow hover:shadow-md"
    >
      <CardHeader>
        <CardTitle className="text-xl">{groups?.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-2 pb-0">
        <div className="flex -space-x-5 hover:-space-x-2">
          {all_users?.group_users?.map(({ profiles }) => (
            <Avatar
              key={profiles?.id}
              className="border-2 drop-shadow-xs transition-all ease-in-out"
            >
              <AvatarImage
                src={profiles?.avatar_url as string}
                alt={profiles?.username as string}
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
