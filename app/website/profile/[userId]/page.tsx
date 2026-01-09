'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Globe, ExternalLink, BookOpen, TrendingUp } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import PublicationTable from '@/components/admin/PublicationTable';
import StatisticsCards from '@/components/admin/StatisticsCards';
import Charts from '@/components/admin/Charts';
import { Statistics } from '@/types';
import PublicNavigation from '@/shared/components/PublicNavigation';

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const [profile, setProfile] = useState<any>(null);
  const [publications, setPublications] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadProfile();
    }
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
      setPublications(data.publications || []);

      // Calculate statistics
      const pubs = data.publications || [];
      const totalPublications = pubs.length;
      const totalCitations = pubs.reduce((sum: number, p: any) => sum + (p.citations || 0), 0);
      
      const sortedByCitations = [...pubs].sort((a: any, b: any) => b.citations - a.citations);
      let hIndex = 0;
      for (let i = 0; i < sortedByCitations.length; i++) {
        if (sortedByCitations[i].citations >= i + 1) {
          hIndex = i + 1;
        } else {
          break;
        }
      }
      
      const i10Index = pubs.filter((p: any) => p.citations >= 10).length;
      
      const citationsByYearMap = new Map<number, number>();
      pubs.forEach((pub: any) => {
        const year = pub.year;
        citationsByYearMap.set(year, (citationsByYearMap.get(year) || 0) + pub.citations);
      });
      const citationsByYear = Array.from(citationsByYearMap.entries())
        .map(([year, citations]) => ({ year, citations }))
        .sort((a, b) => a.year - b.year);
      
      const publicationsByYearMap = new Map<number, number>();
      pubs.forEach((pub: any) => {
        const year = pub.year;
        publicationsByYearMap.set(year, (publicationsByYearMap.get(year) || 0) + 1);
      });
      const publicationsByYear = Array.from(publicationsByYearMap.entries())
        .map(([year, count]) => ({ year, count }))
        .sort((a, b) => a.year - b.year);
      
      const citationsByTypeMap = new Map<string, number>();
      pubs.forEach((pub: any) => {
        const type = pub.type;
        citationsByTypeMap.set(type, (citationsByTypeMap.get(type) || 0) + pub.citations);
      });
      const citationsByType = Array.from(citationsByTypeMap.entries())
        .map(([type, count]) => ({ type, count }));

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profil topilmadi</h2>
          <Link href="/">
            <Button>Asosiy sahifaga qaytish</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Orqaga
        </Link>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12">
            <div className="flex items-start space-x-6">
              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-xl"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white bg-white flex items-center justify-center text-4xl font-bold text-blue-600 shadow-xl">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 text-white">
                <h1 className="text-4xl font-bold mb-2">{profile.name}</h1>
                <p className="text-xl text-blue-100 mb-2">{profile.title}</p>
                <p className="text-lg text-blue-100">{profile.affiliation}</p>
                <div className="mt-6 flex flex-wrap gap-4">
                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex items-center space-x-2 text-sm text-blue-100 hover:text-white transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </a>
                  )}
                  {profile.contact?.website && (
                    <a
                      href={profile.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-sm text-blue-100 hover:text-white transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Website</span>
                    </a>
                  )}
                  {profile.contact?.googleScholar && (
                    <a
                      href={profile.contact.googleScholar}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-sm text-blue-100 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Google Scholar</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-8">
            {profile.bio && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Biografiya</h2>
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {profile.researchInterests && profile.researchInterests.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Tadqiqot sohalari</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.researchInterests.map((interest: string, index: number) => (
                    <span
                      key={index}
                      className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile.education && profile.education.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Ta&apos;lim</h2>
                <div className="space-y-3">
                  {profile.education.map((edu: any, index: number) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <p className="font-semibold text-gray-900">{edu.degree}</p>
                      <p className="text-gray-600">{edu.institution}</p>
                      <p className="text-sm text-gray-500">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        {statistics && (
          <div className="mb-8">
            <StatisticsCards statistics={statistics} />
          </div>
        )}

        {/* Publications */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Nashrlar</h2>
          <PublicationTable publications={publications} />
        </div>

        {/* Charts */}
        {statistics && (
          <div>
            <Charts statistics={statistics} />
          </div>
        )}
      </div>
    </div>
  );
}

