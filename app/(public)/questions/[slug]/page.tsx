import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, BookOpen, Compass, ListChecks, MessageCircleQuestion } from "lucide-react";

import { Difficulty } from "@/components/content/difficulty";
import { PageHeader } from "@/components/content/page-header";
import { Prose } from "@/components/content/prose";
import { AnnotatedExemplar } from "@/components/questions/annotated-exemplar";
import { PracticePanel } from "@/components/questions/practice-panel";
import { StarButton } from "@/components/questions/star-button";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth";
import { getIndexes } from "@/lib/content/queries";
import { canUseAi } from "@/lib/features/server";
import { FORMAT_LABEL, READING_SOURCE_LABEL } from "@/lib/labels";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const idx = await getIndexes();
  const q = idx.questionBySlug.get(slug);
  if (!q) return { title: "Question not found" };
  return {
    title: q.questionText.length > 70 ? `${q.questionText.slice(0, 67)}…` : q.questionText,
    description: `Practise this medical school interview question with a framework, answer scaffold and annotated example.`,
  };
}

export default async function QuestionPage({ params }: Props) {
  const { slug } = await params;
  const idx = await getIndexes();
  const q = idx.questionBySlug.get(slug);
  if (!q) notFound();

  const { supabase, user } = await getSession();
  const [progressRes, aiAvailable] = await Promise.all([
    user ? supabase.from("user_progress").select("*").eq("question_id", q.id).maybeSingle() : Promise.resolve(null),
    canUseAi("ai_feedback"),
  ]);
  const progress = progressRes?.data ?? null;

  const category = idx.categoryById.get(q.categoryId);
  const frameworks = q.frameworkLinks
    .map((l) => ({ ...l, fw: idx.frameworkById.get(l.frameworkId) }))
    .filter((x): x is typeof x & { fw: NonNullable<typeof x.fw> } => Boolean(x.fw));
  const reading = q.readingIds.map((id) => idx.readingById.get(id)).filter((r) => r != null);
  const universities = q.universityIds.map((id) => idx.universityById.get(id)).filter((u) => u != null);
  const related = idx.questions.filter((x) => x.categoryId === q.categoryId && x.id !== q.id).slice(0, 4);

  const guidance = (
    <div className="space-y-8">
      {q.whatIsBeingTested && (
        <GuidanceBlock icon={Compass} title="What's being tested">
          <p className="leading-relaxed">{q.whatIsBeingTested}</p>
        </GuidanceBlock>
      )}

      <GuidanceBlock icon={ListChecks} title="Answer scaffold">
        <p className="text-muted-foreground mb-3 text-sm">A structure to build your own answer on — not a script.</p>
        <ol className="space-y-3">
          {q.scaffold.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="bg-secondary text-secondary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                {i + 1}
              </span>
              <div>
                <p className="font-medium">{s.step}</p>
                <p className="text-muted-foreground text-sm">{s.guidance}</p>
              </div>
            </li>
          ))}
        </ol>
      </GuidanceBlock>

      <GuidanceBlock icon={BookOpen} title="Example answer, annotated">
        <p className="text-muted-foreground mb-3 text-sm">
          A strong but not perfect answer. Read the notes to see <em>why</em> it works — then make your own version with
          your experiences.
        </p>
        <div className="bg-card rounded-xl border p-5">
          <AnnotatedExemplar text={q.exemplar} annotations={q.annotations} />
        </div>
      </GuidanceBlock>

      <div className="grid gap-6 md:grid-cols-2">
        <GuidanceBlock icon={ListChecks} title="Key points to hit">
          <ul className="list-disc space-y-1.5 pl-5">
            {q.keyPoints.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </GuidanceBlock>
        <GuidanceBlock icon={AlertTriangle} title="Common pitfalls">
          <ul className="list-disc space-y-1.5 pl-5">
            {q.pitfalls.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </GuidanceBlock>
      </div>

      <GuidanceBlock icon={MessageCircleQuestion} title="Practise the follow-ups">
        <p className="text-muted-foreground mb-3 text-sm">Real interviews are won and lost here. Answer each one aloud.</p>
        <ul className="space-y-2">
          {q.followUps.map((f, i) => (
            <li key={i} className="bg-muted/60 rounded-lg px-3 py-2">
              {f}
            </li>
          ))}
        </ul>
      </GuidanceBlock>

      {reading.length > 0 && (
        <GuidanceBlock icon={BookOpen} title="Suggested reading">
          <ul className="grid gap-2 sm:grid-cols-2">
            {reading.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/reading/${r.slug}`}
                  className="hover:border-primary/40 block rounded-lg border p-3 transition-colors"
                >
                  <span className="text-muted-foreground text-xs">{READING_SOURCE_LABEL[r.sourceType]}</span>
                  <span className="block font-medium">{r.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </GuidanceBlock>
      )}
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
      <div className="min-w-0 space-y-6">
        <PageHeader title={q.questionText} back={{ href: "/questions", label: "Question bank" }}>
          <div className="flex flex-wrap items-center gap-2">
            {category && (
              <Link href={`/questions?category=${category.slug}`}>
                <Badge variant="secondary">{category.name}</Badge>
              </Link>
            )}
            {q.formats.map((f) => (
              <Badge key={f} variant="outline">
                {FORMAT_LABEL[f]}
              </Badge>
            ))}
            <Difficulty level={q.difficulty} />
            {user && <StarButton questionId={q.id} initial={progress?.starred ?? false} />}
          </div>
          {universities.length > 0 && (
            <p className="text-muted-foreground text-sm">
              Especially relevant to {universities.map((u) => u.name).join(" and ")}.
            </p>
          )}
        </PageHeader>

        {q.stationBrief && (
          <section aria-label="Station brief" className="border-primary/30 bg-accent/40 rounded-xl border p-5">
            <h2 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">Station brief</h2>
            <Prose text={q.stationBrief} />
          </section>
        )}

        <PracticePanel
          questionId={q.id}
          questionSlug={q.slug}
          signedIn={Boolean(user)}
          aiAvailable={aiAvailable}
          initialConfidence={progress?.confidence ?? null}
          initialNotes={progress?.notes ?? null}
          guidance={guidance}
        />
      </div>

      <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start" aria-label="Frameworks and related questions">
        {frameworks.length > 0 && (
          <section className="bg-card space-y-4 rounded-xl border p-4">
            <h2 className="text-sm font-semibold">Frameworks to apply</h2>
            {frameworks.map(({ fw, isPrimary }) => (
              <div key={fw.id} className="space-y-2">
                <Link href={`/frameworks/${fw.slug}`} className="text-primary font-medium underline-offset-4 hover:underline">
                  {fw.name}
                </Link>
                {isPrimary && (
                  <ol className="text-muted-foreground list-decimal space-y-0.5 pl-5 text-xs">
                    {fw.steps.map((s) => (
                      <li key={s.title}>{s.title}</li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
          </section>
        )}
        {related.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-sm font-semibold">More in {category?.name}</h2>
            <ul className="space-y-1.5 text-sm">
              {related.map((r) => (
                <li key={r.id}>
                  <Link href={`/questions/${r.slug}`} className="hover:text-primary underline-offset-4 hover:underline">
                    {r.questionText}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </aside>
    </div>
  );
}

function GuidanceBlock({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Compass;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="flex items-center gap-2 font-semibold">
        <Icon className="text-primary size-4" aria-hidden />
        {title}
      </h3>
      {children}
    </section>
  );
}
