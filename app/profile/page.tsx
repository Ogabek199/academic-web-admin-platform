'use client';

import ProfileForm from '@/components/ProfileForm';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profil sozlash</h1>
        <p className="mt-2 text-gray-600">
          Shaxsiy ma&apos;lumotlarni kiriting va yangilang
        </p>
      </div>
      <ProfileForm />
    </div>
  );
}

