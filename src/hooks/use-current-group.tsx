"use client";

import { getCurrentGroup } from "@/actions/groups/getCurrentGroup";
import { useGroup } from "@/hooks/use-group";
import { useEffect, useState } from "react";

export function useCurrentGroup(groupId: string) {
  const { currentGroup, setCurrentGroup, isLoading, setIsLoading } = useGroup();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGroup() {
      if (!groupId) return;

      // If we already have the current group and it matches the requested ID, don't fetch again
      if (currentGroup && currentGroup.id === groupId) return;

      setIsLoading(true);
      setError(null);

      try {
        const { group, error } = await getCurrentGroup(groupId);

        if (error) {
          setError(error.message);
        } else {
          setCurrentGroup(group);
        }
      } catch (err) {
        setError("Failed to fetch group data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGroup();
  }, [groupId, currentGroup, setCurrentGroup, setIsLoading]);

  return {
    group: currentGroup,
    isLoading,
    error,
    refreshGroup: () => {
      // Force a refresh by clearing the current group and triggering a new fetch
      setCurrentGroup(null);
    },
  };
}
