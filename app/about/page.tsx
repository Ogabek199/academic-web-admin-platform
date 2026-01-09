"use client";

import PublicNavigation from "@/shared/components/PublicNavigation";
import ChatWidget from "@/shared/components/ChatWidget";
import {
  GraduationCap,
  Users,
  BookOpen,
  BarChart3,
  Shield,
  MessageCircle,
  Globe,
  Target,
  Zap,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/ui/Button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <PublicNavigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Platforma Haqida
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Akademik tadqiqotlar, ilmiy nashrlar va statistika ma'lumotlarini boshqarish platformasi
          </p>
        </div>

        {/* Website Haqida */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Website Haqida</h2>
            </div>
            
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                Bu platforma akademik tadqiqotlar, ilmiy nashrlar va statistika ma'lumotlarini 
                boshqarish va ko'rsatish uchun yaratilgan zamonaviy veb-saytdir.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <Users className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-semibold text-gray-900">Olimlar Profillari</h3>
                  </div>
                  <p className="text-gray-700">
                    Tadqiqotchilar o'z profil ma'lumotlarini, ilmiy yo'nalishlarini va 
                    tadqiqot sohalarini ko'rsatish imkoniyatiga ega.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <BookOpen className="w-6 h-6 text-green-600" />
                    <h3 className="text-xl font-semibold text-gray-900">Ilmiy Nashrlar</h3>
                  </div>
                  <p className="text-gray-700">
                    Barcha ilmiy maqolalar, kitoblar va boshqa nashrlar tizimli 
                    tarzda saqlanadi va ko'rsatiladi.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                    <h3 className="text-xl font-semibold text-gray-900">Statistika</h3>
                  </div>
                  <p className="text-gray-700">
                    Barcha ma'lumotlar statistik ko'rinishda taqdim etiladi, 
                    bu esa ma'lumotlarni tahlil qilishni osonlashtiradi.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <MessageCircle className="w-6 h-6 text-yellow-600" />
                    <h3 className="text-xl font-semibold text-gray-900">Aloqa</h3>
                  </div>
                  <p className="text-gray-700">
                    Foydalanuvchilar chat orqali platforma bilan bog'lanishi va 
                    savollariga javob olishi mumkin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Admin Panel Haqida */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-700">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Admin Panel Haqida</h2>
            </div>
            
            <div className="space-y-6 text-gray-200 leading-relaxed">
              <p className="text-lg text-gray-100">
                Admin panel - bu platforma ma'lumotlarini boshqarish uchun maxsus 
                boshqaruv panelidir. Faqat ruxsat etilgan foydalanuvchilar kirish huquqiga ega.
              </p>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-400" />
                  Admin Panelga Kirish
                </h3>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <p>
                      Admin panelga kirish uchun chat orqali so'rov yuborishingiz kerak
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <p>
                      Ismingiz, familiyangiz va Telegram username'ingizni kiriting
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <p>
                      Admin sizga Telegram orqali login va parol yuboradi
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <Zap className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-xl font-semibold text-white">Admin Imkoniyatlari</h3>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-400">•</span>
                      <span>Profil ma'lumotlarini boshqarish</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-400">•</span>
                      <span>Ilmiy nashrlarni qo'shish va tahrirlash</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-400">•</span>
                      <span>Statistika ma'lumotlarini ko'rish</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-400">•</span>
                      <span>Fayllarni yuklash va boshqarish</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <Shield className="w-6 h-6 text-blue-400" />
                    <h3 className="text-xl font-semibold text-white">Xavfsizlik</h3>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>Faqat ruxsat etilgan foydalanuvchilar kirishi mumkin</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>Xavfsiz autentifikatsiya tizimi</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>Barcha o'zgarishlar kuzatiladi</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>Ma'lumotlar xavfsiz saqlanadi</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/admin/login">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto flex items-center justify-center"
                  >
                    <Shield className="w-5 h-5 mr-2" />
                    Admin Panelga Kirish
                  </Button>
                </Link>
                <div className="flex-1 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-sm text-blue-300">
                    <strong className="text-blue-200">Eslatma:</strong> Admin panelga kirish uchun 
                    chat orqali so'rov yuborishingiz va admin tomonidan ruxsat olishingiz kerak.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Qo'shimcha Ma'lumot */}
        <section>
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Qo'shimcha Ma'lumot</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                <p className="text-gray-700">Xavfsizlik</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                <p className="text-gray-700">Mavjudlik</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">Zamonaviy</div>
                <p className="text-gray-700">Texnologiya</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ChatWidget />
    </div>
  );
}
