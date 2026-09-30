import type { Metadata } from "next";
import Link from "next/link";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { SiteHeader } from "@/components/layout/site-header";
import { SITE, siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: SITE.name, template: `%s · ${SITE.name}` },
  description: SITE.description,
  openGraph: { siteName: SITE.name, type: "website", locale: "en_GB" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="bg-primary text-primary-foreground sr-only z-50 rounded-md px-3 py-2 focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
          {children}
        </main>
        <footer className="text-muted-foreground border-t py-6 text-xs">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4">
            <p>{SITE.name} is a practice tool, not affiliated with any university or the NHS. AI feedback can be wrong.</p>
            <nav aria-label="Footer" className="flex gap-4">
              <Link href="/about" className="hover:text-foreground underline-offset-4 hover:underline">
                About &amp; support
              </Link>
              <Link href="/privacy" className="hover:text-foreground underline-offset-4 hover:underline">
                Privacy
              </Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
