import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { safeNextPath } from "@/lib/safe-redirect";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

const ERRORS: Record<string, string> = {
  link: "That sign-in link is invalid or has expired. Request a new one below.",
  profile: "You're signed in, but we couldn't set up your account. Please try again.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const errorMessage = error ? ERRORS[error] : undefined;

  return (
    <div className="mx-auto flex max-w-sm flex-col py-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Sign in</CardTitle>
          <CardDescription>No password needed. We&apos;ll email you a one-time link.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage && (
            <p role="alert" className="text-destructive text-sm">
              {errorMessage}
            </p>
          )}
          <LoginForm next={safeNextPath(next)} />
        </CardContent>
      </Card>
    </div>
  );
}
