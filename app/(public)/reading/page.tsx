import type { Metadata } from "next";
import Link from "next/link";
import { Bookmark, Check } from "lucide-react";

import { PageHeader } from "@/components/content/page-header";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth";
import { getIndexes } from "@/lib/content/queries";
import { READING_SOURCE_LABEL } from "@/lib/labels";
import type { ReadingSourceType } from "@/types/database.types";

export const metadata: Metadata = {
  title: "Reading library",
  description: "Short, original summaries of GMC guidance, NHS policy, landmark cases and key books for medical school interviews.",
};

const GROUPS: { title: string; types: ReadingSourceType[] }[] = [
  { title: "Professional guidance", types: ["gmc", "guidance"] },
  { title: "The NHS and current affairs", types: ["nhs", "report", "article"] },
  { title: "Law and landmark cases", types: ["law", "case"] },
  { title: "Books", types: ["book"] },
];

export default async function ReadingPage() {
  const [idx, { supabase, user }] = await Promise.all([getIndexes(), getSession()]);
  const statusById = new Map<string, string>();
  if (user) {
    const { data } = await supabase.from("reading_progress").select("reading_item_id, status");
    for (const r of data ?? []) statusById.set(r.reading_item_id, r.status);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Reading library"
        description="Short summaries in our own words — enough to discuss each source confidently at interview, with links to the originals. Read the source itself for anything you mention in your personal statement."
      />
      {GROUPS.map((g) => {
        const items = idx.reading.filter((r) => g.types.includes(r.sourceType));
        if (!items.length) return null;
        return (
          <section key={g.title} className="space-y-3" aria-labelledby={`rg-${g.title}`}>
            <h2 id={`rg-${g.title}`} className="text-lg font-semibold">
              {g.title}
            </h2>
            <ul className="grid gap-3 md:grid-cols-2">
              {items.map((r) => {
                const st = statusById.get(r.id);
                return (
                  <li key={r.id}>
                    <Link
                      href={`/reading/${r.slug}`}
                      className="bg-card hover:border-primary/40 focus-visible:ring-ring/50 block h-full rounded-xl border p-4 transition-colors outline-none focus-visible:ring-[3px]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="muted">{READING_SOURCE_LABEL[r.sourceType]}</Badge>
                        {st === "read" && <Check className="text-primary size-4" aria-label="Read" />}
                        {st === "bookmarked" && <Bookmark className="text-primary size-4" aria-label="Saved for later" />}
                      </div>
                      <p className="mt-2 font-medium">{r.title}</p>
                      {r.author && <p className="text-muted-foreground text-xs">{r.author}</p>}
                      <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">{r.whyItMatters}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
