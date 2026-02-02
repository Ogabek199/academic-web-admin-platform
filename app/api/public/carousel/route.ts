import { NextRequest, NextResponse } from 'next/server';
import { getAllPublicProfiles, getPublications } from '@/lib/backend/db';

// O'zbek tadqiqotchilari (taniqli tadqiqotchilar uchun)
const uzbekResearchers = [
  {
    id: 'uzbek-1',
    userId: 'uzbek-1',
    name: 'Dr. Aziza Shodieva',
    title: 'Filologiya fanlari doktori, dotsent',
    affiliation: 'Toshkent davlat universiteti',
    email: '',
    bio: 'O\'zbek tili va adabiyoti sohasida tadqiqotchi',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
    researchInterests: ['O\'zbek tili', 'Adabiyotshunoslik', 'Filologiya'],
    education: [],
    contact: {},
  },
  {
    id: 'uzbek-2',
    userId: 'uzbek-2',
    name: 'Prof. Jamshid Rahimov',
    title: 'Fizika-matematika fanlari doktori, professor',
    affiliation: 'Milliy universitet',
    email: '',
    bio: 'Matematik modellashtirish va hisoblash usullari bo\'yicha mutaxassis',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
    researchInterests: ['Matematika', 'Hisoblash usullari', 'Modellashtirish'],
    education: [],
    contact: {},
  },
];

// Qo'shimcha example profillar (eski)
const exampleProfiles = [
  ...uzbekResearchers,
  {
    id: 'example-3',
    userId: 'example-3',
    name: 'Dr. Geoffrey Hinton',
    title: 'Professor Emeritus',
    affiliation: 'University of Toronto',
    email: 'hinton@utoronto.ca',
    bio: 'Father of deep learning, Turing Award winner',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    researchInterests: ['Deep Learning', 'Neural Networks', 'AI'],
    education: [],
    contact: {
      website: 'https://www.cs.toronto.edu/~hinton',
      googleScholar: 'https://scholar.google.com/citations?user=example3',
    },
  },
];

const examplePublications = [
  {
    id: 'example-pub-1',
    userId: 'example-1',
    title: 'Attention Is All You Need',
    authors: ['A Vaswani', 'N Shazeer', 'N Parmar', 'J Uszkoreit', 'L Jones'],
    journal: 'Advances in Neural Information Processing Systems',
    year: 2017,
    citations: 85000,
    type: 'article' as const,
  },
  {
    id: 'example-pub-2',
    userId: 'example-2',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    authors: ['J Devlin', 'M Chang', 'K Lee', 'K Toutanova'],
    journal: 'NAACL-HLT',
    year: 2019,
    citations: 65000,
    type: 'article' as const,
  },
  {
    id: 'example-pub-3',
    userId: 'example-3',
    title: 'ImageNet Classification with Deep Convolutional Neural Networks',
    authors: ['A Krizhevsky', 'I Sutskever', 'GE Hinton'],
    journal: 'Advances in Neural Information Processing Systems',
    year: 2012,
    citations: 120000,
    type: 'article' as const,
  },
  {
    id: 'example-pub-4',
    userId: 'example-1',
    title: 'Deep Residual Learning for Image Recognition',
    authors: ['K He', 'X Zhang', 'S Ren', 'J Sun'],
    journal: 'CVPR',
    year: 2016,
    citations: 95000,
    type: 'article' as const,
  },
  {
    id: 'example-pub-5',
    userId: 'example-2',
    title: 'Generative Adversarial Networks',
    authors: ['I Goodfellow', 'J Pouget-Abadie', 'M Mirza', 'B Xu'],
    journal: 'Advances in Neural Information Processing Systems',
    year: 2014,
    citations: 75000,
    type: 'article' as const,
  },
];

export async function GET() {
  try {
    const profiles = getAllPublicProfiles();
    const publications = getPublications();

    // Haqiqiy profillar (masalan Abubakir) + 2 ta o'zbek tadqiqotchisi
    const realFeatured = profiles.filter(p => p.photo).slice(0, 5);
    const featuredProfiles = [...realFeatured, ...uzbekResearchers].slice(0, 6);

    // Get recent publications
    let recentPublications = publications
      .sort((a, b) => {
        const dateA = new Date(a.year || 0).getTime();
        const dateB = new Date(b.year || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);

    // If not enough publications, add examples
    if (recentPublications.length < 3) {
      recentPublications = [
        ...recentPublications,
        ...examplePublications.slice(0, 5 - recentPublications.length),
      ];
    }

    // Get top cited publications
    let topPublications = publications
      .sort((a, b) => (b.citations || 0) - (a.citations || 0))
      .slice(0, 5);

    // If not enough top publications, add examples
    if (topPublications.length < 3) {
      topPublications = [
        ...topPublications,
        ...examplePublications
          .sort((a, b) => b.citations - a.citations)
          .slice(0, 5 - topPublications.length),
      ];
    }

    // Calculate stats including examples
    const totalProfiles = Math.max(profiles.length, exampleProfiles.length);
    const totalPublications = Math.max(publications.length, examplePublications.length);
    const totalCitations = Math.max(
      publications.reduce((sum, p) => sum + (p.citations || 0), 0),
      examplePublications.reduce((sum, p) => sum + p.citations, 0)
    );

    return NextResponse.json({
      profiles: featuredProfiles,
      recentPublications,
      topPublications,
      stats: {
        totalProfiles,
        totalPublications,
        totalCitations,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Xatolik' },
      { status: 500 }
    );
  }
}

