"use client";

import type { Tables } from "@/types/supabase";

import { getUserGroups } from "@/actions/groups/getUserGroups";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@ui/command";
import { Skeleton } from "@ui/skeleton";
import { setCookie } from "cookies-next";
import { useState, useEffect } from "react";

export function GroupList() {
  const [groups, setGroups] = useState<Tables<"groups">[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchGroups() {
      setLoading(true);
      const { data, error } = await getUserGroups();

      if (error) {
        console.error("Failed to fetch groups:", error);
      } else {
        setGroups(data);
      }
      setLoading(false);
    }

    fetchGroups();
  }, []);

  function handleSelect(value: string) {
    setCookie("currentGroup", value);
  }

  return (
    <Command>
      <CommandInput placeholder="Filter group..." />
      <CommandList>
        {loading ? (
          <CommandLoading className="p-1">
            <Skeleton className="h-8 w-full" />
          </CommandLoading>
        ) : (
          <>
            <CommandEmpty>No groups found.</CommandEmpty>
            <CommandGroup>
              {groups.map((group) => (
                <CommandItem
                  key={group.id}
                  value={group.name + " " + group.id}
                  onSelect={handleSelect}
                >
                  {group.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  );
}
