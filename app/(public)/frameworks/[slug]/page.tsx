import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { after } from "next/server";

import { Difficulty } from "@/components/content/difficulty";
import { PageHeader } from "@/components/content/page-header";
import { Prose } from "@/components/content/prose";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth";
import { getIndexes } from "@/lib/content/queries";
import { FRAMEWORK_CATEGORY_LABEL } from "@/lib/labels";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const f = (await getIndexes()).frameworkBySlug.get(slug);
  return f ? { title: f.name, description: f.summary.slice(0, 155) } : { title: "Framework not found" };
}

export default async function FrameworkPage({ params }: Props) {
  const { slug } = await params;
  const idx = await getIndexes();
  const f = idx.frameworkBySlug.get(slug);
  if (!f) notFound();

  // Record the view for signed-in users after the response is sent.
  const { supabase, user } = await getSession();
  if (user) {
    after(async () => {
      await supabase
        .from("framework_views")
        .upsert({ user_id: user.id, framework_id: f.id, viewed_at: new Date().toISOString() }, { onConflict: "user_id,framework_id" });
    });
  }

  const linked = idx.questions
    .map((q) => ({ q, link: q.frameworkLinks.find((l) => l.frameworkId === f.id) }))
    .filter((x) => x.link)
    .sort((a, b) => Number(b.link?.isPrimary) - Number(a.link?.isPrimary) || a.q.difficulty - b.q.difficulty);
  const worked = f.workedExampleQuestionId ? idx.questionById.get(f.workedExampleQuestionId) : undefined;

  return (
    <article className="max-w-3xl space-y-8">
      <PageHeader title={f.name} back={{ href: "/frameworks", label: "Frameworks" }} description={f.summary}>
        <Badge variant="secondary">{FRAMEWORK_CATEGORY_LABEL[f.category]}</Badge>
      </PageHeader>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">When to use it</h2>
        <p className="leading-relaxed">{f.whenToUse}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">The steps</h2>
        <ol className="space-y-3">
          {f.steps.map((s, i) => (
            <li key={s.title} className="bg-card flex gap-4 rounded-xl border p-4">
              <span className="bg-primary text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                {i + 1}
              </span>
              <div>
                <h3 className="font-medium">{s.title}</h3>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Worked example</h2>
        <div className="bg-accent/40 rounded-xl border p-5">
          <Prose text={f.workedExample} />
        </div>
        {worked && (
          <p className="text-sm">
            Try it yourself:{" "}
            <Link href={`/questions/${worked.slug}`} className="text-primary underline-offset-4 hover:underline">
              {worked.questionText}
            </Link>
          </p>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Common mistakes</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          {f.commonMistakes.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </section>

      {linked.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Questions that use this framework</h2>
          <ul className="divide-y rounded-xl border">
            {linked.map(({ q, link }) => (
              <li key={q.id}>
                <Link
                  href={`/questions/${q.slug}`}
                  className="hover:bg-muted/50 flex flex-col gap-1 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="font-medium">{q.questionText}</span>
                  <span className="flex shrink-0 items-center gap-2">
                    {link?.isPrimary && <Badge variant="muted">Main framework</Badge>}
                    <Difficulty level={q.difficulty} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
