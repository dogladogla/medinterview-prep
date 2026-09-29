import Link from "next/link";
import { Stethoscope } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NAV_ITEMS, SITE } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";
import { NavLinks } from "./nav-links";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Signed-out visitors see only the public content sections.
  const items = user ? NAV_ITEMS : NAV_ITEMS.filter((i) => !i.requiresAuth);

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold">
          <Stethoscope className="text-primary size-5" aria-hidden />
          <span>{SITE.name}</span>
        </Link>

        <nav aria-label="Main" className="hidden flex-1 md:block">
          <NavLinks items={items} />
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/settings">Settings</Link>
              </Button>
              <form action="/auth/signout" method="post">
                <Button type="submit" variant="outline" size="sm">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Small screens: nav moves to a scrollable second row. */}
      <nav aria-label="Main" className="overflow-x-auto border-t px-2 py-1 md:hidden">
        <NavLinks items={items} />
      </nav>
    </header>
  );
}
