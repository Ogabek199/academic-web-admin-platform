'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Calendar, Star, ExternalLink, Search, Eye } from 'lucide-react';
import { Publication } from '@/types';

export default function PublicationsPage() {
  const router = useRouter();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<'recent' | 'citations'>('recent');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/public/publications?sort=${sort}&limit=100`
        );
        const data = await res.json();
        setPublications(data.publications ?? []);
      } catch (error) {
        console.error('Error loading publications:', error);
        setPublications([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [sort]);

  const filtered = searchQuery.trim()
    ? publications.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.authors?.some((a) =>
            a.toLowerCase().includes(searchQuery.toLowerCase())
          ) ||
          p.journal?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(p.year).includes(searchQuery)
      )
    : publications;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Nashrlar
        </h1>
        <p className="mt-2 text-gray-600">
          Barcha ilmiy nashrlar — sarlavha, yil, jurnal va sitatalar
        </p>
      </div>

      {/* Search + sort */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sarlavha, muallif yoki jurnal boʻyicha qidirish..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] text-sm"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as 'recent' | 'citations')}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] shrink-0"
          >
            <option value="recent">Soʻnggi qoʻshilgan</option>
            <option value="citations">Sitatalar boʻyicha</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#2563EB] border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Nashrlar topilmadi</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{filtered.length} ta natija</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map((pub) => (
              <div
                key={pub.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-[#10b981]/30 transition-all duration-200 flex flex-col"
              >
                <h2 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                  {pub.title}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-1 mb-3">
                  {pub.authors?.join(', ')}
                </p>
                <div className="mt-auto flex items-center justify-between gap-2 flex-wrap">
                  <span className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4 shrink-0" />
                    {pub.year}
                    {pub.journal && (
                      <span className="text-gray-400 truncate max-w-[120px] sm:max-w-[200px]">
                        • {pub.journal}
                      </span>
                    )}
                  </span>
                  <span className="flex items-center gap-2 shrink-0">
                    {pub.citations > 0 && (
                      <span className="flex items-center gap-1 text-[#10b981] font-medium text-sm">
                        <Star className="h-4 w-4" />
                        {pub.citations}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => router.push(`/website/publications/${pub.id}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[#2563EB] hover:bg-[#2563EB]/10 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      Nashrni koʻrish
                    </button>
                    {pub.link && (
                      <a
                        href={pub.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2563EB] hover:text-[#1d4ed8] p-1.5 rounded-lg hover:bg-[#2563EB]/10 transition-colors"
                        aria-label="Tashqi havola"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
