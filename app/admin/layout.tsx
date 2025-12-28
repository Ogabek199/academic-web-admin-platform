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
  Home
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';

interface User {
  id: string;
  username: string;
  email: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Skip auth check for login page
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    setMounted(true);
    if (!isLoginPage) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [isLoginPage]);

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

  // If login page, render without auth check
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Prevent hydration mismatch
  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via window.location
  }

  const navItems = [
    { href: '/admin', label: 'Asosiy', icon: Home },
    { href: '/admin/profile', label: 'Profil', icon: User },
    { href: '/admin/publications', label: 'Nashrlar', icon: BookOpen },
    { href: '/admin/statistics', label: 'Statistika', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin" className="flex items-center space-x-2 px-4 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 hidden sm:inline">Admin Panel</span>
              </Link>
              <div className="hidden md:ml-6 md:flex md:space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">{user.username}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Chiqish</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

