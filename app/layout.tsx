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
    default: "UzScholar — O'zbekistonning yetakchi ilmiy platformasi",
    template: "%s | UzScholar",
  },
  description:
    "UzScholar — Oʻzbekiston tadqiqotchilari, olimlar va talabalar uchun yagona ilmiy ekotizim. Ilmiy profillar, nashrlar statistikasi, sitatalar va akademik hamkorlik.",
  keywords: [
    "UzScholar",
    "ilmiy platforma",
    "tadqiqotchi profili",
    "O'zbekiston olimlari",
    "ilmiy nashrlar",
    "h-indeks",
    "sitatalar",
    "akademik reyting",
    "Uzbekistan science",
    "researchers in Uzbekistan",
  ],
  authors: [{ name: "UzScholar Team", url: baseUrl }],
  creator: "UzScholar",
  publisher: "UzScholar",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: baseUrl,
    siteName: "UzScholar",
    title: "UzScholar — Tadqiqotchilar va ilmiy nashrlar platformasi",
    description: "Oʻzbekistonning barcha olimlari va tadqiqotchilari bir joyda. Ilmiy natijalaringizni dunyoga ko'rsating.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "UzScholar - Academic Platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UzScholar — Ilmiy nashrlar va tadqiqotchilar platformasi",
    description: "O'zbekiston ilmiy hamjamiyati uchun zamonaviy raqamli platforma.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: { canonical: baseUrl },
  category: "Science & Education",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
    shortcut: "/logo.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "UzScholar",
  "alternateName": "O'zbekiston Ilmiy Nashrlar Platformasi",
  "description": "O'zbekiston tadqiqotchilari va ilmiy nashrlari uchun yagona ma'lumotlar bazasi",
  "url": baseUrl,
  "logo": `${baseUrl}/logo.svg`,
  "sameAs": [
    "https://facebook.com/uzscholar",
    "https://t.me/uzscholar",
    "https://linkedin.com/company/uzscholar"
  ],
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${baseUrl}/search?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
};

import ToastProvider from "@/shared/components/ToastProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={`${inter.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-white text-slate-900 antialiased font-sans selection:bg-blue-100 selection:text-blue-900" suppressHydrationWarning>
        <ToastProvider />
        <div className="bg-mesh min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}

