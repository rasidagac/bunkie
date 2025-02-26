"use client";

import type { Tables } from "@/types/supabase";

import { createContext, useContext, useState, ReactNode, useMemo } from "react";

type Group = Tables<"groups">;

type GroupContextType = {
  currentGroup: Group | null;
  setCurrentGroup: (group: Group | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

const GroupContext = createContext<GroupContextType | undefined>(undefined);

type GroupProviderProps = {
  children: ReactNode;
  initialGroup?: Group | null;
};

export function GroupProvider({
  children,
  initialGroup = null,
}: GroupProviderProps) {
  const [currentGroup, setCurrentGroup] = useState<Group | null>(initialGroup);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const value = useMemo(
    () => ({
      currentGroup,
      setCurrentGroup,
      isLoading,
      setIsLoading,
    }),
    [currentGroup, isLoading],
  );

  return (
    <GroupContext.Provider value={value}>{children}</GroupContext.Provider>
  );
}

export function useGroup() {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error("useGroup must be used within a GroupProvider");
  }
  return context;
}
