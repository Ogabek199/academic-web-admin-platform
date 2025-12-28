'use client';

import { useState } from 'react';
import { Publication } from '@/types';
import { addPublication } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

export default function PublicationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Publication>>({
    title: '',
    authors: [],
    journal: '',
    year: new Date().getFullYear(),
    citations: 0,
    type: 'article',
    doi: '',
    link: '',
  });

  const [authorInput, setAuthorInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const publication: Publication = {
      id: Date.now().toString(),
      title: formData.title || '',
      authors: formData.authors || [],
      journal: formData.journal,
      year: formData.year || new Date().getFullYear(),
      citations: formData.citations || 0,
      type: formData.type || 'article',
      doi: formData.doi,
      link: formData.link,
    };
    addPublication(publication);
    alert('Nashr muvaffaqiyatli qo&apos;shildi!');
    router.push('/publications');
  };

  const handleAuthorAdd = () => {
    if (authorInput.trim()) {
      setFormData({
        ...formData,
        authors: [...(formData.authors || []), authorInput.trim()],
      });
      setAuthorInput('');
    }
  };

  const handleAuthorRemove = (index: number) => {
    setFormData({
      ...formData,
      authors: formData.authors?.filter((_, i) => i !== index) || [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Nashr ma&apos;lumotlari</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Sarlavha *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mualliflar</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={authorInput}
                onChange={(e) => setAuthorInput(e.target.value)}
                placeholder="Muallif ismini kiriting"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAuthorAdd())}
              />
              <button
                type="button"
                onClick={handleAuthorAdd}
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Qo&apos;shish
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.authors?.map((author, index) => (
                <span
                  key={index}
                  className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                >
                  {author}
                  <button
                    type="button"
                    onClick={() => handleAuthorRemove(index)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Jurnal/Konferensiya</label>
              <input
                type="text"
                value={formData.journal}
                onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Yil</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Turi</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Publication['type'] })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="article">Maqola</option>
                <option value="conference">Konferensiya</option>
                <option value="book">Kitob</option>
                <option value="thesis">Dissertatsiya</option>
                <option value="other">Boshqa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sitatalar</label>
              <input
                type="number"
                value={formData.citations}
                onChange={(e) => setFormData({ ...formData, citations: parseInt(e.target.value) || 0 })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">DOI</label>
              <input
                type="text"
                value={formData.doi}
                onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Havola</label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 md:w-auto"
      >
        <Plus className="h-5 w-5" />
        Nashrni qo&apos;shish
      </button>
    </form>
  );
}

