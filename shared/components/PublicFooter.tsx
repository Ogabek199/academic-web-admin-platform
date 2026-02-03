'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, Send } from 'lucide-react';

const TELEGRAM_USERNAME = 'otaxonov_o17';

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#f8fafc] border-t border-gray-200" role="contentinfo" aria-label="Sayt pastki qismi">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Link
              href="/website"
              className="flex items-center gap-2 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
              aria-label="UzScholar — asosiy sahifa"
            >
              <Image
                src="/logo.svg"
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 rounded-xl"
              />
              <span className="text-lg font-bold text-gray-900">UzScholar</span>
            </Link>
            <p className="text-sm text-gray-600">
              Tadqiqotchilar, olimlar va talabalar uchun zamonaviy ilmiy platforma.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Sahifalar
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="/website" className="text-sm text-gray-600 hover:text-[#2563EB] transition-colors">
                  Asosiy
                </Link>
              </li>
              <li>
                <Link href="/website/researchers" className="text-sm text-gray-600 hover:text-[#2563EB] transition-colors">
                  Tadqiqotchilar
                </Link>
              </li>
              <li>
                <Link href="/website/publications" className="text-sm text-gray-600 hover:text-[#2563EB] transition-colors">
                  Nashrlar
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-[#2563EB] transition-colors">
                  Platforma haqida
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Yordam
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="/about#faq" className="text-sm text-gray-600 hover:text-[#2563EB] transition-colors">
                  Savol-javob (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Aloqa
            </h2>
            <a
              href={`https://t.me/${TELEGRAM_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 mb-2 rounded-xl bg-[#2563EB] text-white text-sm font-medium hover:bg-[#1d4ed8] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563EB]"
              aria-label="Telegram (yangi oyna)"
            >
              <Send className="h-4 w-4" />
              Telegram
            </a>
            <a
              href="tel:+998901502657"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-sm font-medium hover:bg-[#1d4ed8] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563EB]"
              aria-label="Telefon: +998 90 150 26 57"
            >
              <Phone className="h-4 w-4" />
              +998 90 150 26 57
            </a>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {currentYear} UzScholar. Barcha huquqlar himoyalangan.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/about" className="hover:text-gray-700 transition-colors">
              Platforma haqida
            </Link>
            <Link href="/about#faq" className="hover:text-gray-700 transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
