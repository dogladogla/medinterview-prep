import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { PageHeader } from "@/components/content/page-header";
import { QuestionCard } from "@/components/questions/question-card";
import { QuestionFilters } from "@/components/questions/question-filters";
import { getSession } from "@/lib/auth";
import { filterQuestions, parseFilterParams } from "@/lib/content/filter";
import { getIndexes } from "@/lib/content/queries";
import { FORMAT_LABEL } from "@/lib/labels";
import { getProgressMap } from "@/lib/progress";
import type { InterviewFormat } from "@/types/database.types";

export const metadata: Metadata = {
  title: "Question bank",
  description: "Medical school interview questions with frameworks, answer scaffolds and annotated example answers.",
};

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = parseFilterParams(await searchParams);
  const [idx, { supabase, user }] = await Promise.all([getIndexes(), getSession()]);
  const progress = user ? await getProgressMap(supabase) : new Map();

  const category = sp.category ? idx.categoryBySlug.get(sp.category) : undefined;
  const university = sp.university ? idx.universityBySlug.get(sp.university) : undefined;
  const starredIds =
    user && sp.starred
      ? new Set([...progress.values()].filter((p) => p.starred).map((p) => p.question_id))
      : undefined;

  const results = filterQuestions(idx.questions, {
    q: sp.q,
    category: category?.id,
    university: university?.id,
    format: sp.format,
    difficulty: sp.difficulty,
    starredIds,
  });

  const formats = (Object.keys(FORMAT_LABEL) as InterviewFormat[])
    .filter((f) => idx.questions.some((q) => q.formats.includes(f)))
    .map((f) => ({ value: f, label: FORMAT_LABEL[f] }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Question bank"
        description={
          <>
            {idx.questions.length} questions across {idx.categories.length} categories. Try each one aloud before you
            reveal the guidance — then use the linked{" "}
            <Link href="/frameworks" className="text-primary underline-offset-4 hover:underline">
              frameworks
            </Link>{" "}
            to structure your answer.
          </>
        }
      />
      <Suspense>
        <QuestionFilters
          categories={idx.categories.map((c) => ({ value: c.slug, label: c.name }))}
          universities={idx.universities.map((u) => ({ value: u.slug, label: u.name }))}
          formats={formats}
          signedIn={Boolean(user)}
        />
      </Suspense>

      <p className="text-muted-foreground text-sm" role="status" aria-live="polite">
        {results.length === idx.questions.length
          ? `Showing all ${results.length} questions`
          : `${results.length} of ${idx.questions.length} questions match`}
        {university && " (including questions relevant to every university)"}
      </p>

      {results.length === 0 ? (
        <div className="bg-card rounded-xl border p-8 text-center">
          <p className="font-medium">No questions match these filters.</p>
          <p className="text-muted-foreground mt-1 text-sm">
            {sp.starred ? "Star questions from their pages to find them here." : "Try removing a filter or searching for a broader word."}
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((q) => {
            const p = progress.get(q.id);
            return (
              <QuestionCard
                key={q.id}
                question={q}
                category={idx.categoryById.get(q.categoryId)}
                starred={p?.starred}
                attempted={(p?.times_attempted ?? 0) > 0}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
}
