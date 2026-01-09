'use client';

import { useEffect, useState } from 'react';
import { getPublicationsByUserId } from '@/lib/backend/db';
import StatisticsCards from '@/components/admin/StatisticsCards';
import Charts from '@/components/admin/Charts';
import { Statistics } from '@/types';

export default function AdminStatisticsPage() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [publications, setPublications] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userRes, pubRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/admin/publications'),
      ]);

      const userData = await userRes.json();
      const pubData = await pubRes.json();

      const pubs = pubData.publications || [];
      setPublications(pubs);

      // Calculate statistics
      const totalPublications = pubs.length;
      const totalCitations = pubs.reduce((sum: number, p: any) => sum + (p.citations || 0), 0);
      
      const sortedByCitations = [...pubs].sort((a, b) => b.citations - a.citations);
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
      console.error('Error loading statistics:', error);
    }
  };

  if (!statistics) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Statistika</h1>
        <p className="mt-2 text-gray-600">Nashrlar va sitatalar bo&apos;yicha batafsil statistika</p>
      </div>

      <StatisticsCards statistics={statistics} />
      <Charts statistics={statistics} />
    </div>
  );
}

