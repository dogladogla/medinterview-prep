import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Frameworks" };

export default function FrameworksPage() {
  return (
    <ComingSoon
      title="Frameworks"
      milestone="M3"
      summary="Four Pillars, STAR, reflection, SPIKES and more — each with steps, when to use it and a worked example."
    />
  );
}
