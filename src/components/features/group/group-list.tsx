"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui/command";

import type { Group } from "@/types/groups";

import { setCurrentGroup } from "@/actions/groups/setCurrentGroup";

export function GroupList({ data }: { data: Group[] }) {
  async function handleSelect(group: Group) {
    await setCurrentGroup(group.id);
  }

  return (
    <Command className="rounded-none">
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
