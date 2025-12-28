'use client';

import { useEffect, useState } from 'react';
import { getStatistics } from '@/lib/data';
import { Statistics } from '@/types';
import StatisticsCards from '@/components/StatisticsCards';
import Charts from '@/components/Charts';

export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);

  useEffect(() => {
    const loadData = () => {
      setStatistics(getStatistics());
    };
    loadData();
  }, []);

  if (!statistics) {
    return (
      <div className="text-center">
        <p className="text-gray-500">Statistika ma&apos;lumotlari mavjud emas</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Statistika</h1>
        <p className="mt-2 text-gray-600">
          Nashrlar va sitatalar bo&apos;yicha batafsil statistika
        </p>
      </div>

      <StatisticsCards statistics={statistics} />
      <Charts statistics={statistics} />
    </div>
  );
}

