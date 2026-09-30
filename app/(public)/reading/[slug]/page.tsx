import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";

import { Difficulty } from "@/components/content/difficulty";
import { PageHeader } from "@/components/content/page-header";
import { ReadingStatusButtons } from "@/components/reading/reading-status";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth";
import { getIndexes } from "@/lib/content/queries";
import { READING_SOURCE_LABEL, formatDate } from "@/lib/labels";
import type { ReadingStatus } from "@/types/database.types";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const r = (await getIndexes()).readingBySlug.get(slug);
  return r ? { title: r.title, description: r.whyItMatters.slice(0, 155) } : { title: "Not found" };
}

export default async function ReadingItemPage({ params }: Props) {
  const { slug } = await params;
  const idx = await getIndexes();
  const r = idx.readingBySlug.get(slug);
  if (!r) notFound();

  const { supabase, user } = await getSession();
  let status: ReadingStatus = "unread";
  if (user) {
    const { data } = await supabase.from("reading_progress").select("status").eq("reading_item_id", r.id).maybeSingle();
    status = data?.status ?? "unread";
  }
  const questions = r.questionIds.map((id) => idx.questionById.get(id)).filter((q) => q != null);
  const categories = r.categoryIds.map((id) => idx.categoryById.get(id)).filter((c) => c != null);

  return (
    <article className="max-w-3xl space-y-8">
      <PageHeader title={r.title} back={{ href: "/reading", label: "Reading library" }}>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{READING_SOURCE_LABEL[r.sourceType]}</Badge>
          {r.difficulty && <Difficulty level={r.difficulty} />}
        </div>
        {r.author && <p className="text-muted-foreground text-sm">{r.author}</p>}
        {r.editionNote && <p className="text-muted-foreground text-sm">{r.editionNote}</p>}
        {user && <ReadingStatusButtons itemId={r.id} initial={status} />}
      </PageHeader>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Summary</h2>
        <p className="leading-relaxed">{r.summary}</p>
      </section>

      <section className="bg-accent/40 space-y-2 rounded-xl border p-5">
        <h2 className="font-semibold">Why it matters at interview</h2>
        <p className="leading-relaxed">{r.whyItMatters}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Key takeaways</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          {r.keyTakeaways.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">How to use it</h2>
        <p className="leading-relaxed">{r.howToUseIt}</p>
      </section>

      {questions.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Questions it helps with</h2>
          <ul className="divide-y rounded-xl border">
            {questions.map((q) => (
              <li key={q.id}>
                <Link href={`/questions/${q.slug}`} className="hover:bg-muted/50 block p-3">
                  {q.questionText}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="text-muted-foreground space-y-2 border-t pt-4 text-sm">
        {r.url && (
          <p>
            <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-primary inline-flex items-center gap-1 underline-offset-4 hover:underline">
              Read the original source <ExternalLink className="size-3.5" aria-hidden />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </p>
        )}
        {categories.length > 0 && <p>Related topics: {categories.map((c) => c.name).join(", ")}</p>}
        <p>Summary last checked {formatDate(r.lastVerifiedAt)}. Guidance and law change — check the source for the latest position.</p>
      </footer>
    </article>
  );
}
