'use client';

import PublicationForm from '@/components/PublicationForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewPublicationPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/publications"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Orqaga
      </Link>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Yangi nashr qo'shish</h1>
        <p className="mt-2 text-gray-600">
          Ilmiy nashr ma'lumotlarini kiriting
        </p>
      </div>
      <PublicationForm />
    </div>
  );
}

