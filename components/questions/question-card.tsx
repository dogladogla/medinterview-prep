import Link from "next/link";
import { Star } from "lucide-react";

import { Difficulty } from "@/components/content/difficulty";
import { Badge } from "@/components/ui/badge";
import { FORMAT_LABEL } from "@/lib/labels";
import type { Category, Question } from "@/lib/content/types";

export function QuestionCard({
  question,
  category,
  starred,
  attempted,
}: {
  question: Question;
  category?: Category;
  starred?: boolean;
  attempted?: boolean;
}) {
  return (
    <li>
      <Link
        href={`/questions/${question.slug}`}
        className="bg-card hover:border-primary/40 focus-visible:ring-ring/50 group flex h-full flex-col gap-3 rounded-xl border p-4 transition-colors outline-none focus-visible:ring-[3px]"
      >
        <div className="flex items-start justify-between gap-3">
          <span className="text-muted-foreground text-xs font-medium">{category?.name}</span>
          <span className="flex items-center gap-2">
            {attempted && <Badge variant="muted">Attempted</Badge>}
            {starred && <Star className="size-4 fill-amber-400 text-amber-500" aria-label="Starred" />}
          </span>
        </div>
        <p className="group-hover:text-primary font-medium text-pretty">{question.questionText}</p>
        <div className="mt-auto flex flex-wrap items-center gap-2">
          <Difficulty level={question.difficulty} />
          {question.formats.map((f) => (
            <Badge key={f} variant="outline">
              {FORMAT_LABEL[f]}
            </Badge>
          ))}
        </div>
      </Link>
    </li>
  );
}
