import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Mock station" };

export default function MockPage() {
  return (
    <ComingSoon
      title="Mock station"
      milestone="M5"
      summary="Choose a format, set prep and answer times, and get rubric feedback on each typed answer."
    />
  );
}
