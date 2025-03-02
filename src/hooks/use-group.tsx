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

// Split into separate contexts for each value
type GroupDataContextType = {
  currentGroup: Group | null;
};

type GroupActionsContextType = {
  setCurrentGroup: (group: Group | null) => void;
};

type GroupLoadingContextType = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

const GroupDataContext = createContext<GroupDataContextType | undefined>(
  undefined,
);
const GroupActionsContext = createContext<GroupActionsContextType | undefined>(
  undefined,
);
const GroupLoadingContext = createContext<GroupLoadingContextType | undefined>(
  undefined,
);

type GroupProviderProps = {
  children: ReactNode;
};

export function GroupProvider({ children }: GroupProviderProps) {
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    } finally {
      setIsLoading(false);
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

  // Memoize each context value separately
  const dataValue = useMemo(
    () => ({
      currentGroup,
    }),
    [currentGroup],
  );

  const actionsValue = useMemo(
    () => ({
      setCurrentGroup: updateCurrentGroup,
    }),
    [],
  );

  const loadingValue = useMemo(
    () => ({
      isLoading,
      setIsLoading,
    }),
    [isLoading],
  );

  // Nest providers to minimize rerenders
  return (
    <GroupActionsContext.Provider value={actionsValue}>
      <GroupDataContext.Provider value={dataValue}>
        <GroupLoadingContext.Provider value={loadingValue}>
          {children}
        </GroupLoadingContext.Provider>
      </GroupDataContext.Provider>
    </GroupActionsContext.Provider>
  );
}

// Split hooks for accessing different parts of the context
export function useGroupData() {
  const context = useContext(GroupDataContext);
  if (context === undefined) {
    throw new Error("useGroupData must be used within a GroupProvider");
  }
  return context;
}

export function useGroupActions() {
  const context = useContext(GroupActionsContext);
  if (context === undefined) {
    throw new Error("useGroupActions must be used within a GroupProvider");
  }
  return context;
}

export function useGroupLoading() {
  const context = useContext(GroupLoadingContext);
  if (context === undefined) {
    throw new Error("useGroupLoading must be used within a GroupProvider");
  }
  return context;
}

// Keep the original hook for backward compatibility
export function useGroup() {
  const dataContext = useContext(GroupDataContext);
  const actionsContext = useContext(GroupActionsContext);
  const loadingContext = useContext(GroupLoadingContext);

  if (
    dataContext === undefined ||
    actionsContext === undefined ||
    loadingContext === undefined
  ) {
    throw new Error("useGroup must be used within a GroupProvider");
  }

  return {
    ...dataContext,
    ...actionsContext,
    ...loadingContext,
  };
}
