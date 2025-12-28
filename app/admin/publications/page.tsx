'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { Publication } from '@/types';

export default function AdminPublicationsPage() {
  const router = useRouter();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
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

  useEffect(() => {
    loadPublications();
  }, []);

  const loadPublications = async () => {
    try {
      const response = await fetch('/api/admin/publications');
      const data = await response.json();
      setPublications(data.publications || []);
    } catch (error) {
      console.error('Error loading publications:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const publication: Publication = {
        id: formData.id || Date.now().toString(),
        title: formData.title || '',
        authors: formData.authors || [],
        journal: formData.journal,
        year: formData.year || new Date().getFullYear(),
        citations: formData.citations || 0,
        type: formData.type || 'article',
        doi: formData.doi,
        link: formData.link,
      };

      const response = await fetch('/api/admin/publications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(publication),
      });

      if (!response.ok) throw new Error('Saqlash xatolik');

      setShowForm(false);
      setFormData({
        title: '',
        authors: [],
        journal: '',
        year: new Date().getFullYear(),
        citations: 0,
        type: 'article',
        doi: '',
        link: '',
      });
      loadPublications();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu nashrni o\'chirishni xohlaysizmi?')) return;

    try {
      const response = await fetch('/api/admin/publications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('O\'chirish xatolik');
      loadPublications();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const addAuthor = () => {
    if (authorInput.trim()) {
      setFormData({
        ...formData,
        authors: [...(formData.authors || []), authorInput.trim()],
      });
      setAuthorInput('');
    }
  };

  const removeAuthor = (index: number) => {
    setFormData({
      ...formData,
      authors: formData.authors?.filter((_, i) => i !== index) || [],
    });
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nashrlar</h1>
          <p className="mt-2 text-gray-600">Ilmiy nashrlar ro&apos;yxati</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center justify-center">
          <Plus className="h-5 w-5 mr-2" />
          {showForm ? 'Bekor qilish' : 'Yangi nashr'}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Yangi nashr qo&apos;shish</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Sarlavha *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mualliflar</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={authorInput}
                  onChange={(e) => setAuthorInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAuthor())}
                  placeholder="Muallif ismini kiriting"
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <Button type="button" onClick={addAuthor}>Qo&apos;shish</Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.authors?.map((author, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {author}
                    <button
                      type="button"
                      onClick={() => removeAuthor(index)}
                      className="hover:text-gray-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Jurnal/Konferensiya"
                value={formData.journal}
                onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
              />
              <Input
                label="Yil"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Turi</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Publication['type'] })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="article">Maqola</option>
                  <option value="conference">Konferensiya</option>
                  <option value="book">Kitob</option>
                  <option value="thesis">Dissertatsiya</option>
                  <option value="other">Boshqa</option>
                </select>
              </div>
              <Input
                label="Sitatalar"
                type="number"
                value={formData.citations}
                onChange={(e) => setFormData({ ...formData, citations: parseInt(e.target.value) || 0 })}
                min="0"
              />
              <Input
                label="DOI"
                value={formData.doi}
                onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
              />
              <Input
                label="Havola"
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              />
            </div>
            <Button type="submit" disabled={loading} className="flex items-center justify-center">
              {loading ? 'Saqlanmoqda...' : 'Saqlash'}
            </Button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {publications.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">Hozircha nashrlar mavjud emas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Sarlavha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Mualliflar</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Jurnal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Yil</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Sitatalar</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Harakatlar</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {publications.map((pub) => (
                  <tr key={pub.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{pub.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{pub.authors.join(', ')}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{pub.journal || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{pub.year}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{pub.citations}</td>
                    <td className="px-6 py-4 text-sm">
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
        )}
      </div>
    </div>
  );
}

