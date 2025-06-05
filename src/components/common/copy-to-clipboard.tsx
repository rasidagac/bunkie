"use client";

import type { ButtonProps } from "@ui/button";

import { Button } from "@ui/button";
import { Check, Copy, Loader2 } from "lucide-react";
import { useState } from "react";

interface CopyToClipboardProps extends ButtonProps {
  label: string;
  textToCopy: string;
}

export default function CopyToClipboard({
  className,
  label,
  textToCopy,
  ...props
}: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false);
  const [disabled, setDisabled] = useState(false);

  function handleClick() {
    setDisabled(true);

    navigator.clipboard.writeText(textToCopy).then(() => {
      setTimeout(() => {
        setDisabled(false);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
      }, 1000);
    });
  }

  const icon = disabled ? (
    <Loader2 className="h-4 w-4 animate-spin" />
  ) : copied ? (
    <Check />
  ) : (
    <Copy />
  );

  return (
    <Button
      className={className}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {icon} {label}
    </Button>
  );
}
