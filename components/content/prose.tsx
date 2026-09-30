import { Fragment, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Renders plain-text content: paragraphs split on blank lines, and
 * [bracketed stage directions] (used in role-play exemplars) shown in italics.
 */
export function Prose({ text, className }: { text: string; className?: string }) {
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim());
  return (
    <div className={cn("space-y-3 leading-relaxed", className)}>
      {paragraphs.map((p, i) => (
        <p key={i}>{withStageDirections(p)}</p>
      ))}
    </div>
  );
}

export function withStageDirections(text: string): ReactNode {
  const parts = text.split(/(\[[^\]]+\])/g);
  return parts.map((part, i) =>
    part.startsWith("[") && part.endsWith("]") ? (
      <em key={i} className="text-muted-foreground">
        {part.slice(1, -1)}
      </em>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
