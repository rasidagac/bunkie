"use client";

import { Button, ButtonProps } from "@ui/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function FormSubmitButton({
  children,
  type = "submit",
  ...props
}: ButtonProps) {
  const status = useFormStatus();

  return (
    <Button type={type} {...props} disabled={status.pending}>
      {children}
      {status.pending && <Loader2 className="animate-spin" />}
    </Button>
  );
}
