'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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
import { motion, AnimatePresence } from 'framer-motion';

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
      <div className="flex items-center justify-between p-6 lg:justify-start border-b border-slate-200/50">
        <Link
          href="/admin"
          className="flex items-center gap-3 group"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Image
              src="/logo.svg"
              alt="UzScholar logotipi"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-primary transition-colors lg:block hidden">
            UzScholar
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
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
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative group ${isActive
                ? 'text-white shadow-lg shadow-primary/20 bg-primary'
                : 'text-slate-600 hover:bg-slate-100 hover:text-primary'
                }`}
            >
              <Icon className={`h-5 w-5 shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="admin-nav-pill"
                  className="absolute inset-0 bg-primary rounded-xl -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200/50 space-y-2">
        <Link
          href="/website"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-primary transition-all group"
        >
          <ArrowLeft className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:-translate-x-1" />
          <span>Saytga qaytish</span>
        </Link>
        
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50/50 rounded-xl border border-slate-200/50">
          <div className="relative">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-xs">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{user.username}</p>
            <p className="text-[10px] text-slate-500 truncate lowercase">{user.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
        >
          <LogOut className="h-5 w-5" />
          Chiqish
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AnimatePresence mode="wait">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 z-30">
          <SidebarContent />
        </aside>
      </AnimatePresence>

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
        className={`fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white border-r border-gray-200 shadow-xl z-50 flex flex-col transform transition-transform duration-200 ease-out lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:pl-64 min-h-screen flex flex-col">
        {/* Top bar - mobile */}
        <header className="lg:hidden sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
            aria-label="Menuni ochish"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link href="/admin" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="font-bold text-slate-900 group-hover:text-primary transition-colors">Admin</span>
          </Link>
          <Link
            href="/website"
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
            aria-label="Vebsaytga qaytish"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
