'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Star, BookOpen, Play, Pause, Volume2, FileDown } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Publication } from '@/types';

export default function PublicationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/public/publications?limit=500');
        const data = await res.json();
        const pubs: Publication[] = data.publications ?? [];
        const found = pubs.find((p) => p.id === id);
        setPublication(found ?? null);
      } catch (error) {
        console.error('Error loading publication:', error);
        setPublication(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      // Cleanup on unmount
      if (synthRef.current && utteranceRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Function to preprocess text for better speech
  const preprocessText = (text: string): string => {
    return text
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
      // Add pauses after punctuation
      .replace(/\./g, '. ')
      .replace(/,/g, ', ')
      .replace(/;/g, '; ')
      .replace(/:/g, ': ')
      .replace(/!/g, '! ')
      .replace(/\?/g, '? ')
      // Fix common Uzbek text issues
      .replace(/'/g, "'")
      .replace(/"/g, '"')
      .trim();
  };

  // Function to find best voice - prioritizing Google TTS voices
  const getBestVoice = (): SpeechSynthesisVoice | null => {
    if (!synthRef.current) return null;
    
    const voices = synthRef.current.getVoices();
    
    // Priority 1: Google TTS Turkish (best for Uzbek text)
    const googleTurkish = voices.find(v => 
      v.lang === 'tr-TR' && v.name.includes('Google')
    );
    if (googleTurkish) return googleTurkish;
    
    // Priority 2: Any Turkish voice
    const turkishVoice = voices.find(v => v.lang.startsWith('tr'));
    if (turkishVoice) return turkishVoice;
    
    // Priority 3: Russian voice (fallback)
    const russianVoice = voices.find(v => v.lang.startsWith('ru'));
    if (russianVoice) return russianVoice;
    
    // Priority 4: Any Google voice
    const googleVoice = voices.find(v => v.name.includes('Google'));
    if (googleVoice) return googleVoice;
    
    // Fallback: First available voice
    return voices[0] || null;
  };

  const handlePlayPause = () => {
    if (!publication || !publication.content) return;

    // Preprocess text for better speech
    const textToRead = preprocessText(publication.content);
    
    if (!synthRef.current) {
      alert('Ovozli o&apos;qish brauzeringizda qo&apos;llab-quvvatlanmaydi');
      return;
    }

    if (isPlaying && !isPaused) {
      // Pause
      synthRef.current.pause();
      setIsPaused(true);
    } else if (isPlaying && isPaused) {
      // Resume
      synthRef.current.resume();
      setIsPaused(false);
    } else {
      // Start or restart
      synthRef.current.cancel(); // Cancel any ongoing speech
      
      // Wait for voices to be loaded
      const speakWithVoice = () => {
        if (!synthRef.current) return;
        
        const utterance = new SpeechSynthesisUtterance(textToRead);
        
        // Get best available voice
        const bestVoice = getBestVoice();
        if (bestVoice) {
          utterance.voice = bestVoice;
          utterance.lang = bestVoice.lang;
        } else {
          // Fallback language settings
          utterance.lang = 'tr-TR'; // Turkish is closer to Uzbek than Russian
        }
        
        // Optimized settings to reduce robotic sound
        utterance.rate = 0.85; // Balanced speed - not too fast, not too slow
        utterance.pitch = 1.1; // Slightly higher pitch for more natural sound
        utterance.volume = 1.0; // Full volume

        utterance.onend = () => {
          setIsPlaying(false);
          setIsPaused(false);
        };

        utterance.onerror = (error) => {
          console.error('Speech synthesis error:', error);
          setIsPlaying(false);
          setIsPaused(false);
        };

        utteranceRef.current = utterance;
        if (synthRef.current) {
          synthRef.current.speak(utterance);
          setIsPlaying(true);
          setIsPaused(false);
        }
      };

      // Ensure voices are loaded
      if (synthRef.current) {
        if (synthRef.current.getVoices().length === 0) {
          synthRef.current.onvoiceschanged = speakWithVoice;
        } else {
          speakWithVoice();
        }
      }
    }
  };

  const handleStop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#2563EB] border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!publication) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Nashr topilmadi</h2>
          <Link href="/website/publications">
            <Button variant="outline" className="border-[#2563EB] text-[#2563EB]">
              Nashrlar roʻyxatiga qaytish
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const typeLabels: Record<string, string> = {
    article: 'Maqola',
    conference: 'Konferensiya',
    book: 'Kitob',
    thesis: 'Dissertatsiya',
    other: 'Boshqa',
  };
  const typeLabel = typeLabels[publication.type] ?? publication.type;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link
          href="/website/publications"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#2563EB] mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Nashrlar roʻyxatiga qaytish
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <span className="inline-block px-3 py-1 rounded-lg bg-[#2563EB]/10 text-[#2563EB] text-sm font-medium mb-4">
              {typeLabel}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {publication.title}
            </h1>
            <p className="text-gray-600 mb-4">
              {publication.authors?.join(', ')}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              {publication.journal && (
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {publication.journal}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {publication.year}
              </span>
              {(publication.citations ?? 0) > 0 && (
                <span className="flex items-center gap-1 text-[#10b981] font-medium">
                  <Star className="h-4 w-4" />
                  {publication.citations} sitata
                </span>
              )}
            </div>

            {/* Nashr faylini yuklab olish */}
            {publication.fileUrl && (
              <a
                href={publication.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors font-medium mb-6"
              >
                <FileDown className="h-4 w-4" />
                Nashr faylini yuklab olish
              </a>
            )}

            {/* Ovozli o&apos;qish tugmalari */}
            {publication.content && (
              <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <button
                  onClick={handlePlayPause}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors font-medium"
                >
                  {isPlaying && !isPaused ? (
                    <>
                      <Pause className="h-4 w-4" />
                      To&apos;xtatish
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      {isPaused ? "Davom ettirish" : "Ovozli o'qish"}
                    </>
                  )}
                </button>
                {isPlaying && (
                  <button
                    onClick={handleStop}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors font-medium"
                  >
                    <Volume2 className="h-4 w-4" />
                    To&apos;xtatish
                  </button>
                )}
                <span className="text-sm text-gray-600">
                  {publication.content.length > 0 && `${Math.ceil(publication.content.length / 200)} daqiqa o'qiladi`}
                </span>
              </div>
            )}

            {/* Nashr matni */}
            {publication.content ? (
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {publication.content}
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <p className="text-yellow-800 text-sm">
                  Bu nashrning to&apos;liq matni hozircha mavjud emas. Maqola matni qo&apos;shilgandan so&apos;ng bu yerda ko&apos;rinadi.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
