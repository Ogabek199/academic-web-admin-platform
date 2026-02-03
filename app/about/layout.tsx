import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Platforma haqida',
  description:
    "UzScholar — tadqiqotchilar, olimlar va talabalar uchun ilmiy platforma. Maqsadlar, xususiyatlar va tez-tez so'raladigan savollar.",
  openGraph: {
    title: 'Platforma haqida | UzScholar',
    description: "UzScholar ilmiy platformasi haqida: maqsadlar, xususiyatlar, FAQ.",
    type: 'website',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
