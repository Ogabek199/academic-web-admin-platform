'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, LogIn, Menu, X } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18 gap-4">
          {/* Logo */}
          <Link href="/website" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 hidden sm:inline">
              UzScholar
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/website' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                      ? 'bg-[#2563EB]/10 text-[#2563EB]'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <a
              href={`https://t.me/${TELEGRAM_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              Telegram
            </a>
            <Link href="/admin/login" className="ml-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB]/10"
              >
                <LogIn className="h-4 w-4" />
                Admin
              </Button>
            </Link>
          </nav>

          {/* Mobile: menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link href="/admin/login" className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <LogIn className="h-5 w-5" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              aria-label={mobileMenuOpen ? 'Menuni yopish' : 'Menuni ochish'}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium ${pathname === link.href
                      ? 'bg-[#2563EB]/10 text-[#2563EB]'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={`https://t.me/${TELEGRAM_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Telegram: @{TELEGRAM_USERNAME}
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
