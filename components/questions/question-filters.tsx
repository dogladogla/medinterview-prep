"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";

type Option = { value: string; label: string };

export function QuestionFilters({
  categories,
  universities,
  formats,
  signedIn,
}: {
  categories: Option[];
  universities: Option[];
  formats: Option[];
  signedIn: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const first = useRef(true);

  function update(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    startTransition(() => router.replace(`${pathname}?${next.toString()}`, { scroll: false }));
  }

  // Debounce free-text search so we don't navigate on every keystroke.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = setTimeout(() => update("q", query.trim() || null), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run when the text changes
  }, [query]);

  const active = ["q", "category", "university", "format", "difficulty", "starred"].some((k) => params.get(k));

  return (
    <form
      role="search"
      aria-label="Filter questions"
      onSubmit={(e) => e.preventDefault()}
      className="bg-card grid gap-3 rounded-xl border p-4 sm:grid-cols-2 lg:grid-cols-6"
      aria-busy={pending}
    >
      <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
        <Label htmlFor="f-q">Search</Label>
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-2.5 left-2.5 size-4" aria-hidden />
          <Input
            id="f-q"
            type="search"
            placeholder="e.g. consent, teamwork, kidney"
            className="pl-8"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <FilterSelect id="f-cat" label="Category" value={params.get("category")} options={categories} onChange={(v) => update("category", v)} />
      <FilterSelect id="f-uni" label="University" value={params.get("university")} options={universities} onChange={(v) => update("university", v)} />
      <FilterSelect id="f-fmt" label="Format" value={params.get("format")} options={formats} onChange={(v) => update("format", v)} />
      <FilterSelect
        id="f-diff"
        label="Difficulty"
        value={params.get("difficulty")}
        options={[1, 2, 3, 4, 5].map((d) => ({ value: String(d), label: `Level ${d}` }))}
        onChange={(v) => update("difficulty", v)}
      />
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2 lg:col-span-6">
        {signedIn && (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-primary size-4"
              checked={params.get("starred") === "1"}
              onChange={(e) => update("starred", e.target.checked ? "1" : null)}
            />
            Starred only
          </label>
        )}
        {active && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery("");
              startTransition(() => router.replace(pathname, { scroll: false }));
            }}
          >
            <X aria-hidden /> Clear filters
          </Button>
        )}
      </div>
    </form>
  );
}

function FilterSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string | null;
  options: Option[];
  onChange: (v: string | null) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <NativeSelect id={id} value={value ?? ""} onChange={(e) => onChange(e.target.value || null)}>
        <option value="">All</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </NativeSelect>
    </div>
  );
}
