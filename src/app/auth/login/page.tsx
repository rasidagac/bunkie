import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";

import { SignInForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <Card className="w-full md:w-sm">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Login with your Github account</CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm />
      </CardContent>
    </Card>
  );
}
