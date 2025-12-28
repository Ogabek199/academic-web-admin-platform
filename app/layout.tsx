import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Akademik Profil - Ilmiy Nashrlar va Statistika",
  description: "Shaxsiy akademik profil, ilmiy nashrlar, sitatalar va tadqiqot statistikasi",
  keywords: ["akademik profil", "ilmiy nashrlar", "statistika", "tadqiqot", "publications", "research"],
  authors: [{ name: "Akademik Profil" }],
  openGraph: {
    title: "Akademik Profil",
    description: "Shaxsiy akademik profil, ilmiy nashrlar va statistika",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-white antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
