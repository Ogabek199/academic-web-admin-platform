'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LogIn, Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const TELEGRAM_USERNAME = 'otaxonov_o17';

export default function PublicNavigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/website', label: 'Asosiy' },
    { href: '/website/researchers', label: 'Tadqiqotchilar' },
    { href: '/website/publications', label: 'Nashrlar' },
    { href: '/about', label: 'Platforma haqida' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-[60] px-4 py-4 pointer-events-none" role="banner">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] overflow-hidden transition-all duration-300"
        >
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-18 gap-4">
              {/* Logo */}
              <Link
                href="/website"
                className="flex items-center gap-2 shrink-0 rounded-lg group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="UzScholar — asosiy sahifa"
              >
                <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Image
                    src="/logo.svg"
                    alt="UzScholar logotipi"
                    width={40}
                    height={40}
                    priority
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-primary transition-colors hidden sm:inline">
                  UzScholar
                </span>
              </Link>

              {/* Desktop nav */}
              <nav className="hidden lg:flex items-center gap-1" aria-label="Asosiy navigatsiya">
                {navLinks.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href !== '/website' && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="relative px-4 py-2 text-sm font-semibold group transition-all"
                    >
                      <span className={`relative z-10 transition-colors ${isActive ? 'text-primary' : 'text-slate-600 group-hover:text-slate-900'}`}>
                        {link.label}
                      </span>
                      {isActive && (
                        <motion.div 
                          layoutId="nav-pill"
                          className="absolute inset-0 bg-primary/10 rounded-lg -z-0"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Link>
                  );
                })}
                <div className="w-px h-6 bg-slate-200 mx-4" />
                <a
                  href={`https://t.me/${TELEGRAM_USERNAME}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all"
                >
                  Telegram
                </a>
                <Link href="/admin/login" className="ml-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-xl px-6 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all font-bold"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Kirish
                  </Button>
                </Link>
              </nav>

              {/* Mobile: menu button */}
              <div className="flex items-center gap-2 lg:hidden">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-3 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-100"
                  aria-label={mobileMenuOpen ? 'Menuni yopish' : 'Menuni ochish'}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden border-t border-slate-100 bg-white/50 overflow-hidden"
              >
                <nav className="flex flex-col p-4 gap-2" aria-label="Mobil navigatsiya">
                  {navLinks.map((link) => {
                    const isActive =
                      pathname === link.href ||
                      (link.href !== '/website' && pathname.startsWith(link.href));
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-5 py-4 rounded-xl text-base font-bold transition-all ${
                          isActive
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-primary'
                        }`}
                      >
                        {link.label}
                        <ArrowRight className={`h-4 w-4 transition-transform ${isActive ? 'translate-x-0' : '-translate-x-2 opacity-0'}`} />
                      </Link>
                    )
                  })}
                  <a
                    href={`https://t.me/${TELEGRAM_USERNAME}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-5 py-4 rounded-xl text-base font-bold text-slate-700 hover:bg-slate-100 hover:text-primary transition-all"
                  >
                    Telegram: @{TELEGRAM_USERNAME}
                    <ArrowRight className="h-4 w-4 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
                  </a>
                  <Link 
                    href="/admin/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="mt-2 flex items-center justify-center gap-3 px-5 py-5 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all"
                  >
                    <LogIn className="h-5 w-5" />
                    Admin paneliga kirish
                  </Link>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </header>
  );
}
