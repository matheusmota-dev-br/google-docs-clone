import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { auth } from "@/auth";
import { Providers } from "@/components/providers";
import { getActiveOrganization } from "@/lib/organizations";

/** Feeds the `--font-sans` token that `@repo/tailwind-config` maps to `font-sans`. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Docs — real-time collaborative editor",
    template: "%s · Docs",
  },
  description:
    "A Google Docs clone built with Next.js, Yjs, Keycloak and a Storybook-documented design system.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [session, activeOrganization] = await Promise.all([
    auth(),
    getActiveOrganization(),
  ]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <Providers
          session={session}
          workspace={{
            activeOrganization,
            organizations: session?.organizations ?? [],
          }}
        >
          {children}
        </Providers>
      </body>
    </html>
  );
}
