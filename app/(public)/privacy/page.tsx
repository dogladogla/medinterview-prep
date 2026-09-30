import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/content/page-header";

export const metadata: Metadata = { title: "Privacy notice" };

const contact = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export default function PrivacyPage() {
  return (
    <article className="max-w-3xl space-y-6 leading-relaxed">
      <PageHeader
        title="Privacy notice"
        description="Plain English: what we store, why, and how to delete it. Many of our users are under 18, so we keep data to the minimum needed."
      />

      <Section title="What we collect">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Your email address, used only to sign you in with a one-time link.</li>
          <li>Optional profile details you choose to add: a display name, applicant type and target universities.</li>
          <li>Your practice activity: answers you type, AI feedback and interview transcripts, confidence ratings, stars, notes and reading progress.</li>
          <li>A daily count of AI requests, used to enforce fair-use limits.</li>
        </ul>
        <p>
          We don&apos;t use advertising, tracking cookies or analytics profiling, and we never sell data. The only cookies are the
          ones that keep you signed in.
        </p>
      </Section>

      <Section title="How it's used">
        <p>
          Your data is used only to run the app for you: saving your progress, showing your dashboard and recommending what to
          practise next. When you ask for AI feedback or use the AI interviewer, the relevant question and your typed answer are
          sent to our AI provider (Anthropic) to generate a response. Please don&apos;t include personal details about yourself or
          others — especially patients — in your answers.
        </p>
      </Section>

      <Section title="Where it's stored">
        <p>
          Accounts and practice data are stored with Supabase in a UK (London) data centre and protected so that only you can
          access your own records. AI requests are processed by Anthropic, which may process data outside the UK under
          contractual safeguards.
        </p>
      </Section>

      <Section title="Your choices">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            Delete all your practice data at any time from{" "}
            <Link href="/settings" className="text-primary underline-offset-4 hover:underline">
              Settings
            </Link>
            .
          </li>
          <li>You can use the question bank, frameworks, university guides and reading library without an account.</li>
          {contact && (
            <li>
              For access requests or questions about your data, email{" "}
              <a href={`mailto:${contact}`} className="text-primary underline-offset-4 hover:underline">
                {contact}
              </a>
              .
            </li>
          )}
        </ul>
      </Section>

      <Section title="AI limitations">
        <p>
          AI feedback and interviews are practice aids. They can be wrong, and they are not an assessment by any medical school.
          Nothing in this app is medical advice.
        </p>
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}
