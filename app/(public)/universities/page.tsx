import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Universities" };

export default function UniversitiesPage() {
  return (
    <ComingSoon
      title="Universities"
      milestone="M8"
      summary="Interview format, style and what each school looks for — Oxford, Cambridge, Imperial and Manchester."
    />
  );
}
