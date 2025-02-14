"use client";

import BackButton from "@/components/navigation/back-button";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboardRoot = pathname === "/dashboard";

  return (
    <div>
      {!isDashboardRoot && <BackButton />}
      {children}
    </div>
  );
}
