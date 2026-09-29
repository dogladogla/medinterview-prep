import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Reading library" };

export default function ReadingPage() {
  return (
    <ComingSoon
      title="Reading library"
      milestone="M8"
      summary="Short original summaries of GMC guidance, the NHS Constitution and key books, linked to the questions they help with."
    />
  );
}
