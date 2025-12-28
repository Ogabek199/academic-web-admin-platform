import { Profile, Publication, Statistics } from '@/types';

let profileData: Profile | null = null;
let publicationsData: Publication[] = [];
let statisticsData: Statistics | null = null;

// Load data from localStorage on client side
if (typeof window !== 'undefined') {
  try {
    const savedProfile = localStorage.getItem('academic_profile');
    const savedPublications = localStorage.getItem('academic_publications');
    const savedStatistics = localStorage.getItem('academic_statistics');

    if (savedProfile) {
      profileData = JSON.parse(savedProfile);
    }
    if (savedPublications) {
      publicationsData = JSON.parse(savedPublications);
    }
    if (savedStatistics) {
      statisticsData = JSON.parse(savedStatistics);
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
  }
}

export function getProfile(): Profile | null {
  return profileData;
}

export function saveProfile(profile: Profile): void {
  profileData = profile;
  if (typeof window !== 'undefined') {
    localStorage.setItem('academic_profile', JSON.stringify(profile));
  }
}

export function getPublications(): Publication[] {
  return publicationsData;
}

export function savePublications(publications: Publication[]): void {
  publicationsData = publications;
  if (typeof window !== 'undefined') {
    localStorage.setItem('academic_publications', JSON.stringify(publications));
  }
}

export function addPublication(publication: Publication): void {
  publicationsData.push(publication);
  if (typeof window !== 'undefined') {
    localStorage.setItem('academic_publications', JSON.stringify(publicationsData));
  }
  updateStatistics();
}

export function deletePublication(id: string): void {
  publicationsData = publicationsData.filter(p => p.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem('academic_publications', JSON.stringify(publicationsData));
  }
  updateStatistics();
}

export function getStatistics(): Statistics {
  if (statisticsData) {
    return statisticsData;
  }
  return calculateStatistics();
}

function calculateStatistics(): Statistics {
  const totalPublications = publicationsData.length;
  const totalCitations = publicationsData.reduce((sum, p) => sum + p.citations, 0);
  
  // Calculate h-index
  const sortedByCitations = [...publicationsData]
    .sort((a, b) => b.citations - a.citations);
  let hIndex = 0;
  for (let i = 0; i < sortedByCitations.length; i++) {
    if (sortedByCitations[i].citations >= i + 1) {
      hIndex = i + 1;
    } else {
      break;
    }
  }
  
  // Calculate i10-index
  const i10Index = publicationsData.filter(p => p.citations >= 10).length;
  
  // Citations by year
  const citationsByYearMap = new Map<number, number>();
  publicationsData.forEach(pub => {
    const year = pub.year;
    citationsByYearMap.set(year, (citationsByYearMap.get(year) || 0) + pub.citations);
  });
  const citationsByYear = Array.from(citationsByYearMap.entries())
    .map(([year, citations]) => ({ year, citations }))
    .sort((a, b) => a.year - b.year);
  
  // Publications by year
  const publicationsByYearMap = new Map<number, number>();
  publicationsData.forEach(pub => {
    const year = pub.year;
    publicationsByYearMap.set(year, (publicationsByYearMap.get(year) || 0) + 1);
  });
  const publicationsByYear = Array.from(publicationsByYearMap.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year - b.year);
  
  // Citations by type
  const citationsByTypeMap = new Map<string, number>();
  publicationsData.forEach(pub => {
    const type = pub.type;
    citationsByTypeMap.set(type, (citationsByTypeMap.get(type) || 0) + pub.citations);
  });
  const citationsByType = Array.from(citationsByTypeMap.entries())
    .map(([type, count]) => ({ type, count }));
  
  statisticsData = {
    totalPublications,
    totalCitations,
    hIndex,
    i10Index,
    citationsByYear,
    publicationsByYear,
    citationsByType,
  };
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('academic_statistics', JSON.stringify(statisticsData));
  }
  
  return statisticsData;
}

export function updateStatistics(): void {
  statisticsData = null;
  getStatistics();
}

