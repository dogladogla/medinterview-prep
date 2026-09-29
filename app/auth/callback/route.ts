import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { ensureProfile } from "@/lib/profile";
import { safeNextPath } from "@/lib/safe-redirect";
import { createClient } from "@/lib/supabase/server";

// Handles the magic-link return trip. Supports both the default PKCE `?code=`
// link and a custom email template that sends `?token_hash=&type=`.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const next = safeNextPath(searchParams.get("next"));
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const supabase = await createClient();

  let userId: string | null = null;
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) userId = data.user?.id ?? null;
  } else if (tokenHash && type) {
    const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (!error) userId = data.user?.id ?? null;
  }

  if (!userId) {
    return NextResponse.redirect(`${origin}/login?error=link`);
  }

  try {
    await ensureProfile(supabase, userId);
  } catch {
    return NextResponse.redirect(`${origin}/login?error=profile`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
