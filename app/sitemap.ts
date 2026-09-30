import type { MetadataRoute } from "next";

import { getIndexes } from "@/lib/content/queries";
import { siteUrl } from "@/lib/site";

// Built per request (cached content) so a database outage never breaks a deploy.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const staticPaths = ["", "/questions", "/frameworks", "/universities", "/reading", "/about", "/privacy"];
  const pages = staticPaths.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8 }));
  let idx: Awaited<ReturnType<typeof getIndexes>>;
  try {
    idx = await getIndexes();
  } catch {
    return pages;
  }
  return [
    ...pages,
    ...idx.questions.map((q) => ({ url: `${base}/questions/${q.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...idx.frameworks.map((f) => ({ url: `${base}/frameworks/${f.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...idx.universities.map((u) => ({ url: `${base}/universities/${u.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...idx.reading.map((r) => ({ url: `${base}/reading/${r.slug}`, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
