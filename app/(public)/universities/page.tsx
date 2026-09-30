import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/content/page-header";
import { Badge } from "@/components/ui/badge";
import { appliesToUniversity, getIndexes } from "@/lib/content/queries";
import { FORMAT_LABEL } from "@/lib/labels";

export const metadata: Metadata = {
  title: "Universities",
  description: "How Oxford, Cambridge, Imperial and Manchester interview for Medicine, and how to prepare for each.",
};

export default async function UniversitiesPage() {
  const idx = await getIndexes();
  return (
    <div className="space-y-8">
      <PageHeader
        title="Universities"
        description="Each medical school interviews differently. Learn the format and what they look for, then practise with questions in their style."
      />
      <ul className="grid gap-4 md:grid-cols-2">
        {idx.universities.map((u) => {
          const specific = idx.questions.filter((q) => q.universityIds.includes(u.id)).length;
          const total = idx.questions.filter((q) => appliesToUniversity(q, u.id)).length;
          return (
            <li key={u.id}>
              <Link
                href={`/universities/${u.slug}`}
                className="bg-card hover:border-primary/40 focus-visible:ring-ring/50 block h-full rounded-xl border p-5 transition-colors outline-none focus-visible:ring-[3px]"
              >
                <h2 className="text-lg font-semibold">{u.name}</h2>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {u.interviewFormats.map((f) => (
                    <Badge key={f} variant="outline">
                      {FORMAT_LABEL[f]}
                    </Badge>
                  ))}
                </div>
                <p className="text-muted-foreground mt-3 line-clamp-3 text-sm">{u.interviewFormatDetail}</p>
                <p className="text-muted-foreground mt-3 text-xs">
                  {total} practice questions{specific ? ` (${specific} written for this style)` : ""}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
