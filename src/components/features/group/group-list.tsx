"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui/command";
import { setCookie } from "cookies-next";

import type { Group } from "@/types/groups";

export function GroupList({ data }: { data: Group[] }) {
  async function handleSelect(group: Group) {
    await setCookie("currentGroup", group.id);
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
              onSelect={() => handleSelect(group)}
              value={group.name + " " + group.id}
            >
              {group.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
