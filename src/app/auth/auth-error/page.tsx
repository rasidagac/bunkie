import { Button } from "@ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>
            There was a problem authenticating your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-muted-foreground text-sm">
            This could happen for several reasons:
          </p>
          <ul className="text-muted-foreground list-disc pl-4 text-sm">
            <li>The authentication process was cancelled</li>
            <li>The authentication provider had an error</li>
            <li>The authentication session expired</li>
          </ul>
          <Button asChild>
            <Link href="/auth/login">Try Again</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
