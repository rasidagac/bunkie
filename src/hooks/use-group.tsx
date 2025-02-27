"use client";

import type { Tables } from "@/types/supabase";

import { getById } from "@/actions/groups/getById";
import { useParams } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
} from "react";

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
};

export function GroupProvider({ children }: GroupProviderProps) {
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { id: groupId } = useParams<{ id: string }>();

  useEffect(() => {
    try {
      const storedGroup = sessionStorage.getItem("currentGroup");
      if (storedGroup) {
        setCurrentGroup(JSON.parse(storedGroup));
      } else {
        getById(groupId).then(({ data: group }) => {
          setCurrentGroup(group);
          sessionStorage.setItem("currentGroup", JSON.stringify(group));
        });
      }
    } catch (error) {
      console.error("Failed to load group from sessionStorage:", error);
    }
  }, [groupId]);

  // Custom setter that updates both state and sessionStorage
  const updateCurrentGroup = (group: Group | null) => {
    setCurrentGroup(group);
    try {
      if (group) {
        window.sessionStorage.setItem("currentGroup", JSON.stringify(group));
      } else {
        sessionStorage.removeItem("currentGroup");
      }
    } catch (error) {
      console.error("Failed to save group to sessionStorage:", error);
    }
  };

  const value = useMemo(
    () => ({
      currentGroup,
      setCurrentGroup: updateCurrentGroup,
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
