import Link from "next/link";
import { BookOpen, Compass, MessagesSquare, Timer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PILLARS = [
  {
    icon: Compass,
    title: "Frameworks, not scripts",
    body: "Learn the thinking tools — ethics pillars, STAR, reflection, SPIKES — and apply them to any question.",
  },
  {
    icon: BookOpen,
    title: "Attempt before you reveal",
    body: "Every question hides the scaffold and exemplar until you've had a go yourself.",
  },
  {
    icon: Timer,
    title: "Timed mock stations",
    body: "Practise under MMI, panel and Oxbridge timings with structured rubric feedback.",
  },
  {
    icon: MessagesSquare,
    title: "Follow-up questions",
    body: "An AI interviewer that probes your answers — the part real interviews are won and lost on.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="max-w-2xl space-y-5 pt-6">
        <p className="text-primary text-sm font-medium">Oxford · Cambridge · Imperial · Manchester</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Prepare for your medical school interview by learning how to think, not what to recite.
        </h1>
        <p className="text-muted-foreground text-lg">
          Question bank, frameworks, timed mock stations and an AI interviewer — built for UK applicants.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/questions">Start practising</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/frameworks">Browse frameworks</Link>
          </Button>
        </div>
      </section>

      <section aria-labelledby="how-heading" className="space-y-4">
        <h2 id="how-heading" className="text-lg font-semibold">
          How it works
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {PILLARS.map(({ icon: Icon, title, body }) => (
            <li key={title}>
              <Card className="h-full">
                <CardHeader>
                  <Icon className="text-primary mb-2 size-5" aria-hidden />
                  <CardTitle className="text-base">{title}</CardTitle>
                  <CardDescription>{body}</CardDescription>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
