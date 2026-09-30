import { Lock } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/** Shown when a feature flag is off for the user's tier (brief M9 gating hook). */
export function FeatureLocked({ title, reason }: { title: string; reason?: string }) {
  return (
    <Card>
      <CardHeader>
        <Lock className="text-muted-foreground mb-2 size-5" aria-hidden />
        <CardTitle className="text-base">{title} isn&apos;t available right now</CardTitle>
        <CardDescription>
          {reason ?? "This feature isn't included in your current plan. Everything else in the app is still available."}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
