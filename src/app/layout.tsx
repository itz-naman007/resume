import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";
import { themeInitScript } from "@/lib/theme-script";
import "./globals.css";

/* Typography system — editorial display, quiet body, technical mono. */
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.name}, ${profile.roles[0]}`,
    template: `%s, ${profile.name}`,
  },
  description: profile.subheadline,
  keywords: [
    ...profile.roles,
    "RAG",
    "LangChain",
    "PyTorch",
    "TensorFlow",
    "NLP",
    "portfolio",
  ],
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: `${profile.name}, ${profile.roles[0]}`,
    description: profile.subheadline,
    siteName: profile.name,
    locale: "en_US",
    images: [{ url: "/images/profile.jpeg", alt: profile.name }],
  },
  twitter: {
    card: "summary",
    images: ["/images/profile.jpeg"],
    title: `${profile.name}, ${profile.roles[0]}`,
    description: profile.subheadline,
  },
  robots: { index: true, follow: true },
};

/** JSON-LD structured data — helps recruiters' tools & search engines. */
function StructuredData() {
  const json = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    email: `mailto:${profile.email}`,
    url: SITE_URL,
    jobTitle: profile.roles[0],
    alumniOf: profile.education.school,
    sameAs: socials.map((s) => s.url),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Apply persisted theme before first paint — prevents flash */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <StructuredData />
      </head>
      <body>{children}</body>
    </html>
  );
}
