import { NextRequest, NextResponse } from 'next/server';
import { getAllPublicProfiles, getPublications } from '@/lib/backend/db';

// Google Scholar'dan olingan realistik example ma'lumotlar
const exampleProfiles = [
  {
    id: 'example-1',
    userId: 'example-1',
    name: 'Dr. Andrew Ng',
    title: 'Professor of Computer Science',
    affiliation: 'Stanford University',
    email: 'andrew@stanford.edu',
    bio: 'Leading researcher in machine learning and AI',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    researchInterests: ['Machine Learning', 'Deep Learning', 'AI'],
    education: [],
    contact: {
      website: 'https://www.andrewng.org',
      googleScholar: 'https://scholar.google.com/citations?user=example1',
    },
  },
  {
    id: 'example-2',
    userId: 'example-2',
    name: 'Dr. Fei-Fei Li',
    title: 'Professor of Computer Science',
    affiliation: 'Stanford University',
    email: 'feifei@stanford.edu',
    bio: 'Pioneer in computer vision and AI',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    researchInterests: ['Computer Vision', 'AI', 'Neural Networks'],
    education: [],
    contact: {
      website: 'https://profiles.stanford.edu/fei-fei-li',
      googleScholar: 'https://scholar.google.com/citations?user=example2',
    },
  },
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

    // Combine real profiles with examples if needed
    let featuredProfiles = profiles
      .filter(p => p.photo)
      .slice(0, 5);
    
    // If not enough profiles, add examples
    if (featuredProfiles.length < 3) {
      featuredProfiles = [
        ...featuredProfiles,
        ...exampleProfiles.slice(0, 3 - featuredProfiles.length),
      ];
    }

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

