import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Question bank" };

export default function QuestionsPage() {
  return (
    <ComingSoon
      title="Question bank"
      milestone="M3"
      summary="Filter by category, university, format and difficulty, then attempt each question before revealing the scaffold and exemplar."
    />
  );
}
