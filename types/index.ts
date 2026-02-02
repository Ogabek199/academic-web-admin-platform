export interface Profile {
  id: string;
  name: string;
  title: string;
  affiliation: string;
  email: string;
  bio: string;
  photo?: string;
  researchInterests: string[];
  education: Education[];
  contact: {
    website?: string;
    orcid?: string;
    googleScholar?: string;
    linkedin?: string;
  };
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  field?: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal?: string;
  year: number;
  citations: number;
  doi?: string;
  link?: string;
  type: 'article' | 'conference' | 'book' | 'thesis' | 'other';
  content?: string; // Nashrning to'liq matni
}

export interface Statistics {
  totalPublications: number;
  totalCitations: number;
  hIndex: number;
  i10Index: number;
  citationsByYear: { year: number; citations: number }[];
  publicationsByYear: { year: number; count: number }[];
  citationsByType: { type: string; count: number }[];
}

