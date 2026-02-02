'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  GraduationCap,
  User,
  BookOpen,
  BarChart3,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  MessageCircle,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';

interface UserType {
  id: string;
  username: string;
  email: string;
}

const navItems = [
  { href: '/admin', label: 'Asosiy', icon: LayoutDashboard },
  { href: '/admin/profile', label: 'Profil boshqaruvi', icon: User },
  { href: '/admin/publications', label: 'Nashrlar', icon: BookOpen },
  { href: '/admin/statistics', label: 'Statistika', icon: BarChart3 },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    setMounted(true);
    if (!isLoginPage) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [isLoginPage]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();

      if (!data.user) {
        window.location.href = '/admin/login';
        return;
      }

      setUser(data.user);
    } catch (error) {
      console.error('Auth error:', error);
      window.location.href = '/admin/login';
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#2563EB] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between p-4 lg:justify-center border-b border-gray-200/60">
        <Link
          href="/admin"
          className="flex items-center gap-2"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center shrink-0">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900 lg:block hidden">
            Admin Panel
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          aria-label="Menuni yopish"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href === '/admin' && pathname === '/admin');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200/60 space-y-3">
        <Link
          href="/"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 shrink-0 text-[#2563EB]" />
          <span>Vebsaytga qaytish</span>
        </Link>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl">
          <div className="w-2 h-2 bg-[#10b981] rounded-full"></div>
          <span className="text-sm font-medium text-gray-700 truncate">
            {user.username}
          </span>
        </div>
        <a
          href="https://t.me/otaxonov_o17"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <MessageCircle className="h-5 w-5 shrink-0 text-[#2563EB]" />
          <span>Qo&apos;llab-quvvatlash: @otaxonov_o17</span>
        </a>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start flex items-center gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          Chiqish
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 shadow-sm z-30">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white border-r border-gray-200 shadow-xl z-50 flex flex-col transform transition-transform duration-200 ease-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:pl-64 min-h-screen flex flex-col">
        {/* Top bar - mobile */}
        <header className="lg:hidden sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            aria-label="Menuni ochish"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Admin</span>
          </Link>
          <Link
            href="/"
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            aria-label="Vebsaytga qaytish"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
