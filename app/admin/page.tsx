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
  FileText,
  Users,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    profile: false,
    publications: 0,
    citations: 0,
    profileViews: 124, // Mock data for now
    lastUpdate: 'Bugun',
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
        profileViews: 124,
        lastUpdate: new Date().toLocaleDateString('uz-UZ'),
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const overviewCards = [
    {
      title: 'Nashrlar',
      value: stats.publications,
      label: 'Jami ilmiy ishlar',
      icon: BookOpen,
      href: '/admin/publications',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Sitatalar',
      value: stats.citations,
      label: 'Google Scholar bo\'yicha',
      icon: TrendingUp,
      href: '/admin/statistics',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Ko\'rilgan',
      value: stats.profileViews,
      label: 'Profilga tashriflar',
      icon: Eye,
      href: '#',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const quickActions = [
    {
      title: 'Profilni tahrirlash',
      description: 'Shaxsiy va ilmiy ma\'lumotlar',
      icon: User,
      href: '/admin/profile',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Nashr qo\'shish',
      description: 'Maqola yoki konferensiya',
      icon: Plus,
      href: '/admin/publications',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Hisobotlar',
      description: 'Statistika va grafiklar',
      icon: BarChart3,
      href: '/admin/statistics',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Xayrli kun, <span className="text-primary">{user?.username}</span>!
          </h1>
          <p className="mt-2 text-slate-500 font-medium">
            Akademik profilingiz hozirda <span className="text-primary font-bold">{stats.profile ? '100%' : '40%'}</span> tayyor.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/website" target="_blank">
            <Button variant="outline" className="rounded-xl font-bold bg-white text-slate-700 border-slate-200">
              <Eye className="h-4 w-4 mr-2" />
              Saytni ko'rish
            </Button>
          </Link>
          <Link href="/admin/publications">
            <Button className="rounded-xl font-bold shadow-lg shadow-primary/20 bg-primary">
              <Plus className="h-4 w-4 mr-2" />
              Yangi nashr
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {overviewCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                href={card.href}
                className="group relative bg-white rounded-3xl p-8 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-primary/20 transition-all duration-500 block overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 -mr-4 -mt-4 transform rotate-12 transition-transform group-hover:rotate-0 duration-500">
                  <Icon className="h-24 w-24" />
                </div>
                <div className="relative z-10">
                  <div className={`inline-flex p-4 ${card.bgColor} rounded-2xl transform transition-transform group-hover:scale-110 duration-500`}>
                    <Icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                  <div className="mt-6">
                    <p className="text-sm font-bold text-slate-500 tracking-wider uppercase">{card.title}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <h3 className="text-4xl font-black text-slate-900">{card.value}</h3>
                      <span className="text-xs font-bold text-slate-400">{card.label}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/60 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-900">Tezkor harakatlar</h2>
              <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="flex items-center gap-4 p-5 rounded-2xl border border-slate-100 hover:border-primary/20 hover:bg-primary/[0.02] transition-all group"
                  >
                    <div className={`p-3 ${action.bg} ${action.color} rounded-xl group-hover:scale-110 transition-transform`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900">{action.title}</h4>
                      <p className="text-sm text-slate-500 font-medium">{action.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/20">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <FileText className="h-32 w-32 rotate-12" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4">Profil holati</h3>
              <div className="w-full bg-white/10 rounded-full h-3 mb-6 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: stats.profile ? '100%' : '40%' }}
                  className="bg-primary h-full rounded-full"
                />
              </div>
              <p className="text-sm text-slate-300 mb-6 font-medium leading-relaxed">
                Profilingizni to'liq to'ldirish foydalanuvchilarning sizga nisbatan ishonchini oshiradi.
              </p>
              {!stats.profile && (
                <Link href="/admin/profile">
                  <Button className="w-full rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold border-0 h-14">
                    Tugatish
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/60 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Eslatmalar
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  Ma'lumotlar saqlanganidan so'ng, ular 1 daqiqa ichida asosiy saytda yangilanadi.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  Nashr fayllarini yuklashda PDF formatidan foydalanish tavsiya etiladi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
