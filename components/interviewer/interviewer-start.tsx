"use client";

import { Loader2, MessagesSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { cn } from "@/lib/utils";

type PersonaOption = { slug: string; name: string; description: string; followUpStyle: string };

export function InterviewerStart({
  personas,
  universities,
}: {
  personas: PersonaOption[];
  universities: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const [persona, setPersona] = useState(personas[0]?.slug ?? "");
  const [university, setUniversity] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/interviewer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start", personaSlug: persona, universitySlug: university || null }),
      });
      const body = (await res.json().catch(() => null)) as { ok: boolean; sessionId?: string; error?: string } | null;
      if (body?.ok && body.sessionId) {
        router.push(`/interviewer/${body.sessionId}`);
        return;
      }
      setError(body?.error ?? "Couldn't start the interview.");
    } catch {
      setError("Network error — check your connection and try again.");
    }
    setPending(false);
  }

  return (
    <div className="space-y-6">
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold">Choose your interviewer</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {personas.map((p) => (
            <label
              key={p.slug}
              className={cn(
                "has-focus-visible:ring-ring/50 cursor-pointer rounded-xl border p-4 transition-colors has-focus-visible:ring-[3px]",
                persona === p.slug ? "border-primary bg-accent" : "hover:bg-muted",
              )}
            >
              <input
                type="radio"
                name="persona"
                value={p.slug}
                checked={persona === p.slug}
                onChange={() => setPersona(p.slug)}
                className="sr-only"
              />
              <span className="block font-medium">{p.name}</span>
              <span className="text-muted-foreground mt-1 block text-sm">{p.description}</span>
              <span className="text-muted-foreground mt-2 block text-xs italic">{p.followUpStyle}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="max-w-xs space-y-1.5">
        <Label htmlFor="int-uni">University style (optional)</Label>
        <NativeSelect id="int-uni" value={university} onChange={(e) => setUniversity(e.target.value)}>
          <option value="">General</option>
          {universities.map((u) => (
            <option key={u.slug} value={u.slug}>
              {u.name}
            </option>
          ))}
        </NativeSelect>
      </div>
      {error && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
      <Button size="lg" onClick={start} disabled={pending || !persona}>
        {pending ? <Loader2 className="animate-spin" aria-hidden /> : <MessagesSquare aria-hidden />}
        {pending ? "Your interviewer is getting ready…" : "Start interview"}
      </Button>
    </div>
  );
}
