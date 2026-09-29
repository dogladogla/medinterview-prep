"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
});
type FormValues = z.infer<typeof schema>;

type Status = { kind: "idle" } | { kind: "sent"; email: string } | { kind: "error"; message: string };

export function LoginForm({ next }: { next: string }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit({ email }: FormValues) {
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo, shouldCreateUser: true },
    });
    setStatus(error ? { kind: "error", message: error.message } : { kind: "sent", email });
  }

  if (status.kind === "sent") {
    return (
      <div role="status" className="space-y-2 text-sm">
        <p className="font-medium">Check your inbox</p>
        <p className="text-muted-foreground">
          We sent a sign-in link to <span className="text-foreground">{status.email}</span>. Open it on this
          device to continue.
        </p>
        <Button variant="link" className="px-0" onClick={() => setStatus({ kind: "idle" })}>
          Use a different email
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id="email-error" className="text-destructive text-sm">
            {errors.email.message}
          </p>
        )}
      </div>
      {status.kind === "error" && (
        <p role="alert" className="text-destructive text-sm">
          {status.message}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending link…" : "Email me a sign-in link"}
      </Button>
    </form>
  );
}
