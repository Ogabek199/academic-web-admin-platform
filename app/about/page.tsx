"use client";

import PublicNavigation from "@/shared/components/PublicNavigation";
import PublicFooter from "@/shared/components/PublicFooter";
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
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/ui/Button";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavigation />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2563EB] rounded-2xl mb-5 shadow-sm">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Platforma haqida
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Tadqiqotchilar, olimlar va talabalar uchun zamonaviy ilmiy platforma
          </p>
        </div>

        {/* Website Haqida */}
        <section className="mb-12 sm:mb-16">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 md:p-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-[#2563EB]/10 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-[#2563EB]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Platforma haqida</h2>
            </div>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-base sm:text-lg">
                Bu platforma akademik tadqiqotlar, ilmiy nashrlar va statistika ma&apos;lumotlarini
                boshqarish va ko&apos;rsatish uchun yaratilgan zamonaviy veb-saytdir.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-[#f8fafc] rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <Users className="w-6 h-6 text-[#2563EB]" />
                    <h3 className="text-lg font-semibold text-gray-900">Tadqiqotchilar profillari</h3>
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base">
                    Tadqiqotchilar o&apos;z profil ma&apos;lumotlarini, ilmiy yo&apos;nalishlarini va
                    tadqiqot sohalarini ko&apos;rsatish imkoniyatiga ega.
                  </p>
                </div>

                <div className="bg-[#f8fafc] rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <BookOpen className="w-6 h-6 text-[#10b981]" />
                    <h3 className="text-lg font-semibold text-gray-900">Ilmiy nashrlar</h3>
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base">
                    Barcha ilmiy maqolalar, kitoblar va boshqa nashrlar tizimli
                    tarzda saqlanadi va ko&apos;rsatiladi.
                  </p>
                </div>

                <div className="bg-[#f8fafc] rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <BarChart3 className="w-6 h-6 text-[#8b5cf6]" />
                    <h3 className="text-lg font-semibold text-gray-900">Statistika</h3>
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base">
                    Barcha ma&apos;lumotlar statistik ko&apos;rinishda taqdim etiladi,
                    bu esa ma&apos;lumotlarni tahlil qilishni osonlashtiradi.
                  </p>
                </div>

                <div className="bg-[#f8fafc] rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <MessageCircle className="w-6 h-6 text-[#2563EB]" />
                    <h3 className="text-lg font-semibold text-gray-900">Aloqa</h3>
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base">
                    Telegram orqali platforma bilan bog&apos;lanish va
                    savollaringizga javob olishingiz mumkin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mb-12 sm:mb-16 scroll-mt-20">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 md:p-12">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-[#2563EB]/10 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-[#2563EB]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Savol-javob (FAQ)</h2>
            </div>
            <dl className="space-y-6">
              <div>
                <dt className="text-base font-semibold text-gray-900 mb-2">Platforma nima uchun?</dt>
                <dd className="text-gray-600 text-sm sm:text-base">
                  Tadqiqotchilar va olimlar o&apos;z profillarini, nashrlarini va statistikasini bitta joyda ko&apos;rsatish va boshqalarga topish imkoniyatini berish uchun.
                </dd>
              </div>
              <div>
                <dt className="text-base font-semibold text-gray-900 mb-2">Admin panelga qanday kirish mumkin?</dt>
                <dd className="text-gray-600 text-sm sm:text-base">
                  Admin panelga kirish uchun Telegram orqali qo&apos;llab-quvvatlash bilan bog&apos;laning (@otaxonov_o17). Sizga login va parol yuboriladi.
                </dd>
              </div>
              <div>
                <dt className="text-base font-semibold text-gray-900 mb-2">Profilimni qanday yangilayman?</dt>
                <dd className="text-gray-600 text-sm sm:text-base">
                  Admin panelga kiring, &quot;Profil boshqaruvi&quot; bo&apos;limiga o&apos;ting va ma&apos;lumotlaringizni tahrirlang yoki rasmingizni yuklang.
                </dd>
              </div>
              <div>
                <dt className="text-base font-semibold text-gray-900 mb-2">Nashrlar qanday qo&apos;shiladi?</dt>
                <dd className="text-gray-600 text-sm sm:text-base">
                  Admin panelda &quot;Nashrlar&quot; bo&apos;limida &quot;Yangi nashr&quot; tugmasini bosing va sarlavha, mualliflar, jurnal, yil va sitatalarni kiriting.
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Admin Panel Haqida */}
        <section className="mb-12 sm:mb-16">
          <div className="bg-[#f8fafc] rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 md:p-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-[#2563EB] rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin panel haqida</h2>
            </div>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-base sm:text-lg">
                Admin panel — platforma ma&apos;lumotlarini boshqarish uchun maxsus boshqaruv paneli. Faqat ruxsat etilgan foydalanuvchilar kirish huquqiga ega.
              </p>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#2563EB]" />
                  Admin panelga kirish
                </h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#10b981] mt-0.5 flex-shrink-0" />
                    <p>Telegram orqali qo&apos;llab-quvvatlash bilan bog&apos;laning (@otaxonov_o17)</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#10b981] mt-0.5 flex-shrink-0" />
                    <p>Ismingiz va Telegram username&apos;ingizni yuboring</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#10b981] mt-0.5 flex-shrink-0" />
                    <p>Admin sizga login va parol yuboradi</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <Zap className="w-6 h-6 text-[#8b5cf6]" />
                    <h3 className="text-lg font-semibold text-gray-900">Admin imkoniyatlari</h3>
                  </div>
                  <ul className="space-y-2 text-gray-600 text-sm sm:text-base">
                    <li className="flex items-start space-x-2">
                      <span className="text-[#2563EB]">•</span>
                      <span>Profil ma&apos;lumotlarini boshqarish</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#2563EB]">•</span>
                      <span>Ilmiy nashrlarni qo&apos;shish va tahrirlash</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#2563EB]">•</span>
                      <span>Statistika ma&apos;lumotlarini ko&apos;rish</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#2563EB]">•</span>
                      <span>Fayllarni yuklash va boshqarish</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <Shield className="w-6 h-6 text-[#2563EB]" />
                    <h3 className="text-lg font-semibold text-gray-900">Xavfsizlik</h3>
                  </div>
                  <ul className="space-y-2 text-gray-600 text-sm sm:text-base">
                    <li className="flex items-start space-x-2">
                      <span className="text-[#10b981]">✓</span>
                      <span>Faqat ruxsat etilgan foydalanuvchilar kirishi mumkin</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#10b981]">✓</span>
                      <span>Xavfsiz autentifikatsiya tizimi</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#10b981]">✓</span>
                      <span>Ma&apos;lumotlar xavfsiz saqlanadi</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/admin/login">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto flex items-center justify-center bg-[#2563EB] hover:bg-[#1d4ed8]"
                  >
                    <Shield className="w-5 h-5 mr-2" />
                    Admin panelga kirish
                  </Button>
                </Link>
                <div className="flex-1 bg-[#2563EB]/5 border border-[#2563EB]/20 rounded-xl p-4">
                  <p className="text-sm text-gray-700">
                    <strong className="text-[#2563EB]">Eslatma:</strong> Admin panelga kirish uchun
                    Telegram orqali so&apos;rov yuborishingiz va admin tomonidan ruxsat olishingiz kerak.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Qo'shimcha ma'lumot */}
        <section>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 md:p-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Qo&apos;shimcha ma&apos;lumot</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-[#f8fafc] rounded-2xl border border-gray-200">
                <div className="text-2xl sm:text-3xl font-bold text-[#2563EB] mb-2">100%</div>
                <p className="text-gray-600 text-sm sm:text-base">Xavfsizlik</p>
              </div>
              <div className="text-center p-6 bg-[#f8fafc] rounded-2xl border border-gray-200">
                <div className="text-2xl sm:text-3xl font-bold text-[#10b981] mb-2">24/7</div>
                <p className="text-gray-600 text-sm sm:text-base">Mavjudlik</p>
              </div>
              <div className="text-center p-6 bg-[#f8fafc] rounded-2xl border border-gray-200">
                <div className="text-2xl sm:text-3xl font-bold text-[#8b5cf6] mb-2">Zamonaviy</div>
                <p className="text-gray-600 text-sm sm:text-base">Texnologiya</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
      <ChatWidget />
    </div>
  );
}
