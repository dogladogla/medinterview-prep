export const SITE = {
  name: "MedInterview Prep",
  description:
    "Practise UK medical school interviews with frameworks, timed mock stations and AI feedback — MMI, panel and Oxbridge.",
} as const;

export type NavItem = { href: string; label: string; requiresAuth: boolean };

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/questions", label: "Questions", requiresAuth: false },
  { href: "/frameworks", label: "Frameworks", requiresAuth: false },
  { href: "/universities", label: "Universities", requiresAuth: false },
  { href: "/reading", label: "Reading", requiresAuth: false },
  { href: "/mock", label: "Mock station", requiresAuth: true },
  { href: "/interviewer", label: "AI interviewer", requiresAuth: true },
  { href: "/dashboard", label: "Dashboard", requiresAuth: true },
];

/** Absolute site URL for metadata and the sitemap. Vercel sets the production host. */
export function siteUrl(): string {
  const host = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (!host) return "http://localhost:3000";
  return host.startsWith("http") ? host : `https://${host}`;
}
