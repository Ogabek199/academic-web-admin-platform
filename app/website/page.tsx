"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Link from "next/link";
import {
  Search,
  GraduationCap,
  TrendingUp,
  Users,
  BookOpen,
  ArrowRight,
  Sparkles,
  BarChart3,
  Zap,
  Target,
  Star,
  Calendar,
} from "lucide-react";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import PublicNavigation from "@/shared/components/PublicNavigation";
import ChatWidget from "@/shared/components/ChatWidget";

interface Profile {
  id: string;
  userId?: string;
  name: string;
  title: string;
  affiliation: string;
  photo?: string;
  researchInterests: string[];
}

interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal?: string;
  year: number;
  citations: number;
  type: string;
}

interface CarouselData {
  profiles: Profile[];
  recentPublications: Publication[];
  topPublications: Publication[];
  stats: {
    totalProfiles: number;
    totalPublications: number;
    totalCitations: number;
  };
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [carouselData, setCarouselData] = useState<CarouselData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load carousel data
        const carouselResponse = await fetch("/api/public/carousel");
        const carouselResult = await carouselResponse.json();
        setCarouselData(carouselResult);

        // Check for search query in URL
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get("q");

        if (query) {
          setSearchQuery(query);
          const response = await fetch(
            `/api/public/profiles?q=${encodeURIComponent(query)}`
          );
          const data = await response.json();
          setProfiles(data.profiles || []);
        } else {
          const response = await fetch("/api/public/profiles");
          const data = await response.json();
          const allProfiles = data.profiles || [];
          setProfiles(allProfiles);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `/api/public/profiles?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setProfiles(data.profiles || []);

      // Update URL without page reload
      const url = new URL(window.location.href);
      if (searchQuery.trim()) {
        url.searchParams.set("q", searchQuery);
      } else {
        url.searchParams.delete("q");
      }
      window.history.pushState({}, "", url.toString());
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  // Generate dynamic carousel items from real data
  const getCarouselItems = () => {
    if (!carouselData) {
      // Default items if no data
      return [
        {
          title: "Akademik Profillar",
          subtitle: "Ilmiy hamjamiyat",
          description: "Dunyoning yetakchi olimlari va tadqiqotchilari bilan tanishing",
          image: "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600",
          icon: GraduationCap,
          data: null,
          type: "profiles",
        },
        {
          title: "Ilmiy Nashrlar",
          subtitle: "Eng so'nggi tadqiqotlar",
          description: "Turli sohalardagi eng muhim ilmiy nashrlar va maqolalar",
          image: "bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600",
          icon: BookOpen,
          data: null,
          type: "publications",
        },
        {
          title: "Tadqiqotlar",
          subtitle: "Innovatsion yechimlar",
          description: "Zamonaviy texnologiyalar va ilmiy yutuqlar",
          image: "bg-gradient-to-br from-rose-500 via-pink-600 to-fuchsia-600",
          icon: TrendingUp,
          data: null,
          type: "research",
        },
      ];
    }

    const items = [];

    // Featured Profiles Slide
    if (carouselData.profiles.length > 0) {
      items.push({
        title: "Akademik Profillar",
        subtitle: `${carouselData.stats.totalProfiles} ta olim`,
        description: carouselData.profiles[0]
          ? `${carouselData.profiles[0].name} va boshqa yetakchi tadqiqotchilar`
          : "Dunyoning yetakchi olimlari va tadqiqotchilari bilan tanishing",
        image: "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600",
        icon: GraduationCap,
        data: carouselData.profiles.slice(0, 3),
        type: "profiles",
      });
    }

    // Recent Publications Slide
    if (carouselData.recentPublications.length > 0) {
      const pub = carouselData.recentPublications[0];
      items.push({
        title: "Eng So'nggi Nashrlar",
        subtitle: `${carouselData.stats.totalPublications} ta nashr`,
        description: pub
          ? `"${pub.title.substring(0, 60)}${pub.title.length > 60 ? "..." : ""}" - ${pub.year}`
          : "Turli sohalardagi eng muhim ilmiy nashrlar va maqolalar",
        image: "bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600",
        icon: BookOpen,
        data: carouselData.recentPublications.slice(0, 3),
        type: "publications",
      });
    }

    // Top Cited Publications Slide
    if (carouselData.topPublications.length > 0) {
      const topPub = carouselData.topPublications[0];
      items.push({
        title: "Eng Ko'p Sitatalangan",
        subtitle: `${carouselData.stats.totalCitations} ta sitata`,
        description: topPub
          ? `"${topPub.title.substring(0, 60)}${topPub.title.length > 60 ? "..." : ""}" - ${topPub.citations} ta sitata`
          : "Eng ko'p sitatalangan ilmiy nashrlar va maqolalar",
        image: "bg-gradient-to-br from-rose-500 via-pink-600 to-fuchsia-600",
        icon: TrendingUp,
        data: carouselData.topPublications.slice(0, 3),
        type: "topPublications",
      });
    }

    // If no data, return default items
    if (items.length === 0) {
      return [
        {
          title: "Akademik Profillar",
          subtitle: "Ilmiy hamjamiyat",
          description: "Dunyoning yetakchi olimlari va tadqiqotchilari bilan tanishing",
          image: "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600",
          icon: GraduationCap,
          data: null,
          type: "profiles",
        },
        {
          title: "Ilmiy Nashrlar",
          subtitle: "Eng so'nggi tadqiqotlar",
          description: "Turli sohalardagi eng muhim ilmiy nashrlar va maqolalar",
          image: "bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600",
          icon: BookOpen,
          data: null,
          type: "publications",
        },
        {
          title: "Tadqiqotlar",
          subtitle: "Innovatsion yechimlar",
          description: "Zamonaviy texnologiyalar va ilmiy yutuqlar",
          image: "bg-gradient-to-br from-rose-500 via-pink-600 to-fuchsia-600",
          icon: TrendingUp,
          data: null,
          type: "research",
        },
      ];
    }

    return items;
  };

  const carouselItems = getCarouselItems();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-xl">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <PublicNavigation />

      {/* Hero Section with Enhanced Carousel */}
      <section className="relative h-[90vh] min-h-[700px] max-h-[1000px] overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet-custom",
            bulletActiveClass: "swiper-pagination-bullet-active-custom",
          }}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
          }}
          className="h-full"
        >
          {carouselItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <SwiperSlide key={index}>
                <div
                  className={`${item.image} h-full flex items-center justify-center text-white relative overflow-hidden`}
                >
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px)`,
                        backgroundSize: "50px 50px",
                        animation: "float 20s infinite ease-in-out",
                      }}
                    ></div>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent"></div>

                  {/* Content */}
                  <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                    <div className="mb-8 animate-fade-in">
                      <div className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 bg-white/10 backdrop-blur-md rounded-3xl mb-6 border border-white/20 shadow-2xl transform hover:scale-110 transition-transform duration-300">
                        <Icon className="w-12 h-12 md:w-16 md:h-16 text-white" />
                      </div>
                    </div>

                    <div className="space-y-4 animate-slide-up">
                      <p className="text-lg md:text-xl text-white/90 font-medium tracking-wide uppercase">
                        {item.subtitle}
                      </p>
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 leading-tight drop-shadow-2xl">
                        {item.title}
          </h1>
                      <p className="text-xl md:text-2xl lg:text-3xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Dynamic Data Preview */}
                    {item.data && item.data.length > 0 && (
                      <div className="mt-8 animate-fade-in-delay">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                          {item.data.slice(0, 3).map((dataItem: Profile | Publication, idx: number) => {
                            const isProfile = item.type === "profiles";
                            const profile = isProfile ? (dataItem as Profile) : null;
                            const publication = !isProfile ? (dataItem as Publication) : null;

                            return (
                              <div
                                key={idx}
                                className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300"
                              >
                                {isProfile && profile && (
                                  <div className="flex items-center space-x-3">
                                    {profile.photo ? (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img
                                        src={profile.photo}
                                        alt={profile.name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                                      />
                                    ) : (
                                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                                        {profile.name.charAt(0)}
                                      </div>
                                    )}
                                    <div className="text-left flex-1 min-w-0">
                                      <p className="text-white font-semibold text-sm truncate">
                                        {profile.name}
                                      </p>
                                      <p className="text-white/80 text-xs truncate">
                                        {profile.title}
          </p>
        </div>
                                  </div>
                                )}
                                {!isProfile && publication && (
                                  <div>
                                    <p className="text-white font-semibold text-sm line-clamp-2 mb-2">
                                      {publication.title}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-white/80">
                                      <span>{publication.year}</span>
                                      {publication.citations > 0 && (
                                        <span className="flex items-center">
                                          <Star className="w-3 h-3 mr-1" />
                                          {publication.citations}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="mt-10 animate-fade-in-delay">
                      <Button
                        size="lg"
                        variant="outline"
                        className="flex items-center mx-auto bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 px-8 py-4 text-lg"
                        onClick={() => {
                          const searchSection =
                            document.getElementById("search-section");
                          if (searchSection) {
                            searchSection.scrollIntoView({
                              behavior: "smooth",
                            });
                            // Focus search input after scroll
                            setTimeout(() => {
                              const searchInput = document.querySelector(
                                'input[placeholder*="Masalan"]'
                              ) as HTMLInputElement;
                              if (searchInput) {
                                searchInput.focus();
                              }
                            }, 500);
                          }
                        }}
                      >
                        <Search className="w-5 h-5 mr-2" />
                        Qidirishni boshlash
                      </Button>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-20 right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <div className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </div>
        <div className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </section>

      {/* Search Section */}
      <section
        id="search-section"
        className="py-20 bg-gradient-to-b from-gray-50 to-white border-b border-gray-200"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl p-10 md:p-12 border border-gray-100">
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Profillarni qidirish
              </h2>
              <p className="text-xl md:text-2xl text-gray-600">
                Ism, lavozim, muassasa yoki tadqiqot sohasini kiriting
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Masalan: Matematika, AI, Biologiya, Fizika..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="text-lg py-4"
                />
              </div>
              <Button
                onClick={handleSearch}
                size="lg"
                className="flex items-center justify-center px-10 py-4 text-lg font-semibold"
              >
                <Search className="h-5 w-5 mr-2" />
                Qidirish
              </Button>
            </div>
            {searchQuery && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">{profiles.length}</span> ta
                  natija topildi
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    window.location.href = "/";
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Barcha profillarni ko&apos;rsatish
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Profiles */}
      <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-8 shadow-xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              Taniqli Olimlar
            </h2>
            <p className="text-2xl md:text-3xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Turli sohalardagi yetakchi tadqiqotchilar va olimlar
            </p>
          </div>

          {profiles.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <p className="text-gray-500 text-xl">
                Hozircha profillar mavjud emas
              </p>
              <p className="text-gray-400 mt-2">
                Admin panel orqali profil qo&apos;shing
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {profiles.map((profile) => (
                <Link
                  key={profile.id}
                  href={`/profile/${profile.userId || profile.id}`}
                  className="group bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-8 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-3 transform"
                >
                  <div className="flex flex-col items-center text-center mb-6">
                    {profile.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profile.photo}
                        alt={profile.name}
                        className="w-28 h-28 rounded-3xl object-cover border-4 border-gray-100 group-hover:border-blue-400 transition-all duration-300 shadow-lg mb-4 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-xl mb-4 group-hover:scale-110 transition-transform">
                        {profile.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {profile.name}
                    </h3>
                    <p className="text-base text-blue-600 font-semibold mb-1">
                      {profile.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {profile.affiliation}
                    </p>
                  </div>

                  {profile.researchInterests &&
                    profile.researchInterests.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-2 justify-center">
                        {profile.researchInterests
                          .slice(0, 3)
                          .map((interest, idx) => (
                            <span
                              key={idx}
                              className="text-sm bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-4 py-2 rounded-full font-medium border border-blue-100 shadow-sm"
                            >
                              {interest}
                            </span>
                          ))}
                      </div>
                    )}

                  <div className="mt-8 flex items-center justify-center text-blue-600 text-base font-semibold group-hover:text-blue-700">
                    Batafsil ma&apos;lumot
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>


      {/* Recent Publications Section */}
      {carouselData && carouselData.recentPublications.length > 0 && (
        <section className="py-24 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl mb-8 shadow-xl">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Eng So&apos;nggi Nashrlar
              </h2>
              <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
                Ilmiy hamjamiyatning eng yangi tadqiqotlari va yutuqlari
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {carouselData.recentPublications.slice(0, 6).map((pub: Publication) => (
                <div
                  key={pub.id}
                  className="group bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-6 hover:shadow-2xl hover:border-emerald-300 transition-all duration-300 hover:-translate-y-2 transform"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {pub.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {pub.authors.slice(0, 2).map((author, idx) => (
                          <span
                            key={idx}
                            className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full"
                          >
                            {author}
                          </span>
                        ))}
                        {pub.authors.length > 2 && (
                          <span className="text-sm text-gray-500 px-3 py-1">
                            +{pub.authors.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      {pub.journal && (
                        <span className="flex items-center">
                          <BookOpen className="w-4 h-4 mr-1" />
                          {pub.journal}
                        </span>
                      )}
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {pub.year}
                      </span>
                    </div>
                    {pub.citations > 0 && (
                      <div className="flex items-center text-emerald-600 font-semibold">
                        <Star className="w-4 h-4 mr-1" />
                        {pub.citations} sitata
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-8 shadow-xl animate-pulse">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Platforma Xususiyatlari
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
              Ilmiy faoliyatingizni boshqarish uchun barcha kerakli vositalar
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: GraduationCap,
                title: "Profil Boshqaruvi",
                desc: "Shaxsiy ma'lumotlarni to'ldiring va yangilang",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: BookOpen,
                title: "Nashrlar",
                desc: "Ilmiy nashrlaringizni qo'shing va boshqaring",
                color: "from-emerald-500 to-teal-500",
              },
              {
                icon: BarChart3,
                title: "Statistika",
                desc: "Batafsil statistika va grafiklar",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: TrendingUp,
                title: "Tadqiqotlar",
                desc: "Tadqiqot sohalaringizni ko'rsating",
                color: "from-rose-500 to-orange-500",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-2 border-gray-100 hover:border-transparent relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  <div className="relative z-10">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-white transition-colors duration-500">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed group-hover:text-white/90 transition-colors duration-500">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Stats Section */}
      {carouselData && (
        <section className="py-32 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl mb-8 shadow-xl border border-white/20">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Platforma Statistikasi
              </h2>
              <p className="text-2xl text-white/80 max-w-3xl mx-auto">
                Bizning hamjamiyat raqamlarda
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center group bg-white/10 backdrop-blur-md rounded-3xl p-10 shadow-2xl hover:bg-white/20 transition-all duration-500 hover:scale-110 border border-white/20">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl mb-8 shadow-xl group-hover:rotate-12 transition-transform duration-500">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-6xl md:text-7xl font-bold text-white mb-4">
                  {carouselData.stats.totalProfiles}
                </h3>
                <p className="text-xl text-white/90 font-semibold">
                  Ro&apos;yxatdan o&apos;tgan olimlar
                </p>
              </div>
              <div className="text-center group bg-white/10 backdrop-blur-md rounded-3xl p-10 shadow-2xl hover:bg-white/20 transition-all duration-500 hover:scale-110 border border-white/20">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl mb-8 shadow-xl group-hover:rotate-12 transition-transform duration-500">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-6xl md:text-7xl font-bold text-white mb-4">
                  {carouselData.stats.totalPublications}
                </h3>
                <p className="text-xl text-white/90 font-semibold">
                  Jami ilmiy nashrlar
                </p>
              </div>
              <div className="text-center group bg-white/10 backdrop-blur-md rounded-3xl p-10 shadow-2xl hover:bg-white/20 transition-all duration-500 hover:scale-110 border border-white/20">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-600 rounded-3xl mb-8 shadow-xl group-hover:rotate-12 transition-transform duration-500">
                  <TrendingUp className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-6xl md:text-7xl font-bold text-white mb-4">
                  {carouselData.stats.totalCitations}
                </h3>
                <p className="text-xl text-white/90 font-semibold">
                  Jami sitatalar
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 1s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 1.2s ease-out;
        }

        :global(.swiper-pagination-bullet-custom) {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
          margin: 0 6px;
          transition: all 0.3s;
        }

        :global(.swiper-pagination-bullet-active-custom) {
          background: white;
          width: 32px;
          border-radius: 6px;
        }
      `}</style>
      <ChatWidget />
    </div>
  );
}
