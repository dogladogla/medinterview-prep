import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  back,
  children,
}: {
  title: string;
  description?: ReactNode;
  back?: { href: string; label: string };
  children?: ReactNode;
}) {
  return (
    <header className="space-y-3 pb-2">
      {back && (
        <Link
          href={back.href}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm focus-visible:underline"
        >
          <ChevronLeft className="size-4" aria-hidden />
          {back.label}
        </Link>
      )}
      <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">{title}</h1>
      {description && <div className="text-muted-foreground max-w-3xl">{description}</div>}
      {children}
    </header>
  );
}

export function SectionHeading({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-20 text-lg font-semibold tracking-tight">
      {children}
    </h2>
  );
}
