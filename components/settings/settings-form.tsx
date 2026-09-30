"use client";

import { Loader2 } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { saveSettings, type FormState } from "@/lib/actions/settings";
import { APPLICANT_TYPE_LABEL } from "@/lib/labels";
import type { ApplicantType } from "@/types/database.types";

export function SettingsForm({
  displayName,
  applicantType,
  universities,
  targetIds,
}: {
  displayName: string;
  applicantType: ApplicantType | null;
  universities: { id: string; name: string }[];
  targetIds: string[];
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveSettings, { ok: false, message: null });

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="display_name">Display name</Label>
          <Input id="display_name" name="display_name" defaultValue={displayName} maxLength={80} autoComplete="nickname" />
          <p className="text-muted-foreground text-xs">A first name or nickname is plenty.</p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="applicant_type">I&apos;m applying as</Label>
          <NativeSelect id="applicant_type" name="applicant_type" defaultValue={applicantType ?? ""}>
            <option value="">Prefer not to say</option>
            {(Object.keys(APPLICANT_TYPE_LABEL) as ApplicantType[]).map((k) => (
              <option key={k} value={k}>
                {APPLICANT_TYPE_LABEL[k]}
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Target universities</legend>
        <p className="text-muted-foreground text-xs">Used to prioritise recommended questions on your dashboard.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {universities.map((u) => (
            <label key={u.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="universities" value={u.id} defaultChecked={targetIds.includes(u.id)} className="accent-primary size-4" />
              {u.name}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="animate-spin" aria-hidden />} Save changes
        </Button>
        <p role="status" aria-live="polite" className={state.ok ? "text-primary text-sm" : "text-destructive text-sm"}>
          {state.message}
        </p>
      </div>
    </form>
  );
}
