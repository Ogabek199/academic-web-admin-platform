'use client';

import { useState, useEffect } from 'react';
import { Profile } from '@/types';
import { saveProfile, getProfile } from '@/lib/backend/db/data';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';

export default function ProfileForm() {
  const router = useRouter();
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

  useEffect(() => {
    const existingProfile = getProfile();
    if (existingProfile) {
      setFormData(existingProfile);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    };
    saveProfile(profile);
    alert('Profil muvaffaqiyatli saqlandi!');
    router.push('/');
  };

  const handleInterestAdd = () => {
    const input = document.getElementById('interest-input') as HTMLInputElement;
    if (input && input.value.trim()) {
      setFormData({
        ...formData,
        researchInterests: [...(formData.researchInterests || []), input.value.trim()],
      });
      input.value = '';
    }
  };

  const handleInterestRemove = (index: number) => {
    setFormData({
      ...formData,
      researchInterests: formData.researchInterests?.filter((_, i) => i !== index) || [],
    });
  };

  const handleEducationAdd = () => {
    setFormData({
      ...formData,
      education: [
        ...(formData.education || []),
        { degree: '', institution: '', year: '', field: '' },
      ],
    });
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const newEducation = [...(formData.education || [])];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setFormData({ ...formData, education: newEducation });
  };

  const handleEducationRemove = (index: number) => {
    setFormData({
      ...formData,
      education: formData.education?.filter((_, i) => i !== index) || [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Asosiy ma&apos;lumotlar</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Ism</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Lavozim</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Muassasa</label>
            <input
              type="text"
              value={formData.affiliation}
              onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Biografiya</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Tadqiqot sohalari</h2>
        <div className="flex gap-2">
          <input
            id="interest-input"
            type="text"
            placeholder="Tadqiqot sohasini kiriting"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleInterestAdd())}
          />
          <button
            type="button"
            onClick={handleInterestAdd}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Qo&apos;shish
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {formData.researchInterests?.map((interest, index) => (
            <span
              key={index}
              className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700"
            >
              {interest}
              <button
                type="button"
                onClick={() => handleInterestRemove(index)}
                className="text-blue-900 hover:text-blue-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Ta&apos;lim</h2>
          <button
            type="button"
            onClick={handleEducationAdd}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Qo&apos;shish
          </button>
        </div>
        <div className="space-y-4">
          {formData.education?.map((edu, index) => (
            <div key={index} className="rounded-lg border border-gray-200 p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Daraja</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Muassasa</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Yil</label>
                  <input
                    type="text"
                    value={edu.year}
                    onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => handleEducationRemove(index)}
                    className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                  >
                    O&apos;chirish
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Aloqa ma&apos;lumotlari</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Website</label>
            <input
              type="url"
              value={formData.contact?.website || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: { ...formData.contact, website: e.target.value },
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Google Scholar</label>
            <input
              type="url"
              value={formData.contact?.googleScholar || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: { ...formData.contact, googleScholar: e.target.value },
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 md:w-auto"
      >
        <Save className="h-5 w-5" />
        Saqlash
      </button>
    </form>
  );
}

