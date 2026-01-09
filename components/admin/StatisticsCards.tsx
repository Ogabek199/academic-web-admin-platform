'use client';

import { Statistics } from '@/types';
import { BookOpen, TrendingUp, Award, FileText } from 'lucide-react';

interface StatisticsCardsProps {
  statistics: Statistics;
}

export default function StatisticsCards({ statistics }: StatisticsCardsProps) {
  const cards = [
    {
      title: 'Jami Nashrlar',
      value: statistics.totalPublications,
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    {
      title: 'Jami Sitatalar',
      value: statistics.totalCitations,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'h-index',
      value: statistics.hIndex,
      icon: Award,
      color: 'bg-purple-500',
    },
    {
      title: 'i10-index',
      value: statistics.i10Index,
      icon: FileText,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`rounded-full ${card.color} p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

