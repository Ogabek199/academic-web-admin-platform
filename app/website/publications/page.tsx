'use client';

import { useEffect, useState } from 'react';
import { getPublications } from '@/lib/backend/db/data';
import { Publication } from '@/types';
import PublicationTable from '@/components/admin/PublicationTable';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);

  useEffect(() => {
    const loadData = () => {
      setPublications(getPublications());
    };
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nashrlar</h1>
          <p className="mt-2 text-gray-600">
            Barcha ilmiy nashrlar va maqolalar ro&apos;yxati
          </p>
        </div>
        <Link
          href="/website/publications/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Yangi nashr
        </Link>
      </div>

      <PublicationTable publications={publications} />
    </div>
  );
}

