"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";

interface BackButtonProps {
  label?: string;
}

export default function BackButton({ label = "Go back" }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="gap-2 pl-0"
      onClick={() => router.back()}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
}
