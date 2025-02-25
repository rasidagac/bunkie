"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@ui/breadcrumb";
import Link from "next/link";
import { ReactNode, createContext, useContext } from "react";

// Create a context to manage breadcrumb items
export const BreadcrumbContext = createContext<{
  addBreadcrumbItem: (item: ReactNode) => void;
  items: ReactNode[];
}>({
  addBreadcrumbItem: () => {},
  items: [],
});

export function useBreadcrumb() {
  return useContext(BreadcrumbContext);
}

interface BreadcrumbWrapperProps {
  children?: ReactNode;
}

export default function BreadcrumbWrapper({
  children,
}: BreadcrumbWrapperProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {children}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
