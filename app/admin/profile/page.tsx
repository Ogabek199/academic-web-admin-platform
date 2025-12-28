'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { Save, Upload, X } from 'lucide-react';
import { Profile } from '@/types';

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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Faqat rasm fayllari yuklash mumkin');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Rasm hajmi 5MB dan katta bo\'lmasligi kerak');
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
        alert('Rasm muvaffaqiyatli yuklandi!');
      } else {
        throw new Error('Yuklash xatolik');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(error.message || 'Rasm yuklashda xatolik yuz berdi');
    } finally {
      setUploading(false);
      // Reset input
      const input = document.getElementById('photo-upload-input') as HTMLInputElement;
      if (input) {
        input.value = '';
      }
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

      if (!response.ok) throw new Error('Saqlash xatolik');

      alert('Profil muvaffaqiyatli saqlandi!');
      router.refresh();
    } catch (error: any) {
      alert(error.message);
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profil sozlash</h1>
        <p className="mt-2 text-gray-600">Shaxsiy ma&apos;lumotlarni yangilang</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Upload */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Profil rasmi</h2>
          <div className="flex items-center space-x-6">
            {formData.photo ? (
              <img
                src={formData.photo}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Rasm yo&apos;q</span>
              </div>
            )}
            <div>
              <label htmlFor="photo-upload-input" className="cursor-pointer">
                <input
                  id="photo-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  className="flex items-center justify-center"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('photo-upload-input')?.click();
                  }}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Yuklanmoqda...' : 'Rasm yuklash'}
                </Button>
              </label>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Asosiy ma&apos;lumotlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Ism"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Lavozim"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <Input
              label="Muassasa"
              value={formData.affiliation}
              onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Biografiya</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Research Interests */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tadqiqot sohalari</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
              placeholder="Tadqiqot sohasini kiriting"
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <Button type="button" onClick={addInterest}>Qo&apos;shish</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.researchInterests?.map((interest, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {interest}
                <button
                  type="button"
                  onClick={() => removeInterest(index)}
                  className="hover:text-blue-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Ta&apos;lim</h2>
            <Button type="button" variant="outline" onClick={addEducation}>
              Qo&apos;shish
            </Button>
          </div>
          <div className="space-y-4">
            {formData.education?.map((edu, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    placeholder="Daraja"
                  />
                  <Input
                    value={edu.institution}
                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                    placeholder="Muassasa"
                  />
                  <div className="flex gap-2">
                    <Input
                      value={edu.year}
                      onChange={(e) => updateEducation(index, 'year', e.target.value)}
                      placeholder="Yil"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeEducation(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Aloqa ma&apos;lumotlari</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Website"
              type="url"
              value={formData.contact?.website || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: { ...formData.contact, website: e.target.value },
                })
              }
            />
            <Input
              label="Google Scholar"
              type="url"
              value={formData.contact?.googleScholar || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: { ...formData.contact, googleScholar: e.target.value },
                })
              }
            />
          </div>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          size="lg" 
          disabled={loading} 
          className="w-full sm:w-auto flex items-center justify-center"
        >
          <Save className="h-5 w-5 mr-2" />
          {loading ? 'Saqlanmoqda...' : 'Saqlash'}
        </Button>
      </form>
    </div>
  );
}

