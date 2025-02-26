"use client";

import { GroupProvider as GroupContextProvider } from "@/hooks/use-group";
import { ReactNode } from "react";

interface GroupProviderProps {
  children: ReactNode;
}

export function GroupProvider({ children }: GroupProviderProps) {
  return <GroupContextProvider>{children}</GroupContextProvider>;
}
