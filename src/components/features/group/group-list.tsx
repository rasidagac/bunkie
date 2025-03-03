"use client";

import type { Tables } from "@/types/supabase";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui/command";
import { setCookie } from "cookies-next";

export function GroupList({ data }: { data: Tables<"groups">[] }) {
  function handleSelect(value: string) {
    setCookie("currentGroup", value);
  }

  return (
    <Command>
      <CommandInput placeholder="Filter group..." />
      <CommandList>
        <CommandEmpty>No groups found.</CommandEmpty>
        <CommandGroup>
          {data.map((group) => (
            <CommandItem
              key={group.id}
              value={group.name + " " + group.id}
              onSelect={handleSelect}
            >
              {group.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
