'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, BookOpen, BarChart3, User } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Asosiy', icon: User },
    { href: '/publications', label: 'Nashrlar', icon: BookOpen },
    { href: '/statistics', label: 'Statistika', icon: BarChart3 },
    { href: '/profile', label: 'Profil', icon: GraduationCap },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-semibold text-gray-900">Akademik Profil</span>
          </Link>
          
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

