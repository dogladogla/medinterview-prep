import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "AI interviewer" };

export default function InterviewerPage() {
  return (
    <ComingSoon
      title="AI interviewer"
      milestone="M6"
      summary="A text interview with follow-up questions and a debrief at the end. Choose from four interviewer styles."
    />
  );
}
