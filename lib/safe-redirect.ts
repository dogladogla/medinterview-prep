/**
 * Only allow same-site relative paths as post-login redirects, so a crafted
 * `?next=https://evil.example` link can't bounce users off-site.
 */
export function safeNextPath(next: string | null | undefined, fallback = "/dashboard"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}
