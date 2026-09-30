import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/content/page-header";
import { getIndexes } from "@/lib/content/queries";
import { FRAMEWORK_CATEGORY_LABEL } from "@/lib/labels";
import type { FrameworkCategory } from "@/types/database.types";

export const metadata: Metadata = {
  title: "Frameworks",
  description: "Thinking tools for medical interviews: ethics pillars, STAR, reflection models, SPIKES and more.",
};

const ORDER: FrameworkCategory[] = ["structure", "ethics", "reflection", "communication"];

export default async function FrameworksPage() {
  const idx = await getIndexes();
  const useCount = new Map<string, number>();
  for (const q of idx.questions) for (const l of q.frameworkLinks) useCount.set(l.frameworkId, (useCount.get(l.frameworkId) ?? 0) + 1);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Frameworks"
        description="Learn a handful of transferable thinking tools and you can structure an answer to almost any question — including ones you've never seen. Each framework links to the questions that use it."
      />
      {ORDER.map((cat) => {
        const list = idx.frameworks.filter((f) => f.category === cat);
        if (!list.length) return null;
        return (
          <section key={cat} aria-labelledby={`fw-${cat}`} className="space-y-3">
            <h2 id={`fw-${cat}`} className="text-lg font-semibold">
              {FRAMEWORK_CATEGORY_LABEL[cat]}
            </h2>
            <ul className="grid gap-3 md:grid-cols-2">
              {list.map((f) => (
                <li key={f.id}>
                  <Link
                    href={`/frameworks/${f.slug}`}
                    className="bg-card hover:border-primary/40 focus-visible:ring-ring/50 block h-full rounded-xl border p-4 transition-colors outline-none focus-visible:ring-[3px]"
                  >
                    <span className="font-medium">{f.name}</span>
                    <p className="text-muted-foreground mt-1 line-clamp-3 text-sm">{f.summary}</p>
                    <p className="text-muted-foreground mt-3 text-xs">
                      {f.steps.length} steps · used in {useCount.get(f.id) ?? 0} questions
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
