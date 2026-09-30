import { cn } from "@/lib/utils";
import { DIFFICULTY_LABEL } from "@/lib/labels";

/** Five dots, filled to the difficulty level, with a text label for screen readers. */
export function Difficulty({ level, className }: { level: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
      <span aria-hidden className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={cn("size-1.5 rounded-full", i <= level ? "bg-primary" : "bg-border")} />
        ))}
      </span>
      <span>{DIFFICULTY_LABEL[level] ?? `Level ${level}`}</span>
    </span>
  );
}
