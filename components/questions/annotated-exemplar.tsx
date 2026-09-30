import { Fragment, type ReactNode } from "react";

import { withStageDirections } from "@/components/content/prose";
import type { Annotation } from "@/lib/content/types";

type Range = { start: number; end: number; n: number };

/**
 * Renders the exemplar with each annotated excerpt highlighted and numbered,
 * followed by the numbered notes. Excerpts are matched verbatim (checked by
 * `npm run content:qc`); overlapping or missing excerpts are skipped safely.
 */
export function AnnotatedExemplar({ text, annotations }: { text: string; annotations: Annotation[] }) {
  const ranges: Range[] = [];
  annotations.forEach((a, i) => {
    const start = text.indexOf(a.excerpt);
    if (start < 0) return;
    const end = start + a.excerpt.length;
    if (ranges.some((r) => start < r.end && end > r.start)) return;
    ranges.push({ start, end, n: i + 1 });
  });
  ranges.sort((a, b) => a.start - b.start);

  // Walk paragraphs (split on blank lines) keeping absolute offsets.
  const paragraphs: { start: number; text: string }[] = [];
  const re = /\n{2,}/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    paragraphs.push({ start: last, text: text.slice(last, m.index) });
    last = m.index + m[0].length;
  }
  paragraphs.push({ start: last, text: text.slice(last) });

  return (
    <div className="space-y-5">
      <div className="space-y-3 leading-relaxed">
        {paragraphs
          .filter((p) => p.text.trim())
          .map((p, pi) => (
            <p key={pi}>{renderParagraph(p.text, p.start, ranges)}</p>
          ))}
      </div>
      {annotations.length > 0 && (
        <ol className="space-y-2 border-t pt-4 text-sm">
          {annotations.map((a, i) => (
            <li key={i} className="flex gap-3">
              <span
                className="bg-primary text-primary-foreground mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                aria-hidden
              >
                {i + 1}
              </span>
              <span>
                <span className="sr-only">Note {i + 1}: </span>
                <span className="text-muted-foreground">“{a.excerpt}” — </span>
                {a.note}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function renderParagraph(para: string, offset: number, ranges: Range[]): ReactNode {
  const out: ReactNode[] = [];
  let cursor = 0;
  for (const r of ranges) {
    const s = r.start - offset;
    const e = r.end - offset;
    if (e <= 0 || s >= para.length) continue;
    const cs = Math.max(0, s);
    const ce = Math.min(para.length, e);
    if (cs > cursor) out.push(<Fragment key={`t${cursor}`}>{withStageDirections(para.slice(cursor, cs))}</Fragment>);
    out.push(
      <mark key={`m${r.n}`} className="bg-primary/15 text-foreground rounded px-0.5">
        {withStageDirections(para.slice(cs, ce))}
        {ce === e && (
          <sup className="text-primary ml-0.5 font-semibold" aria-label={`note ${r.n}`}>
            {r.n}
          </sup>
        )}
      </mark>,
    );
    cursor = ce;
  }
  if (cursor < para.length) out.push(<Fragment key={`t${cursor}`}>{withStageDirections(para.slice(cursor))}</Fragment>);
  return out;
}
