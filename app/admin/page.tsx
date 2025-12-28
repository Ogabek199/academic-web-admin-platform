'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  BookOpen, 
  BarChart3, 
  TrendingUp,
  FileText,
  Plus,
  Settings,
  Sparkles
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    profile: false,
    publications: 0,
    citations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userRes, profileRes, pubRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/admin/profile'),
        fetch('/api/admin/publications'),
      ]);

      const userData = await userRes.json();
      const profileData = await profileRes.json();
      const pubData = await pubRes.json();

      if (!userData.user) {
        window.location.href = '/admin/login';
        return;
      }

      setUser(userData.user);
      
      const publications = pubData.publications || [];
      const totalCitations = publications.reduce((sum: number, p: any) => sum + (p.citations || 0), 0);

      setStats({
        profile: !!profileData.profile,
        publications: publications.length,
        citations: totalCitations,
      });
    } catch (error) {
      console.error('Error loading data:', error);
      // Don't redirect on error, just show empty state
    } finally {
      setLoading(false);
    }
  };

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

  const cards = [
    {
      title: 'Profil',
      value: stats.profile ? 'To\'ldirilgan' : 'To\'ldirilmagan',
      icon: User,
      href: '/admin/profile',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Nashrlar',
      value: stats.publications,
      icon: BookOpen,
      href: '/admin/publications',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      hoverBg: 'hover:bg-green-50',
    },
    {
      title: 'Jami Sitatalar',
      value: stats.citations,
      icon: TrendingUp,
      href: '/admin/statistics',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      hoverBg: 'hover:bg-purple-50',
    },
  ];

  const quickActions = [
    {
      title: 'Profilni yangilash',
      description: 'Shaxsiy ma\'lumotlarni to\'ldiring',
      icon: User,
      href: '/admin/profile',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Yangi nashr qo\'shish',
      description: 'Ilmiy nashr ma\'lumotlarini kiriting',
      icon: Plus,
      href: '/admin/publications',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Statistikani ko\'rish',
      description: 'Batafsil statistika va grafiklar',
      icon: BarChart3,
      href: '/admin/statistics',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 md:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-bold">Xush kelibsiz, {user?.username}!</h1>
          </div>
          <p className="text-xl text-white/90 max-w-2xl">
            Ma&apos;lumotlaringizni boshqarish va yangilash uchun admin panelga xush kelibsiz
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${card.textColor}`} />
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-lg opacity-0 group-hover:opacity-100 transition-opacity`}></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Settings className="w-6 h-6 text-gray-700" />
          <h2 className="text-2xl font-bold text-gray-900">Tezkor harakatlar</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group p-6 rounded-xl border-2 border-gray-200 hover:border-transparent hover:shadow-lg transition-all duration-300 relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                <div className="relative z-10">
                  <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-white transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors">
                    {action.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Maslahat</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Avval profil ma&apos;lumotlarini to&apos;ldiring, keyin nashrlar qo&apos;shing</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Profil rasmini yuklash orqali sahifangizni yanada chiroyli qiling</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Barcha ma&apos;lumotlar public websiteda ko&apos;rinadi</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
