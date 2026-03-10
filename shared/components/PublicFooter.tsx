'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, Send } from 'lucide-react';

const TELEGRAM_USERNAME = 'otaxonov_o17';

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-900 pt-24 pb-12 overflow-hidden" role="contentinfo" aria-label="Sayt pastki qismi">
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-50" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-accent/20 rounded-full blur-[120px] pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          {/* Brand section */}
          <div className="lg:col-span-4 max-w-sm">
            <Link
              href="/website"
              className="group flex items-center gap-3 mb-8 rounded-lg focus:outline-none"
              aria-label="UzScholar — asosiy sahifa"
            >
              <div className="h-12 w-12 rounded-2xl bg-white/10 p-2 border border-white/20 group-hover:scale-110 transition-transform">
                <Image
                  src="/logo.svg"
                  alt=""
                  width={48}
                  height={48}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">UzScholar</span>
            </Link>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Tadqiqotchilar, olimlar va talabalar uchun O'zbekistondagi eng yirik va zamonaviy ilmiy ekotizim.
            </p>
            <div className="flex items-center gap-4">
              <a href={`https://t.me/${TELEGRAM_USERNAME}`} target="_blank" className="p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-primary transition-all">
                <Send className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8">
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-8">
                Platforma
              </h2>
              <ul className="space-y-4">
                {['Asosiy', 'Tadqiqotchilar', 'Nashrlar', 'Haqida'].map((label, i) => (
                  <li key={i}>
                    <Link
                      href={['/website', '/website/researchers', '/website/publications', '/about'][i]}
                      className="text-slate-400 hover:text-white transition-colors flex items-center group"
                    >
                      <span className="h-1.5 w-0 bg-primary rounded-full mr-0 group-hover:w-1.5 group-hover:mr-2 transition-all" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-8">
                Yordam
              </h2>
              <ul className="space-y-4">
                <li>
                  <Link href="/about#faq" className="text-slate-400 hover:text-white transition-colors flex items-center group">
                    <span className="h-1.5 w-0 bg-primary rounded-full mr-0 group-hover:w-1.5 group-hover:mr-2 transition-all" />
                    Savol-javoblar
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact section */}
          <div className="lg:col-span-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-8">
              Aloqa markazi
            </h2>
            <div className="space-y-4">
              <a
                href={`https://t.me/${TELEGRAM_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all"
              >
                <span className="text-slate-500 text-xs font-bold mb-1 group-hover:text-primary transition-colors">Yordam boti</span>
                <span className="text-white font-semibold flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  @{TELEGRAM_USERNAME}
                </span>
              </a>
              <a
                href="tel:+998901502657"
                className="group flex flex-col p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all"
              >
                <span className="text-slate-500 text-xs font-bold mb-1 group-hover:text-primary transition-colors">Ishonch telefoni</span>
                <span className="text-white font-semibold flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  +998 90 150 26 57
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>Ma'lumotlar xavfsizligi ta'minlangan</span>
            <div className="h-1 w-1 rounded-full bg-slate-700" />
            <span>{currentYear} UzScholar Project</span>
          </div>
          <p className="text-sm text-slate-500 order-last md:order-none">
            © Barcha huquqlar himoyalangan.
          </p>
          <div className="flex items-center gap-8">
            <Link href="/about" className="text-sm text-slate-500 hover:text-white transition-colors">Siyosatimiz</Link>
            <Link href="/about#faq" className="text-sm text-slate-500 hover:text-white transition-colors">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
