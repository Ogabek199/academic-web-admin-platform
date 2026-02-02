'use client';

import { Statistics } from '@/types';
import { BookOpen, TrendingUp, Award, FileText } from 'lucide-react';

interface StatisticsCardsProps {
  statistics: Statistics;
}

export default function StatisticsCards({ statistics }: StatisticsCardsProps) {
  const cards = [
    {
      title: 'Jami nashrlar',
      value: statistics.totalPublications,
      icon: BookOpen,
      color: 'bg-[#2563EB]',
      bgLight: 'bg-blue-50',
      textColor: 'text-[#2563EB]',
    },
    {
      title: 'Jami sitatalar',
      value: statistics.totalCitations,
      icon: TrendingUp,
      color: 'bg-[#10b981]',
      bgLight: 'bg-emerald-50',
      textColor: 'text-[#10b981]',
    },
    {
      title: 'h-index',
      value: statistics.hIndex,
      icon: Award,
      color: 'bg-[#8b5cf6]',
      bgLight: 'bg-purple-50',
      textColor: 'text-[#8b5cf6]',
    },
    {
      title: 'i10-index',
      value: statistics.i10Index,
      icon: FileText,
      color: 'bg-amber-500',
      bgLight: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">
                  {card.value}
                </p>
              </div>
              <div className={`${card.bgLight} p-3 rounded-xl`}>
                <Icon className={`h-6 w-6 ${card.textColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
