'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { GraduationCap, LogIn, AlertCircle, Eye, EyeOff, MessageCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  useEffect(() => {
    const initAdmin = async () => {
      try {
        await fetch('/api/init');
      } catch (error) {
        console.error('Init error:', error);
      } finally {
        setInitLoading(false);
      }
    };
    initAdmin();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Kirish xatolik');
      }

      window.location.href = '/admin';
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Kirish xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (initLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#2563EB] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2563EB] rounded-2xl mb-5">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Admin Panel
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Ma&apos;lumotlaringizni boshqarish uchun tizimga kiring
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Xatolik</p>
                  <p className="text-sm text-red-700 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            <Input
              label="Foydalanuvchi nomi"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Foydalanuvchi nomini kiriting"
              required
              autoFocus
              className="text-base"
            />

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Parol
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Parolni kiriting"
                  required
                  className="w-full px-4 py-2.5 pr-12 rounded-xl border border-gray-300 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-colors text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={
                    showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full py-3 text-base font-semibold bg-[#2563EB] hover:bg-[#1d4ed8]"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Kirilmoqda...
                </span>
              ) : (
                <>
                  <LogIn className="w-5 h-5 inline mr-2" />
                  Kirish
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <MessageCircle className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  Login va parol kerakmi?
                </p>
                <p className="text-xs text-gray-600 leading-relaxed mb-2">
                  Login va parol olish uchun Telegram orqali qo&apos;llab-quvvatlash bilan bog&apos;laning:
                </p>
                <a
                  href="https://t.me/otaxonov_o17"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[#2563EB] hover:underline"
                >
                  @otaxonov_o17
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
