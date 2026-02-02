'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Globe,
  ExternalLink,
  Share2,
  BookOpen,
  TrendingUp,
  Award,
  FileText,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import PublicPublicationList from '@/components/public/PublicationList';
import { Statistics } from '@/types';

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const [profile, setProfile] = useState<any>(null);
  const [publications, setPublications] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [shareMessage, setShareMessage] = useState<'idle' | 'ok' | 'error'>('idle');

  useEffect(() => {
    if (userId) loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const response = await fetch(`/api/public/profiles/${userId}`);
      const data = await response.json();

      if (!data.profile) {
        setLoading(false);
        return;
      }

      setProfile(data.profile);
      const pubs = data.publications || [];
      setPublications(pubs);

      const totalPublications = pubs.length;
      const totalCitations = pubs.reduce((sum: number, p: any) => sum + (p.citations || 0), 0);
      const sortedByCitations = [...pubs].sort((a: any, b: any) => b.citations - a.citations);
      let hIndex = 0;
      for (let i = 0; i < sortedByCitations.length; i++) {
        if (sortedByCitations[i].citations >= i + 1) hIndex = i + 1;
        else break;
      }
      const i10Index = pubs.filter((p: any) => p.citations >= 10).length;
      const citationsByYearMap = new Map<number, number>();
      pubs.forEach((p: any) => {
        const y = p.year;
        citationsByYearMap.set(y, (citationsByYearMap.get(y) || 0) + p.citations);
      });
      const citationsByYear = Array.from(citationsByYearMap.entries())
        .map(([year, citations]) => ({ year, citations }))
        .sort((a, b) => a.year - b.year);
      const publicationsByYearMap = new Map<number, number>();
      pubs.forEach((p: any) => {
        const y = p.year;
        publicationsByYearMap.set(y, (publicationsByYearMap.get(y) || 0) + 1);
      });
      const publicationsByYear = Array.from(publicationsByYearMap.entries())
        .map(([year, count]) => ({ year, count }))
        .sort((a, b) => a.year - b.year);
      const citationsByTypeMap = new Map<string, number>();
      pubs.forEach((p: any) => {
        const t = p.type || 'other';
        citationsByTypeMap.set(t, (citationsByTypeMap.get(t) || 0) + p.citations);
      });
      const citationsByType = Array.from(citationsByTypeMap.entries()).map(([type, count]) => ({
        type,
        count,
      }));

      setStatistics({
        totalPublications,
        totalCitations,
        hIndex,
        i10Index,
        citationsByYear,
        publicationsByYear,
        citationsByType,
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string): boolean => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text);
        setShareMessage('ok');
        setTimeout(() => setShareMessage('idle'), 2500);
        return true;
      }
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      setShareMessage(ok ? 'ok' : 'error');
      setTimeout(() => setShareMessage('idle'), 2500);
      return ok;
    } catch {
      setShareMessage('error');
      setTimeout(() => setShareMessage('idle'), 2500);
      return false;
    }
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (!url) {
      setShareMessage('error');
      setTimeout(() => setShareMessage('idle'), 2500);
      return;
    }
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: profile?.name ?? 'Profil',
          text: profile?.title ?? '',
          url,
        });
        setShareMessage('ok');
        setTimeout(() => setShareMessage('idle'), 2500);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          copyToClipboard(url);
        }
      }
    } else {
      copyToClipboard(url);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#2563EB] border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profil topilmadi</h2>
          <Link href="/website">
            <Button variant="outline" className="border-[#2563EB] text-[#2563EB]">
              Asosiy sahifaga qaytish
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const metricCards = statistics
    ? [
        { title: 'Jami sitatalar', value: statistics.totalCitations, icon: TrendingUp, color: 'text-[#10b981]', bg: 'bg-[#10b981]/10' },
        { title: 'h-index', value: statistics.hIndex, icon: Award, color: 'text-[#8b5cf6]', bg: 'bg-[#8b5cf6]/10' },
        { title: 'i10-index', value: statistics.i10Index, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link
          href="/website/researchers"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#2563EB] mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Tadqiqotchilar roʻyxatiga qaytish
        </Link>

        {/* Profile header */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 border-gray-100 shrink-0"
                />
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-[#2563EB]/10 flex items-center justify-center text-4xl font-bold text-[#2563EB] shrink-0">
                  {profile.name?.charAt(0) ?? '?'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{profile.name}</h1>
                    <p className="text-lg text-[#2563EB] font-medium mt-1">{profile.title}</p>
                    <p className="text-gray-600 mt-2">{profile.affiliation}</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100 shrink-0 flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    {shareMessage === 'ok' ? 'Nusxalandi!' : shareMessage === 'error' ? 'Xatolik' : 'Profilni ulashish'}
                  </Button>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                  {profile.email && (
                    <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 hover:text-[#2563EB]">
                      <Mail className="h-4 w-4" />
                      Email
                    </a>
                  )}
                  {profile.contact?.website && (
                    <a
                      href={profile.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 hover:text-[#2563EB]"
                    >
                      <Globe className="h-4 w-4" />
                      Vebsayt
                    </a>
                  )}
                  {profile.contact?.googleScholar && (
                    <a
                      href={profile.contact.googleScholar}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 hover:text-[#2563EB]"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Google Scholar
                    </a>
                  )}
                </div>
                {profile.researchInterests?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.researchInterests.map((interest: string, i: number) => (
                      <span
                        key={i}
                        className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-lg"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Academic metrics */}
        {metricCards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {metricCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{card.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${card.bg}`}>
                      <Icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Biografiya</h2>
            <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* Publications */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#2563EB]" />
            Nashrlar
          </h2>
          <PublicPublicationList publications={publications} />
        </div>
      </div>
    </div>
  );
}
