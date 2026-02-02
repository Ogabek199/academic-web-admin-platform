'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Users,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Calendar,
  Star,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';

interface Profile {
  id: string;
  userId?: string;
  name: string;
  title: string;
  affiliation: string;
  photo?: string;
  researchInterests: string[];
}

interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal?: string;
  year: number;
  citations: number;
}

interface CarouselData {
  profiles: Profile[];
  recentPublications: Publication[];
  topPublications: Publication[];
  stats: {
    totalProfiles: number;
    totalPublications: number;
    totalCitations: number;
  };
}

type SuggestionItem = { type: 'profile'; label: string; href: string } | { type: 'publication'; label: string; href: string };

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [carouselData, setCarouselData] = useState<CarouselData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/public/carousel');
        const data = await res.json();
        setCarouselData(data);
      } catch (error) {
        console.error('Error loading carousel:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestions = useMemo((): SuggestionItem[] => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || !carouselData) return [];
    const list: SuggestionItem[] = [];
    (carouselData.profiles ?? []).forEach((p) => {
      if (
        p.name?.toLowerCase().includes(q) ||
        p.affiliation?.toLowerCase().includes(q) ||
        p.title?.toLowerCase().includes(q) ||
        (p.researchInterests ?? []).some((i) => i.toLowerCase().includes(q))
      ) {
        list.push({
          type: 'profile',
          label: `${p.name} — ${p.affiliation || p.title || ''}`,
          href: `/website/profile/${p.userId || p.id}`,
        });
      }
    });
    (carouselData.recentPublications ?? []).forEach((pub) => {
      if (
        pub.title?.toLowerCase().includes(q) ||
        (pub.authors ?? []).some((a) => a.toLowerCase().includes(q)) ||
        pub.journal?.toLowerCase().includes(q) ||
        String(pub.year).includes(q)
      ) {
        list.push({
          type: 'publication',
          label: `${pub.title?.slice(0, 50)}${(pub.title?.length ?? 0) > 50 ? '…' : ''} (${pub.year})`,
          href: `/website/publications/${pub.id}`,
        });
      }
    });
    return list.slice(0, 7);
  }, [searchQuery, carouselData]);

  const hasQuery = searchQuery.trim().length > 0;
  const showDropdown = showSuggestions && hasQuery;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    const q = searchQuery.trim();
    if (q) {
      router.push(`/website/researchers?q=${encodeURIComponent(q)}`);
    } else {
      router.push('/website/researchers');
    }
  };

  const onSelectSuggestion = (href: string) => {
    setShowSuggestions(false);
    setSearchQuery('');
    router.push(href);
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

  const stats = carouselData?.stats ?? {
    totalProfiles: 0,
    totalPublications: 0,
    totalCitations: 0,
  };
  const featuredProfiles = carouselData?.profiles ?? [];
  const recentPubs = carouselData?.recentPublications ?? [];

  return (
    <div className="bg-white">
      {/* Hero + Search */}
      <section className="relative bg-[#f8fafc] border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Tadqiqotchilar va ilmiy nashrlar
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Muallif, nashr yoki kalit soʻz boʻyicha qidiring — barcha maʼlumotlar bir joyda
            </p>
          </div>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3" ref={searchWrapRef}>
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => {
                    if (searchQuery.trim().length > 0) setShowSuggestions(true);
                  }}
                  placeholder="Muallif, nashr yoki kalit soʻz..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-colors text-base"
                  autoComplete="off"
                />
                {showDropdown && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl border border-gray-200 shadow-lg z-[100] overflow-hidden">
                    <div className="py-1 max-h-64 overflow-y-auto">
                      {!carouselData ? (
                        <div className="px-4 py-3 text-sm text-gray-500">Yuklanmoqda...</div>
                      ) : suggestions.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500">Tavsiyalar topilmadi. Enter bosing — tadqiqotchilar sahifasida qidiruv bajariladi.</div>
                      ) : (
                        suggestions.map((item, i) => (
                          <button
                            key={`${item.type}-${i}`}
                            type="button"
                            onClick={() => onSelectSuggestion(item.href)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700 transition-colors"
                          >
                            {item.type === 'profile' ? (
                              <Users className="h-4 w-4 text-[#2563EB] shrink-0" />
                            ) : (
                              <BookOpen className="h-4 w-4 text-[#10b981] shrink-0" />
                            )}
                            <span className="truncate">{item.label}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <Button
                type="submit"
                size="lg"
                className="bg-[#2563EB] hover:bg-[#1d4ed8] shrink-0 flex items-center justify-center gap-2"
              >
                <Search className="h-5 w-5" />
                Qidirish
              </Button>
            </div>
          </form>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/website/researchers">
              <Button variant="outline" size="md" className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB]/10">
                <Users className="h-4 w-4 mr-2" />
                Tadqiqotchilarni koʻrish
              </Button>
            </Link>
            <Link href="/website/publications">
              <Button variant="outline" size="md" className="border-[#10b981] text-[#10b981] hover:bg-[#10b981]/10">
                <BookOpen className="h-4 w-4 mr-2" />
                Nashrlar
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Overview stats */}
      <section className="py-10 sm:py-12 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#2563EB]/10">
                  <Users className="h-6 w-6 text-[#2563EB]" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalProfiles}</p>
                  <p className="text-sm text-gray-500">Tadqiqotchilar</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#10b981]/10">
                  <BookOpen className="h-6 w-6 text-[#10b981]" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalPublications}</p>
                  <p className="text-sm text-gray-500">Nashrlar</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#8b5cf6]/10">
                  <TrendingUp className="h-6 w-6 text-[#8b5cf6]" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalCitations}</p>
                  <p className="text-sm text-gray-500">Jami sitatalar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured researchers */}
      {featuredProfiles.length > 0 && (
        <section className="py-12 sm:py-16 bg-[#f8fafc] border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Taniqli tadqiqotchilar
              </h2>
              <Link
                href="/website/researchers"
                className="text-sm font-medium text-[#2563EB] hover:underline flex items-center gap-1"
              >
                Barchasi <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProfiles.slice(0, 6).map((profile) => (
                <Link
                  key={profile.id}
                  href={`/website/profile/${profile.userId || profile.id}`}
                  className="block bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-[#2563EB]/30 transition-all duration-200 h-full"
                >
                  <div className="flex flex-col items-center text-center">
                    {profile.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        loading='lazy'
                        src={profile.photo}
                        alt={profile.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-100 mb-3"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-[#2563EB]/10 flex items-center justify-center text-2xl font-bold text-[#2563EB] mb-3">
                        {profile.name.charAt(0)}
                      </div>
                    )}
                    <h3 className="font-semibold text-gray-900">{profile.name}</h3>
                    <p className="text-sm text-[#2563EB] font-medium mt-0.5">{profile.title}</p>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{profile.affiliation}</p>
                    {profile.researchInterests?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
                        {profile.researchInterests.slice(0, 2).map((interest, i) => (
                          <span
                            key={i}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest publications */}
      {recentPubs.length > 0 && (
        <section className="py-12 sm:py-16 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Soʻnggi nashrlar
              </h2>
              <Link
                href="/website/publications"
                className="text-sm font-medium text-[#2563EB] hover:underline flex items-center gap-1"
              >
                Barchasi <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPubs.slice(0, 6).map((pub) => (
                <div
                  key={pub.id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-[#10b981]/30 transition-all duration-200 h-full flex flex-col"
                >
                  <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{pub.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{pub.authors?.join(', ')}</p>
                  <div className="mt-auto pt-4 flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> {pub.year}
                    </span>
                    {pub.citations > 0 && (
                      <span className="flex items-center gap-1 text-[#10b981] font-medium">
                        <Star className="h-4 w-4" /> {pub.citations}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12 sm:py-16 border-t border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Tadqiqotchilarni qidiring yoki nashrlar bilan tanishing
          </h2>
          <p className="text-gray-600 mb-8">
            Platforma haqida batafsil maʼlumot va savol-javoblar uchun quyidagi sahifalardan foydalaning.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/website/researchers">
              <Button size="lg" className="bg-[#2563EB] hover:bg-[#1d4ed8] flex items-center gap-2">
                <Users className="h-5 w-5" />
                Tadqiqotchilarni koʻrish
              </Button>
            </Link>
            <Link href="/website/publications">
              <Button variant="outline" size="lg" className="border-[#10b981] text-[#10b981] hover:bg-[#10b981]/10 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Nashrlar
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                Platforma haqida
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
