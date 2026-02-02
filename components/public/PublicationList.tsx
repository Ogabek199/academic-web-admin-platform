'use client';

import { Publication } from '@/types';
import { ExternalLink } from 'lucide-react';

interface PublicationListProps {
  publications: Publication[];
}

export default function PublicationList({ publications }: PublicationListProps) {
  if (publications.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500">Hozircha nashrlar mavjud emas</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Sarlavha
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Mualliflar
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Jurnal / Konferensiya
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Yil
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Sitatalar
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 w-10">
                {' '}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {publications.map((pub) => (
              <tr key={pub.id} className="hover:bg-gray-50">
                <td className="px-4 lg:px-6 py-4 text-sm font-medium text-gray-900">
                  {pub.title}
                </td>
                <td className="px-4 lg:px-6 py-4 text-sm text-gray-600">
                  {pub.authors?.join(', ') ?? '-'}
                </td>
                <td className="px-4 lg:px-6 py-4 text-sm text-gray-600">
                  {pub.journal ?? '-'}
                </td>
                <td className="px-4 lg:px-6 py-4 text-sm text-gray-600">
                  {pub.year}
                </td>
                <td className="px-4 lg:px-6 py-4 text-sm font-medium text-[#10b981]">
                  {pub.citations ?? 0}
                </td>
                <td className="px-4 lg:px-6 py-4 text-sm">
                  {pub.link && (
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2563EB] hover:text-[#1d4ed8]"
                      aria-label="Havolani ochish"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile card layout */}
      <div className="lg:hidden divide-y divide-gray-200">
        {publications.map((pub) => (
          <div key={pub.id} className="p-4 hover:bg-gray-50">
            <p className="font-medium text-gray-900 text-sm line-clamp-2">{pub.title}</p>
            <p className="text-xs text-gray-500 mt-1">{pub.authors?.join(', ')}</p>
            <p className="text-xs text-gray-500 mt-0.5">{pub.journal ?? '-'} • {pub.year}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-medium text-[#10b981]">{pub.citations ?? 0} sitata</span>
              {pub.link && (
                <a
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2563EB] text-sm font-medium"
                >
                  Havola <ExternalLink className="h-3 w-3 inline" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
