"use client";

import { Loader2, Play } from "lucide-react";
import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { createMockSession, type MockConfigState } from "@/lib/actions/mock";
import { MOCK_PRESETS } from "@/lib/mock/select-questions";
import { cn } from "@/lib/utils";

type Config = { format: string; university: string; stations: number; prep: number; answer: number };

export function MockConfigForm({ universities }: { universities: { slug: string; name: string }[] }) {
  const [state, action, pending] = useActionState<MockConfigState, FormData>(createMockSession, { error: null });
  const [preset, setPreset] = useState<string>("imperial");
  const initial = MOCK_PRESETS[0];
  const [cfg, setCfg] = useState<Config>({
    format: initial.format,
    university: initial.university,
    stations: initial.stations,
    prep: initial.prep,
    answer: initial.answer,
  });
  const set = (patch: Partial<Config>) => {
    setPreset("custom");
    setCfg((c) => ({ ...c, ...patch }));
  };

  return (
    <form action={action} className="space-y-6">
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold">Start from a preset</legend>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={preset === p.id}
              onClick={() => {
                setPreset(p.id);
                setCfg({ format: p.format, university: p.university, stations: p.stations, prep: p.prep, answer: p.answer });
              }}
              className={cn(
                "focus-visible:ring-ring/50 rounded-lg border p-3 text-left transition-colors outline-none focus-visible:ring-[3px]",
                preset === p.id ? "border-primary bg-accent" : "hover:bg-muted",
              )}
            >
              <span className="block text-sm font-medium">{p.label}</span>
              <span className="text-muted-foreground text-xs">{p.note}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <legend className="mb-3 text-sm font-semibold">Settings</legend>
        <Field id="m-format" label="Format">
          <NativeSelect id="m-format" name="format" value={cfg.format} onChange={(e) => set({ format: e.target.value })}>
            <option value="mmi">MMI stations</option>
            <option value="panel">Panel questions</option>
            <option value="oxbridge">Oxbridge tutorial</option>
            <option value="online">Online interview</option>
          </NativeSelect>
        </Field>
        <Field id="m-uni" label="University (optional)">
          <NativeSelect id="m-uni" name="university" value={cfg.university} onChange={(e) => set({ university: e.target.value })}>
            <option value="">Any</option>
            {universities.map((u) => (
              <option key={u.slug} value={u.slug}>
                {u.name}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field id="m-stations" label="Stations">
          <NativeSelect id="m-stations" name="stations" value={cfg.stations} onChange={(e) => set({ stations: Number(e.target.value) })}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field id="m-prep" label="Reading time">
          <NativeSelect id="m-prep" name="prep" value={cfg.prep} onChange={(e) => set({ prep: Number(e.target.value) })}>
            {[0, 30, 60, 120].map((s) => (
              <option key={s} value={s}>
                {s === 0 ? "None" : s < 60 ? `${s} seconds` : `${s / 60} min`}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field id="m-answer" label="Answer time">
          <NativeSelect id="m-answer" name="answer" value={cfg.answer} onChange={(e) => set({ answer: Number(e.target.value) })}>
            {[120, 180, 240, 300, 420, 480, 600].map((s) => (
              <option key={s} value={s}>
                {s / 60} min
              </option>
            ))}
          </NativeSelect>
        </Field>
      </fieldset>

      {state.error && (
        <p role="alert" className="text-destructive text-sm">
          {state.error}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Play aria-hidden />}
          Start mock
        </Button>
        <p className="text-muted-foreground text-sm">
          Find a quiet spot. Speak your answers aloud, then type the key points — feedback arrives at the end.
        </p>
      </div>
    </form>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}
