import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";

import { PageHeader } from "@/components/content/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getIndexes } from "@/lib/content/queries";
import { FORMAT_LABEL, READING_SOURCE_LABEL, formatDate } from "@/lib/labels";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const u = (await getIndexes()).universityBySlug.get(slug);
  return u ? { title: `${u.name} interviews`, description: u.overview.slice(0, 155) } : { title: "Not found" };
}

export default async function UniversityPage({ params }: Props) {
  const { slug } = await params;
  const idx = await getIndexes();
  const u = idx.universityBySlug.get(slug);
  if (!u) notFound();

  const written = idx.questions.filter((q) => q.universityIds.includes(u.id));
  const reading = u.readingIds.map((id) => idx.readingById.get(id)).filter((r) => r != null);
  const mockFormat = u.interviewFormats.includes("mmi") ? "MMI" : "tutorial-style";

  return (
    <article className="max-w-3xl space-y-8">
      <PageHeader title={u.name} back={{ href: "/universities", label: "Universities" }} description={u.overview}>
        <div className="flex flex-wrap gap-1.5">
          {u.interviewFormats.map((f) => (
            <Badge key={f} variant="outline">
              {FORMAT_LABEL[f]}
            </Badge>
          ))}
        </div>
      </PageHeader>

      <section className="bg-card space-y-2 rounded-xl border p-5">
        <h2 className="text-lg font-semibold">The interview</h2>
        <p className="leading-relaxed">{u.interviewFormatDetail}</p>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <ListSection title="What they look for" items={u.whatTheyLookFor} />
        <ListSection title="Typical question themes" items={u.typicalQuestionThemes} />
        <ListSection title="Values you'll see" items={u.keyValues} />
        <ListSection title="How to prepare" items={u.preparationTips} />
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Practise for {u.name}</h2>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href={`/questions?university=${u.slug}`}>Questions for {u.name}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/mock">Run a {mockFormat} mock</Link>
          </Button>
        </div>
        {written.length > 0 && (
          <ul className="divide-y rounded-xl border">
            {written.map((q) => (
              <li key={q.id}>
                <Link href={`/questions/${q.slug}`} className="hover:bg-muted/50 block p-3 text-sm">
                  {q.questionText}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {reading.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Suggested reading</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {reading.map((r) => (
              <li key={r.id}>
                <Link href={`/reading/${r.slug}`} className="hover:border-primary/40 block rounded-lg border p-3">
                  <span className="text-muted-foreground text-xs">{READING_SOURCE_LABEL[r.sourceType]}</span>
                  <span className="block font-medium">{r.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="text-muted-foreground space-y-2 border-t pt-4 text-sm">
        <p className="font-medium">Official sources</p>
        <ul className="space-y-1">
          {u.externalLinks.map((l) => (
            <li key={l.url}>
              <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-primary inline-flex items-center gap-1 underline-offset-4 hover:underline">
                {l.label} <ExternalLink className="size-3.5" aria-hidden />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
        <p>
          Last checked {formatDate(u.lastVerifiedAt)}. Interview arrangements change each year — always confirm details in your
          invitation and on the university&apos;s website.
        </p>
      </footer>
    </article>
  );
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="space-y-2">
      <h2 className="font-semibold">{title}</h2>
      <ul className="list-disc space-y-1 pl-5 text-sm">
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </section>
  );
}
