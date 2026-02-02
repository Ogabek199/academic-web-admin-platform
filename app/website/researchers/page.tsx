'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Users, Filter, ArrowRight } from 'lucide-react';
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

function ResearchersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get('q') ?? '';
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState(q);
  const [filterInstitution, setFilterInstitution] = useState('');
  const [filterField, setFilterField] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSearchQuery(q);
  }, [q]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const url = searchQuery.trim()
          ? `/api/public/profiles?q=${encodeURIComponent(searchQuery.trim())}`
          : '/api/public/profiles';
        const res = await fetch(url);
        const data = await res.json();
        setProfiles(data.profiles ?? []);
      } catch (error) {
        console.error('Error loading profiles:', error);
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [searchQuery]);

  const institutions = useMemo(() => {
    const set = new Set<string>();
    profiles.forEach((p) => {
      if (p.affiliation?.trim()) set.add(p.affiliation.trim());
    });
    return Array.from(set).sort();
  }, [profiles]);

  const fields = useMemo(() => {
    const set = new Set<string>();
    profiles.forEach((p) => {
      (p.researchInterests ?? []).forEach((i) => i?.trim() && set.add(i.trim()));
    });
    return Array.from(set).sort();
  }, [profiles]);

  const filteredProfiles = useMemo(() => {
    let list = profiles;
    if (filterInstitution) {
      list = list.filter((p) => p.affiliation?.trim() === filterInstitution);
    }
    if (filterField) {
      list = list.filter((p) =>
        (p.researchInterests ?? []).some((i) => i?.trim() === filterField)
      );
    }
    return list;
  }, [profiles, filterInstitution, filterField]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    router.push(`/website/researchers?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Tadqiqotchilar
        </h1>
        <p className="mt-2 text-gray-600">
          Muallif, muassasa yoki tadqiqot sohasi boʻyicha qidiring
        </p>
      </div>

      {/* Search + filters */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ism, muassasa yoki soha..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] text-sm"
            />
          </div>
          <Button type="submit" className="bg-[#2563EB] hover:bg-[#1d4ed8] shrink-0 flex items-center gap-2">
            <Search className="h-4 w-4" />
            Qidirish
          </Button>
        </form>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filtr:
          </span>
          <select
            value={filterInstitution}
            onChange={(e) => setFilterInstitution(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          >
            <option value="">Barcha muassasalar</option>
            {institutions.map((inst) => (
              <option key={inst} value={inst}>
                {inst}
              </option>
            ))}
          </select>
          <select
            value={filterField}
            onChange={(e) => setFilterField(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          >
            <option value="">Barcha sohalar</option>
            {fields.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          {(filterInstitution || filterField) && (
            <button
              type="button"
              onClick={() => {
                setFilterInstitution('');
                setFilterField('');
              }}
              className="text-sm text-[#2563EB] hover:underline"
            >
              Filterni tozalash
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#2563EB] border-t-transparent" />
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Tadqiqotchilar topilmadi</p>
          <p className="text-sm text-gray-400 mt-2">
            Boshqa qidiruv soʻzi yoki filterni sinab koʻring
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            {filteredProfiles.length} ta natija
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <Link
                key={profile.id}
                href={`/website/profile/${profile.userId || profile.id}`}
                className="block bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-[#2563EB]/30 transition-all duration-200 h-full group"
              >
                <div className="flex items-start gap-4">
                  {profile.photo ? (
                    <img
                      src={profile.photo}
                      alt={profile.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[#2563EB]/10 flex items-center justify-center text-xl font-bold text-[#2563EB] shrink-0">
                      {profile.name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-gray-900 truncate">{profile.name}</h2>
                    <p className="text-sm text-[#2563EB] font-medium mt-0.5 truncate">{profile.title}</p>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{profile.affiliation}</p>
                    {profile.researchInterests?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {profile.researchInterests.slice(0, 2).map((interest, i) => (
                          <span
                            key={i}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-[#2563EB] shrink-0 mt-1 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ResearchersPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#2563EB] border-t-transparent" />
        </div>
      }
    >
      <ResearchersContent />
    </Suspense>
  );
}
