import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/** Temporary placeholder for sections built in later milestones. */
export function ComingSoon({ title, milestone, summary }: { title: string; milestone: string; summary: string }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Arriving in {milestone}</CardTitle>
          <CardDescription>{summary}</CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  );
}
