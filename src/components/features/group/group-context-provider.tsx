"use client";

import { useCurrentGroup } from "@/hooks/use-current-group";
import { ReactNode } from "react";

interface GroupContextProviderProps {
  children: ReactNode;
  groupId: string;
}

export function GroupContextProvider({
  children,
  groupId,
}: GroupContextProviderProps) {
  const { group, isLoading, error } = useCurrentGroup(groupId);

  if (isLoading) {
    return <div>Loading group data...</div>;
  }

  if (error) {
    return <div>Error loading group: {error}</div>;
  }

  if (!group) {
    return <div>Group not found</div>;
  }

  return <>{children}</>;
}
