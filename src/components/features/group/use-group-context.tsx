"use client";

import { useGroup } from "@/hooks/use-group";
import { Tables } from "@/types/supabase";

// Define a type for the group with members
type GroupWithMembers = Tables<"groups"> & {
  members?: Array<{
    user: Tables<"profiles">;
  }>;
};

export function useGroupContext() {
  const { currentGroup, isLoading } = useGroup();

  // Cast the currentGroup to GroupWithMembers
  const groupWithMembers = currentGroup as GroupWithMembers | null;

  return {
    group: currentGroup,
    isLoading,
    groupId: currentGroup?.id,
    groupName: currentGroup?.name,
    groupCode: currentGroup?.code,
    groupMembers: groupWithMembers?.members?.map((member) => member.user) || [],
  };
}
