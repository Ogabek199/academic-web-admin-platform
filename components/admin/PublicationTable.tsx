'use client';

import { Publication } from '@/types';
import { ExternalLink, Trash2 } from 'lucide-react';
import { deletePublication } from '@/lib/backend/db/data';
import { useRouter } from 'next/navigation';

interface PublicationTableProps {
  publications: Publication[];
}

export default function PublicationTable({ publications }: PublicationTableProps) {
  const router = useRouter();

  const handleDelete = (id: string) => {
    if (confirm('Bu nashrni o&apos;chirishni xohlaysizmi?')) {
      deletePublication(id);
      router.refresh();
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      article: 'Maqola',
      conference: 'Konferensiya',
      book: 'Kitob',
      thesis: 'Dissertatsiya',
      other: 'Boshqa',
    };
    return labels[type] || type;
  };

  if (publications.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <p className="text-gray-500">Hozircha nashrlar mavjud emas</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Sarlavha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Mualliflar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Jurnal/Konferensiya
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Yil
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Turi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Sitatalar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Harakatlar
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {publications.map((pub) => (
              <tr key={pub.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{pub.title}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">{pub.authors.join(', ')}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">{pub.journal || '-'}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">{pub.year}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                    {getTypeLabel(pub.type)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{pub.citations}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {pub.link && (
                      <a
                        href={pub.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(pub.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

