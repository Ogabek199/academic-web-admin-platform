import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://uzscholar.uz";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "UzScholar — Tadqiqotchilar va ilmiy nashrlar platformasi",
    template: "%s | UzScholar",
  },
  description:
    "Oʻzbekiston tadqiqotchilari, olimlar va talabalar uchun ilmiy profil, nashrlar, sitatalar va tadqiqot statistikasi. UzScholar — zamonaviy akademik platforma.",
  keywords: [
    "UzScholar",
    "akademik profil",
    "ilmiy nashrlar",
    "tadqiqotchilar",
    "sitatalar",
    "tadqiqot",
    "Oʻzbekiston",
    "research",
    "publications",
  ],
  authors: [{ name: "UzScholar", url: baseUrl }],
  creator: "UzScholar",
  publisher: "UzScholar",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: baseUrl,
    siteName: "UzScholar",
    title: "UzScholar — Tadqiqotchilar va ilmiy nashrlar platformasi",
    description: "Tadqiqotchilar, olimlar va talabalar uchun ilmiy profil, nashrlar va statistika.",
    images: [{ url: "/logo.svg", width: 512, height: 512, alt: "UzScholar logo" }],
  },
  twitter: {
    card: "summary",
    title: "UzScholar — Tadqiqotchilar va ilmiy nashrlar platformasi",
    description: "Tadqiqotchilar, olimlar va talabalar uchun ilmiy platforma.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: baseUrl },
  category: "education",
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563EB",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "UzScholar",
  description: "Tadqiqotchilar va ilmiy nashrlar platformasi",
  url: baseUrl,
  inLanguage: "uz",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${baseUrl}/website?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-white antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
