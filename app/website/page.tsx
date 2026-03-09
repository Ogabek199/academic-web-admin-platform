'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Search,
  Users,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Calendar,
  Star,
  ChevronRight,
  Award,
  Globe,
  Zap,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';

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

type SuggestionItem = { type: 'profile'; label: string; href: string } | { type: 'publication'; label: string; href: string };

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [carouselData, setCarouselData] = useState<CarouselData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/public/carousel');
        const data = await res.json();
        setCarouselData(data);
      } catch (error) {
        console.error('Error loading carousel:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestions = useMemo((): SuggestionItem[] => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || !carouselData) return [];
    const list: SuggestionItem[] = [];
    (carouselData.profiles ?? []).forEach((p) => {
      if (
        p.name?.toLowerCase().includes(q) ||
        p.affiliation?.toLowerCase().includes(q) ||
        p.title?.toLowerCase().includes(q) ||
        (p.researchInterests ?? []).some((i) => i.toLowerCase().includes(q))
      ) {
        list.push({
          type: 'profile',
          label: `${p.name} — ${p.affiliation || p.title || ''}`,
          href: `/website/profile/${p.userId || p.id}`,
        });
      }
    });
    (carouselData.recentPublications ?? []).forEach((pub) => {
      if (
        pub.title?.toLowerCase().includes(q) ||
        (pub.authors ?? []).some((a) => a.toLowerCase().includes(q)) ||
        pub.journal?.toLowerCase().includes(q) ||
        String(pub.year).includes(q)
      ) {
        list.push({
          type: 'publication',
          label: `${pub.title?.slice(0, 50)}${(pub.title?.length ?? 0) > 50 ? '…' : ''} (${pub.year})`,
          href: `/website/publications/${pub.id}`,
        });
      }
    });
    return list.slice(0, 7);
  }, [searchQuery, carouselData]);

  const hasQuery = searchQuery.trim().length > 0;
  const showDropdown = showSuggestions && hasQuery;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    const q = searchQuery.trim();
    if (q) {
      router.push(`/website/researchers?q=${encodeURIComponent(q)}`);
    } else {
      router.push('/website/researchers');
    }
  };

  const onSelectSuggestion = (href: string) => {
    setShowSuggestions(false);
    setSearchQuery('');
    router.push(href);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4" 
          />
          <p className="text-slate-500 font-medium animate-pulse">UzScholar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  const stats = carouselData?.stats ?? {
    totalProfiles: 0,
    totalPublications: 0,
    totalCitations: 0,
  };
  const featuredProfiles = carouselData?.profiles ?? [];
  const recentPubs = carouselData?.recentPublications ?? [];

  return (
    <div className="relative isolate">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 sm:pt-20 sm:pb-32">
        <motion.div 
          style={{ opacity, scale }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-6"
            >
              <Zap className="h-4 w-4 fill-current" />
              <span>O'zbekistonning eng yirik ilmiy tarmog'i</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-8"
            >
              Ilmiy natijalaringizni <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                dunyoga ko'rsating
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              UzScholar — tadqiqotchilar, olimlar va talabalar uchun yagona platforma. 
              O'z ilmiy profilingizni yarating, nashrlaringizni kuzatib boring va h-indeksingizni oshiring.
            </motion.p>

            {/* Search Bar Refined */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-3xl mx-auto relative"
              ref={searchWrapRef}
            >
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-x-0 -bottom-2 -top-2 bg-primary/5 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <div className="relative flex items-center p-2 rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 group-focus-within:ring-primary/40 transition-all">
                  <div className="flex-1 relative flex items-center pl-4">
                    <Search className="h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => {
                        if (searchQuery.trim().length > 0) setShowSuggestions(true);
                      }}
                      placeholder="Muallif ismi, maqola sarlavhasi yoki kalit so'z..."
                      className="w-full px-4 py-3 bg-transparent border-none focus:ring-0 focus:outline-none text-slate-900 placeholder-slate-400 text-lg"
                      autoComplete="off"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="rounded-xl px-8 py-4 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all font-bold"
                  >
                    Qidirish
                  </Button>
                </div>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute inset-x-0 top-full mt-4 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 z-[100] overflow-hidden"
                    >
                      <div className="py-2 max-h-[400px] overflow-y-auto">
                        {!carouselData ? (
                          <div className="px-6 py-4 flex items-center gap-3 text-slate-500">
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                            <span>Qidirilmoqda...</span>
                          </div>
                        ) : suggestions.length === 0 ? (
                          <div className="px-6 py-8 text-center text-slate-500">
                            <p className="font-medium">Natija topilmadi</p>
                            <p className="text-sm mt-1">Boshqa kalit so'z bilan urinib ko'ring</p>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            {suggestions.map((item, i) => (
                              <button
                                key={`${item.type}-${i}`}
                                type="button"
                                onClick={() => onSelectSuggestion(item.href)}
                                className="w-full text-left px-6 py-4 hover:bg-slate-50/80 flex items-center gap-4 transition-colors border-b border-slate-100 last:border-none"
                              >
                                <div className={`p-2 rounded-lg ${item.type === 'profile' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                  {item.type === 'profile' ? <Users className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-slate-900 line-clamp-1">{item.label}</p>
                                  <p className="text-xs text-slate-400 capitalize">{item.type === 'profile' ? "Tadqiqotchi" : "Ilmiy nashr"}</p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-slate-300" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </div>
        </motion.div>

        {/* Floating background elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-1" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-accent/10 rounded-full blur-[100px] -z-1" />
      </section>

      {/* Modern Stats Section */}
      <section className="py-24 relative overflow-hidden bg-white/40 backdrop-blur-sm border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
          >
            {[
              { label: 'Tadqiqotchilar', value: stats.totalProfiles, icon: Users, color: 'text-primary', bg: 'bg-primary/5' },
              { label: 'Ilmiy nashrlar', value: stats.totalPublications, icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-50' },
              { label: 'Jami sitatalar', value: stats.totalCitations, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                variants={fadeInUp}
                className="flex flex-col items-center p-8 rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 border border-slate-100 hover:scale-105 transition-transform"
              >
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} mb-6`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-2">
                   {stat.value.toLocaleString()}
                </h3>
                <p className="text-slate-500 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Researchers with Glassmorphism Cards */}
      {featuredProfiles.length > 0 && (
        <section className="py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4 text-center md:text-left">
              <div className="max-w-2xl">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Taniqli tadqiqotchilar</h2>
                <p className="text-lg text-slate-600">Eng ko'p iqtibos keltirilgan va faol maqolalarga ega bo'lgan olimlarimiz bilan tanishing.</p>
              </div>
              <Link
                href="/website/researchers"
                className="group inline-flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-all"
              >
                Barcha tadqiqotchilar
                <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </Link>
            </div>
            
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {featuredProfiles.slice(0, 6).map((profile) => (
                <motion.div key={profile.id} variants={fadeInUp}>
                  <Link
                    href={`/website/profile/${profile.userId || profile.id}`}
                    className="group relative block h-full p-6 rounded-[2.5rem] bg-white/40 backdrop-blur-md border border-white/50 hover:border-primary/30 transition-all shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-6">
                       <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 group-hover:bg-primary/10 text-slate-300 group-hover:text-primary transition-colors">
                          <Award className="h-6 w-6" />
                       </div>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        {profile.photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            loading='lazy'
                            src={profile.photo}
                            alt={profile.name}
                            className="relative w-28 h-28 rounded-[2rem] object-cover ring-4 ring-white group-hover:ring-primary/20 transition-all"
                          />
                        ) : (
                          <div className="relative w-28 h-28 rounded-[2rem] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-3xl font-bold text-primary ring-4 ring-white transition-all">
                            {profile.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">{profile.name}</h3>
                      <p className="text-sm font-semibold text-primary/80 mb-2">{profile.title}</p>
                      <p className="text-sm text-slate-500 mb-6 px-4 line-clamp-2 min-h-[40px] leading-relaxed">{profile.affiliation}</p>
                      
                      {profile.researchInterests?.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-center">
                          {profile.researchInterests.slice(0, 2).map((interest, i) => (
                            <span key={i} className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              {interest}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Interactive Features Section [NEW] */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">Nega aynan UzScholar?</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Sizning ilmiy faoliyatingiz uchun zamonaviy yechimlar</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Global Ko'rinish", desc: "Sizning ilmiy profilingiz dunyo miqyosidagi qidiruv tizimlari tomonidan indekslanadi.", icon: Globe },
              { title: "Statistik Hisobotlar", desc: "Nashrlar, iqtiboslar va h-indeksingizni grafik ko'rinishida kuzatib boring.", icon: TrendingUp },
              { title: "Akademik Hamkorlik", desc: "Sohangizdagi boshqa tadqiqotchilar bilan aloqa o'rnating va yangiliklarni ulashing.", icon: Users },
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-6">
                  <f.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Publications List Redesign */}
      {recentPubs.length > 0 && (
        <section className="py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-16">
              <div className="max-w-2xl">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Eng so'nggi nashrlar</h2>
                <p className="text-lg text-slate-600 italic">"Ilm - bu hech qachon tugamaydigan sayohat"</p>
              </div>
              <Link href="/website/publications" className="hidden sm:flex items-center gap-2 text-emerald-600 font-bold hover:gap-3 transition-all">
                Barchasini o'qish <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {recentPubs.slice(0, 4).map((pub, i) => (
                <motion.div 
                  key={pub.id}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="group p-8 rounded-[2rem] bg-white border border-slate-100 hover:border-emerald-200 transition-all shadow-md hover:shadow-xl flex gap-6"
                >
                  <div className="hidden sm:flex flex-col items-center justify-center p-4 rounded-2xl bg-emerald-50 text-emerald-600 h-24 w-24 shrink-0">
                    <Calendar className="h-6 w-6 mb-1" />
                    <span className="text-sm font-black">{pub.year}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors">
                      {pub.title}
                    </h3>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-1 font-medium">{pub.authors?.join(', ')}</p>
                    <div className="flex items-center gap-6">
                       {pub.citations > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span>{pub.citations} sitata</span>
                        </div>
                       )}
                       <div className="text-xs text-slate-400 font-medium sm:hidden">
                          Nashr yili: {pub.year}
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-12 text-center sm:hidden">
               <Link href="/website/publications">
                  <Button variant="outline" className="w-full rounded-2xl py-6 border-emerald-600 text-emerald-600">
                    Barcha nashrlar
                  </Button>
               </Link>
            </div>
          </div>
        </section>
      )}

      {/* Modern High-Impact CTA */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-br from-primary to-accent p-12 sm:p-20 relative overflow-hidden shadow-2xl shadow-primary/40">
           <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.4),transparent)]" />
           <div className="relative z-10 text-center text-white">
              <h2 className="text-3xl sm:text-5xl font-black mb-8">O'z ilmiy salohiyatingizni <br /> biz bilan oshiring</h2>
              <p className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto mb-12">
                Hoziroq ro'yxatdan o'ting va ilmiy hamjamiyatning bir qismiga aylaning. 
                Sizning natijalaringiz munosib etirof uchun yaratilgan.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link href="/admin/login">
                  <Button className="!bg-white !text-blue-600 hover:!bg-white/90 scale-110 px-10 py-6 rounded-2xl text-lg font-bold shadow-xl">
                    Ishni boshlash
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-10 py-6 rounded-2xl text-lg font-bold backdrop-blur-sm">
                    Batafsil ma'lumot
                  </Button>
                </Link>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}

