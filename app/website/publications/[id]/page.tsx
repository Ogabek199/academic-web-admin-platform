'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Star, ExternalLink, BookOpen } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Publication } from '@/types';

export default function PublicationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/public/publications?limit=500');
        const data = await res.json();
        const pubs: Publication[] = data.publications ?? [];
        const found = pubs.find((p) => p.id === id);
        setPublication(found ?? null);
      } catch (error) {
        console.error('Error loading publication:', error);
        setPublication(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

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

  if (!publication) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Nashr topilmadi</h2>
          <Link href="/website/publications">
            <Button variant="outline" className="border-[#2563EB] text-[#2563EB]">
              Nashrlar roʻyxatiga qaytish
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const typeLabels: Record<string, string> = {
    article: 'Maqola',
    conference: 'Konferensiya',
    book: 'Kitob',
    thesis: 'Dissertatsiya',
    other: 'Boshqa',
  };
  const typeLabel = typeLabels[publication.type] ?? publication.type;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link
          href="/website/publications"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#2563EB] mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Nashrlar roʻyxatiga qaytish
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <span className="inline-block px-3 py-1 rounded-lg bg-[#2563EB]/10 text-[#2563EB] text-sm font-medium mb-4">
              {typeLabel}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {publication.title}
            </h1>
            <p className="text-gray-600 mb-4">
              {publication.authors?.join(', ')}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              {publication.journal && (
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {publication.journal}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {publication.year}
              </span>
              {(publication.citations ?? 0) > 0 && (
                <span className="flex items-center gap-1 text-[#10b981] font-medium">
                  <Star className="h-4 w-4" />
                  {publication.citations} sitata
                </span>
              )}
            </div>
            {publication.link && (
              <a
                href={publication.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] text-white text-sm font-medium hover:bg-[#1d4ed8] transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Nashrni ochish (tashqi havola)
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
