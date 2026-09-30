import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/content/page-header";

export const metadata: Metadata = {
  title: "About and support",
  description: "How MedInterview Prep works, how to use it well, and where to find support.",
};

export default function AboutPage() {
  return (
    <article className="max-w-3xl space-y-8 leading-relaxed">
      <PageHeader
        title="About and support"
        description="A practice tool for UK medical school interviews, built around one idea: learn how to think, not what to recite."
      />

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">How to use it well</h2>
        <ol className="list-decimal space-y-1.5 pl-5">
          <li>Learn a few frameworks — they let you structure answers to questions you&apos;ve never seen.</li>
          <li>Attempt questions out loud before revealing the guidance. Then compare with the scaffold and annotated example.</li>
          <li>Practise follow-ups. Interviewers probe; a memorised answer rarely survives the second question.</li>
          <li>Use timed mock stations and the AI interviewer to rehearse under realistic pressure.</li>
          <li>Rate your confidence honestly — low-confidence questions come back for review sooner.</li>
        </ol>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">About the content</h2>
        <p>
          Questions, frameworks and summaries are written for this app. Example answers are deliberately strong but not perfect,
          and are there to be learned from, not copied — interviewers can spot a rehearsed script. University details and current
          affairs are checked against official sources and dated; always confirm arrangements in your own interview invitation.
        </p>
        <p>
          AI features use Claude, made by Anthropic. The AI can make mistakes and is not a substitute for advice from your school,
          your referees or the medical schools themselves.
        </p>
      </section>

      <section className="bg-accent/40 space-y-2 rounded-xl border p-5">
        <h2 className="text-lg font-semibold">If you&apos;re finding things hard</h2>
        <p>
          Applying to medicine is stressful. If you&apos;re struggling, please talk to someone you trust — a parent, teacher or
          your GP. Free, confidential support in the UK:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Samaritans</strong> — call 116 123, any time
          </li>
          <li>
            <strong>Childline</strong> (under 19) — call 0800 1111
          </li>
          <li>
            <strong>Shout</strong> — text SHOUT to 85258
          </li>
          <li>
            In an emergency, call <strong>999</strong>
          </li>
        </ul>
      </section>

      <p className="text-muted-foreground text-sm">
        MedInterview Prep isn&apos;t affiliated with any university, the NHS or the GMC. Read our{" "}
        <Link href="/privacy" className="text-primary underline-offset-4 hover:underline">
          privacy notice
        </Link>
        .
      </p>
    </article>
  );
}
