"use client";

import { Button } from "@ui/button";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { resolveParent } from "@/lib/parent-routes";

interface BackButtonProps {
  className?: string;
  label?: string;
}

export default function BackButton({
  className,
  label = "Back",
}: BackButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [navStartedAt, setNavStartedAt] = useState<null | string>(null);

  const parent = resolveParent(pathname);
  if (!parent) return null;

  const navigating = navStartedAt === pathname;

  function handleClick() {
    if (navigating) return;
    setNavStartedAt(pathname);

    const hasInAppHistory =
      typeof window !== "undefined" && window.history.length > 1;

    if (hasInAppHistory) {
      router.back();
    } else if (parent) {
      router.push(parent);
    }
  }

  return (
    <Button
      aria-label="Go back"
      className={className}
      disabled={navigating}
      onClick={handleClick}
      size="sm"
      variant="ghost"
    >
      <ArrowLeft />
      {label}
    </Button>
  );
}
