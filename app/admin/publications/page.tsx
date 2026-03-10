'use client';

import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Plus, Trash2, ExternalLink, Search, Upload, FileText, X } from 'lucide-react';
import { Publication } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

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
          throw new Error(err.error || 'Fayl yuklashda xatolik yuz berdi');
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

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Saqlashda xatolik yuz berdi');
      }

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
      toast.success('Nashr muvaffaqiyatli saqlandi!');
    } catch (error: any) {
      setUploadError(error.message);
      toast.error(error.message || 'Xatolik yuz berdi');
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

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'O\'chirishda xatolik yuz berdi');
      }
      toast.success('Nashr o\'chirildi');
      loadPublications();
    } catch (error: any) {
      toast.error(error.message || 'O\'chirishda xatolik yuz berdi');
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header section with Stats background */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Nashrlar boshqaruvi</h1>
          <p className="mt-1 text-slate-500 font-medium font-inter">Ilmiy ishlaringizning to'liq ro'yxati va tahriri</p>
        </div>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) setFile(null);
          }}
          variant={showForm ? "ghost" : "primary"}
          className={`h-12 px-6 rounded-2xl font-bold transition-all duration-300 shadow-lg ${
            showForm 
            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 shadow-rose-100 border border-rose-200' 
            : 'bg-primary text-white shadow-primary/20'
          }`}
        >
          {showForm ? <X className="h-5 w-5 mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
          {showForm ? 'Bekor qilish' : 'Yangi nashr'}
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-8 mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Yangi ilmiy ish tafsilotlari
              </h2>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 gap-8">
                  <Input
                    label="Nashr sarlavhasi *"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="h-12 rounded-xl"
                  />
                  
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700">Mualliflar ro'yxati</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={authorInput}
                        onChange={(e) => setAuthorInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAuthor())}
                        placeholder="Muallif ismini kiriting..."
                        className="flex-1 h-12 px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium"
                      />
                      <Button type="button" onClick={addAuthor} variant="outline" className="h-12 rounded-xl border-slate-200 font-bold hover:bg-slate-50">
                        Qo'shish
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {formData.authors?.map((author, index) => (
                        <motion.span
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          key={index}
                          className="inline-flex items-center gap-2 bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold border border-slate-100 group"
                        >
                          {author}
                          <button
                            type="button"
                            onClick={() => removeAuthor(index)}
                            className="text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input
                    label="Nashr qilingan joy / Jurnal"
                    value={formData.journal}
                    onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                  />
                  <Input
                    label="Nashr yili"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  />
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Turkum</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as Publication['type'] })}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold appearance-none bg-no-repeat bg-[right_1rem_center] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')]"
                    >
                      <option value="article">Maqola</option>
                      <option value="conference">Konferensiya</option>
                      <option value="book">Kitob</option>
                      <option value="thesis">Dissertatsiya</option>
                      <option value="other">Boshqa</option>
                    </select>
                  </div>
                  <Input
                    label="Sitatalar soni"
                    type="number"
                    value={formData.citations}
                    onChange={(e) => setFormData({ ...formData, citations: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                  <Input
                    label="DOI indentifikatori"
                    value={formData.doi}
                    onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                  />
                  <Input
                    label="Onlayn havola"
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  />
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-sm font-bold text-slate-700 mb-3">Nashr PDF fayli</label>
                  <div className="flex flex-wrap items-center gap-6">
                    <label className="relative flex items-center gap-3 px-6 py-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-primary/40 cursor-pointer transition-all group">
                      <div className="p-2 bg-white rounded-lg shadow-sm text-primary transition-transform group-hover:scale-110">
                        <Upload className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-bold text-slate-600">Fayl tanlash (PDF, DOCX)</span>
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
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 bg-primary/5 text-primary px-5 py-4 rounded-2xl border border-primary/10"
                      >
                        <FileText className="h-5 w-5" />
                        <span className="text-sm font-bold truncate max-w-[200px]">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className="ml-2 hover:text-rose-500 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </motion.div>
                    )}
                  </div>
                  {uploadError && <p className="mt-3 text-sm font-bold text-rose-500 flex items-center gap-2">
                    <X className="h-4 w-4" />
                    {uploadError}
                  </p>}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                   <Button 
                    type="submit" 
                    disabled={loading} 
                    className="h-14 px-10 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    {loading ? (
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : 'Nashrni saqlash'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/30">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Qidirish (sarlavha, muallif, yil)..."
              className="w-full pl-12 pr-4 h-12 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-medium"
            />
          </div>
          <div className="text-sm font-bold text-slate-400">
            Jami: <span className="text-slate-900">{filteredPublications.length} ta</span>
          </div>
        </div>

        {filteredPublications.length === 0 ? (
          <div className="p-20 text-center">
            <div className="mb-6 inline-flex p-6 bg-slate-50 rounded-full text-slate-300">
               <FileText className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Nashrlar topilmadi</h3>
            <p className="text-slate-400 mt-2 font-medium">Hozircha hech qanday nashr qo'shilmagan yoki qidiruv natijasiz.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">Tafsilotlar</th>
                  <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 hidden lg:table-cell">Tur / Yil</th>
                  <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 text-center">Sitatalar</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredPublications.map((pub, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={pub.id} 
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-900 leading-snug line-clamp-2 transition-colors group-hover:text-primary">{pub.title}</span>
                        <span className="text-sm font-medium text-slate-400">{pub.authors?.join(', ') || '-'}</span>
                        <span className="text-xs font-bold text-slate-300 italic">{pub.journal || ''}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 hidden lg:table-cell">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 w-fit">
                          {getTypeLabel(pub.type)}
                        </span>
                        <span className="text-sm font-bold text-slate-400 mt-1">{pub.year}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/5 text-primary font-black text-sm border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        {pub.citations ?? 0}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {pub.fileUrl && (
                          <a href={pub.fileUrl} target="_blank" className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                            <FileText className="h-5 w-5" />
                          </a>
                        )}
                        {pub.link && (
                          <a href={pub.link} target="_blank" className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                            <ExternalLink className="h-5 w-5" />
                          </a>
                        )}
                        <button 
                          onClick={() => handleDelete(pub.id)}
                          className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

