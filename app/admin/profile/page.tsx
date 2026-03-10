'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { Save, Upload, X, User, Plus, Trash2 } from 'lucide-react';
import { Profile } from '@/types';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function AdminProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({
    name: '',
    title: '',
    affiliation: '',
    email: '',
    bio: '',
    researchInterests: [],
    education: [],
    contact: {},
  });
  const [interestInput, setInterestInput] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/admin/profile');
      const data = await response.json();
      if (data.profile) {
        setFormData(data.profile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Faqat rasm fayllari yuklash mumkin');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Rasm hajmi 5MB dan katta bo\'lmasligi kerak');
      return;
    }

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Yuklash xatolik');
      }

      if (data.success && data.url) {
        setFormData(prev => ({ ...prev, photo: data.url }));
        toast.success('Rasm muvaffaqiyatli yuklandi!');
      } else {
        throw new Error('Yuklashda xatolik yuz berdi');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Rasm yuklashda xatolik yuz berdi');
    } finally {
      setUploading(false);
      const input = document.getElementById('photo-upload-input') as HTMLInputElement;
      if (input) input.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const profile: Profile = {
        id: formData.id || '1',
        name: formData.name || '',
        title: formData.title || '',
        affiliation: formData.affiliation || '',
        email: formData.email || '',
        bio: formData.bio || '',
        researchInterests: formData.researchInterests || [],
        education: formData.education || [],
        contact: formData.contact || {},
        photo: formData.photo,
      };

      const response = await fetch('/api/admin/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (!response.ok) throw new Error('Saqlashda xatolik yuz berdi');

      toast.success('Profil muvaffaqiyatli saqlandi!');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const addInterest = () => {
    if (interestInput.trim()) {
      setFormData({
        ...formData,
        researchInterests: [...(formData.researchInterests || []), interestInput.trim()],
      });
      setInterestInput('');
    }
  };

  const removeInterest = (index: number) => {
    setFormData({
      ...formData,
      researchInterests: formData.researchInterests?.filter((_, i) => i !== index) || [],
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...(formData.education || []),
        { degree: '', institution: '', year: '', field: '' },
      ],
    });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const newEducation = [...(formData.education || [])];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setFormData({ ...formData, education: newEducation });
  };

  const removeEducation = (index: number) => {
    setFormData({
      ...formData,
      education: formData.education?.filter((_, i) => i !== index) || [],
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Profilni boshqarish</h1>
          <p className="mt-1 text-slate-500 font-medium font-inter">Shaxsiy brendingiz va akademik ma'lumotlaringiz</p>
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={loading}
          className="h-12 px-8 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Save className="h-5 w-5 mr-2" />
          {loading ? 'Saqlanmoqda...' : 'O\'zgarishlarni saqlash'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Basic Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-3xl border border-slate-200/60 p-8 shadow-sm text-center">
            <div className="relative inline-block group">
              {formData.photo ? (
                <div className="relative h-48 w-48 mx-auto rounded-full p-2 border-2 border-primary/20 bg-slate-50">
                   <img
                    src={formData.photo}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover shadow-inner"
                  />
                </div>
              ) : (
                <div className="w-48 h-48 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center mx-auto transition-colors group-hover:border-primary/40">
                  <User className="h-16 w-16 text-slate-300" />
                </div>
              )}
              
              <label htmlFor="photo-upload-input" className="absolute bottom-2 right-2 cursor-pointer group">
                <input
                  id="photo-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <div className="h-12 w-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 transform transition-transform group-hover:scale-110 active:scale-95 duration-200">
                  <Upload className="h-5 w-5" />
                </div>
              </label>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-bold text-slate-900">{formData.name || 'Ismingiz'}</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">{formData.title || 'Lavozimingiz'}</p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/20">
            <h3 className="text-lg font-bold mb-4">Eslatma</h3>
            <p className="text-sm text-slate-300 font-medium leading-relaxed">
              Bu yerda kiritilgan barcha ma'lumotlar UzScholar platformasidagi shaxsiy sahifangizda barcha uchun ochiq ko'rinadi.
            </p>
          </div>
        </div>

        {/* Right Column: Detailed Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Section */}
          <section className="bg-white rounded-3xl border border-slate-200/60 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h2 className="text-xl font-bold text-slate-900 mb-8 border-l-4 border-primary pl-4">Asosiy ma'lumotlar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="To'liq ism-sharif *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="h-12 rounded-xl"
              />
              <Input
                label="Ilmiy daraja / Lavozim"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="h-12 rounded-xl"
              />
              <Input
                label="Ish joyi (Affiliation)"
                value={formData.affiliation}
                onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                className="h-12 rounded-xl"
              />
              <Input
                label="Email manzili"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12 rounded-xl"
              />
            </div>
            <div className="mt-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Qisqacha biografiya</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-slate-600"
                placeholder="O'zingiz haqingizda qisqacha ma'lumot..."
              />
            </div>
          </section>

          {/* Research Interests */}
          <section className="bg-white rounded-3xl border border-slate-200/60 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h2 className="text-xl font-bold text-slate-900 mb-8 border-l-4 border-primary pl-4">Tadqiqot sohalari</h2>
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                placeholder="Masalan: Mashinali o'qitish..."
                className="flex-1 h-12 px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium"
              />
              <Button type="button" onClick={addInterest} className="h-12 px-6 rounded-xl font-bold bg-primary">Qo'shish</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              {formData.researchInterests?.map((interest, index) => (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key={index}
                  className="inline-flex items-center gap-2 bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold border border-slate-100"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeInterest(index)}
                    className="text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.span>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="bg-white rounded-3xl border border-slate-200/60 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-8 border-l-4 border-primary pl-4">
              <h2 className="text-xl font-bold text-slate-900">Ta'lim tarixi</h2>
              <Button type="button" variant="outline" onClick={addEducation} className="rounded-xl font-bold border-slate-200 hover:bg-slate-50 px-4">
                <Plus className="h-4 w-4 mr-2" /> Qo'shish
              </Button>
            </div>
            <div className="space-y-4">
              {formData.education?.map((edu, index) => (
                <div key={index} className="group relative border border-slate-100 bg-slate-50/30 rounded-2xl p-6 hover:border-primary/20 hover:bg-white transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Input
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      placeholder="Daraja (masalan: Bakalavr)"
                      className="h-11 rounded-lg"
                    />
                    <Input
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                      placeholder="Muassasa nomi"
                      className="h-11 rounded-lg"
                    />
                    <Input
                      value={edu.year}
                      onChange={(e) => updateEducation(index, 'year', e.target.value)}
                      placeholder="Yil"
                      className="h-11 rounded-lg"
                    />
                    <div className="flex items-center justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeEducation(index)}
                        className="text-rose-500 hover:bg-rose-50 rounded-lg p-2"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section className="bg-white rounded-3xl border border-slate-200/60 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] pb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-8 border-l-4 border-primary pl-4">Ijtimoiy tarmoqlar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Shaxsiy veb-sayt"
                type="url"
                value={formData.contact?.website || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, website: e.target.value },
                  })
                }
                className="h-12 rounded-xl"
              />
              <Input
                label="Google Scholar havola"
                type="url"
                value={formData.contact?.googleScholar || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, googleScholar: e.target.value },
                  })
                }
                className="h-12 rounded-xl"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

