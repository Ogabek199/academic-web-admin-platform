'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { GraduationCap, LogIn, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  useEffect(() => {
    // Initialize admin user if needed
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
        throw new Error(data.error || 'Login xatolik');
      }

      // Redirect to admin dashboard
      window.location.href = '/admin';
    } catch (err: any) {
      setError(err.message || 'Login xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (initLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Ma&apos;lumotlaringizni boshqarish uchun kirish</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800">Xatolik</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username kiriting"
              required
              autoFocus
              className="text-base"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password kiriting"
              required
              className="text-base"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full py-3 text-base font-semibold"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
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
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-xs font-semibold text-blue-900 mb-2">Default Login:</p>
              <div className="text-xs text-blue-800 space-y-1">
                <p><strong>Username:</strong> admin</p>
                <p><strong>Password:</strong> admin123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
