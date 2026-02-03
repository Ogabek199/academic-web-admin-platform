'use client';

import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Plus, Trash2, ExternalLink, Search, Upload, FileText } from 'lucide-react';
import { Publication } from '@/types';

export default function AdminPublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<Partial<Publication>>({
    title: '',
    authors: [],
    journal: '',
    year: new Date().getFullYear(),
    citations: 0,
    type: 'article',
    doi: '',
    link: '',
    fileUrl: '',
  });
  const [authorInput, setAuthorInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

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
    setUploadError(null);

    try {
      let fileUrl = formData.fileUrl || '';

      if (file) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('type', 'publication');

        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          const err = await uploadRes.json();
          throw new Error(err.error || 'Fayl yuklash xatolik');
        }

        const { url } = await uploadRes.json();
        fileUrl = url;
      }

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
        fileUrl: fileUrl || undefined,
      };

      const response = await fetch('/api/admin/publications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(publication),
      });

      if (!response.ok) throw new Error('Saqlash xatolik');

      setShowForm(false);
      setFile(null);
      setFormData({
        title: '',
        authors: [],
        journal: '',
        year: new Date().getFullYear(),
        citations: 0,
        type: 'article',
        doi: '',
        link: '',
        fileUrl: '',
      });
      loadPublications();
    } catch (error: any) {
      setUploadError(error.message);
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

  const filteredPublications = useMemo(() => {
    if (!searchQuery.trim()) return publications;
    const q = searchQuery.toLowerCase();
    return publications.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.authors?.some((a) => a.toLowerCase().includes(q)) ||
        p.journal?.toLowerCase().includes(q) ||
        String(p.year).includes(q)
    );
  }, [publications, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Nashrlar</h1>
          <p className="mt-2 text-gray-600">Ilmiy nashrlar ro&apos;yxati — qo&apos;shish, tahrirlash, o&apos;chirish</p>
        </div>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) setFile(null);
          }}
          className="flex items-center justify-center bg-[#2563EB] hover:bg-[#1d4ed8] shrink-0"
        >
          <Plus className="h-5 w-5 mr-2" />
          {showForm ? 'Bekor qilish' : 'Yangi nashr'}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Yangi nashr qo&apos;shish</h2>
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
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nashr fayli (PDF va boshqalar)</label>
              <p className="text-xs text-gray-500 mb-2">O&apos;z nashringizni yuklang — fayl saqlanadi va tashrif buyuruvchilar yuklab olishi mumkin</p>
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 cursor-pointer hover:bg-gray-50 focus:ring-2 focus:ring-[#2563EB]/20">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm font-medium">Fayl tanlash</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="sr-only"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      setFile(f || null);
                      setUploadError(null);
                    }}
                  />
                </label>
                {file && (
                  <span className="inline-flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
                    <FileText className="h-4 w-4" />
                    {file.name}
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-gray-500 hover:text-red-600"
                      aria-label="Olib tashlash"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
              {uploadError && <p className="mt-1.5 text-sm text-red-600">{uploadError}</p>}
            </div>
            <Button type="submit" disabled={loading} className="flex items-center justify-center bg-[#2563EB] hover:bg-[#1d4ed8]">
              {loading ? 'Saqlanmoqda...' : 'Saqlash'}
            </Button>
          </form>
        </div>
      )}

      {publications.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Sarlavha, muallif, jurnal yoki yil bo&apos;yicha qidirish..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none text-sm"
          />
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredPublications.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">
              {publications.length === 0
                ? 'Hozircha nashrlar mavjud emas'
                : 'Qidiruv bo\'yicha natija topilmadi'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop: jadval */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Sarlavha</th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Mualliflar</th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Jurnal</th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Yil</th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Sitatalar</th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Harakatlar</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPublications.map((pub) => (
                    <tr key={pub.id} className="hover:bg-gray-50">
                      <td className="px-4 lg:px-6 py-4 text-sm font-medium text-gray-900">{pub.title}</td>
                      <td className="px-4 lg:px-6 py-4 text-sm text-gray-600">{pub.authors?.join(', ') || '-'}</td>
                      <td className="px-4 lg:px-6 py-4 text-sm text-gray-600">{pub.journal || '-'}</td>
                      <td className="px-4 lg:px-6 py-4 text-sm text-gray-600">{pub.year}</td>
                      <td className="px-4 lg:px-6 py-4 text-sm font-medium text-gray-900">{pub.citations ?? 0}</td>
                      <td className="px-4 lg:px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          {pub.fileUrl && (
                            <a
                              href={pub.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#2563EB] hover:text-[#1d4ed8]"
                              title="Nashr faylini yuklab olish"
                            >
                              <FileText className="h-4 w-4" />
                            </a>
                          )}
                          {pub.link && (
                            <a
                              href={pub.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#2563EB] hover:text-[#1d4ed8]"
                              title="Havola"
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

            {/* Mobil: kartochkalar */}
            <div className="md:hidden divide-y divide-gray-200">
              {filteredPublications.map((pub) => (
                <div key={pub.id} className="p-4 hover:bg-gray-50">
                  <p className="font-medium text-gray-900 text-sm line-clamp-2">{pub.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{pub.authors?.join(', ')} • {pub.journal || '-'} • {pub.year}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-medium text-[#2563EB]">{pub.citations ?? 0} sitata</span>
                    <div className="flex items-center gap-2">
                      {pub.fileUrl && (
                        <a href={pub.fileUrl} target="_blank" rel="noopener noreferrer" className="text-[#2563EB]" title="Nashr fayli">
                          <FileText className="h-4 w-4" />
                        </a>
                      )}
                      {pub.link && (
                        <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-[#2563EB]">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <button onClick={() => handleDelete(pub.id)} className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

