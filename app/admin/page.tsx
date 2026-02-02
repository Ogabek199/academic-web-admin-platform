'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  User,
  BookOpen,
  BarChart3,
  TrendingUp,
  Plus,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    profile: false,
    publications: 0,
    citations: 0,
    profileViews: 0,
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
      const totalCitations = publications.reduce(
        (sum: number, p: any) => sum + (p.citations || 0),
        0
      );

      setStats({
        profile: !!profileData.profile,
        publications: publications.length,
        citations: totalCitations,
        profileViews: profileData.profile ? 0 : 0, // kelajakda API orqali
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
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

  const overviewCards = [
    {
      title: 'Jami nashrlar',
      value: stats.publications,
      icon: BookOpen,
      href: '/admin/publications',
      color: 'bg-[#2563EB]',
      bgLight: 'bg-blue-50',
      textColor: 'text-[#2563EB]',
    },
    {
      title: 'Jami sitatalar',
      value: stats.citations,
      icon: TrendingUp,
      href: '/admin/statistics',
      color: 'bg-[#10b981]',
      bgLight: 'bg-emerald-50',
      textColor: 'text-[#10b981]',
    },
    {
      title: 'Profil holati',
      value: stats.profile ? "To'ldirilgan" : "To'ldirilmagan",
      icon: User,
      href: '/admin/profile',
      color: 'bg-[#8b5cf6]',
      bgLight: 'bg-purple-50',
      textColor: 'text-[#8b5cf6]',
    },
  ];

  const quickActions = [
    {
      title: 'Profilni yangilash',
      description: 'Shaxsiy ma\'lumotlar, muassasa, soha',
      icon: User,
      href: '/admin/profile',
      accent: 'border-[#2563EB] hover:bg-blue-50',
    },
    {
      title: 'Yangi nashr qo\'shish',
      description: 'Maqola, konferensiya, kitob',
      icon: Plus,
      href: '/admin/publications',
      accent: 'border-[#10b981] hover:bg-emerald-50',
    },
    {
      title: 'Statistikani ko\'rish',
      description: 'Grafiklar va metrikalar',
      icon: BarChart3,
      href: '/admin/statistics',
      accent: 'border-[#8b5cf6] hover:bg-purple-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Sarlavha */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Xush kelibsiz, {user?.username}!
        </h1>
        <p className="mt-1 text-gray-600">
          Ma&apos;lumotlaringizni boshqarish va yangilash
        </p>
      </div>

      {/* Overview kartochkalar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {overviewCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className={`${card.bgLight} p-3 rounded-xl`}>
                  <Icon className={`h-6 w-6 ${card.textColor}`} />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-[#2563EB] group-hover:translate-x-1 transition-all" />
              </div>
              <p className="mt-4 text-sm font-medium text-gray-500">
                {card.title}
              </p>
              <p className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900">
                {card.value}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Tezkor harakatlar */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Tezkor harakatlar
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Tez kirish uchun tugmalar
          </p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className={`flex items-start gap-4 p-4 rounded-xl border-2 border-gray-100 ${action.accent} transition-colors`}
              >
                <div className="p-2.5 bg-gray-100 rounded-lg shrink-0">
                  <Icon className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {action.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Maslahat */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Eye className="h-5 w-5 text-[#2563EB]" />
          Maslahat
        </h3>
        <ul className="mt-3 space-y-2 text-gray-600 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-[#2563EB] mt-0.5">•</span>
            Avval profil ma&apos;lumotlarini to&apos;ldiring, keyin nashrlar
            qo&apos;shing.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#2563EB] mt-0.5">•</span>
            Profil rasmini yuklash orqali sahifangizni yanada ishonchli
            qiling.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#2563EB] mt-0.5">•</span>
            Barcha ma&apos;lumotlar public vebsaytda ko&apos;rinadi.
          </li>
        </ul>
      </div>
    </div>
  );
}
