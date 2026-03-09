import fs from 'fs';
import path from 'path';
import { Profile, Publication } from '@/types';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const USERS_FILE = path.resolve(DATA_DIR, 'users.json');
const PROFILES_FILE = path.resolve(DATA_DIR, 'profiles.json');
const PUBLICATIONS_FILE = path.resolve(DATA_DIR, 'publications.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface User {
  id: string;
  username: string;
  password: string; // hashed
  email: string;
  createdAt: string;
}

interface UserProfile extends Profile {
  userId: string;
}

interface UserPublication extends Publication {
  userId: string;
}

// Initialize files if they don't exist
function initFile(filePath: string, defaultValue: any) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
  }
}

initFile(USERS_FILE, []);
initFile(PROFILES_FILE, []);
initFile(PUBLICATIONS_FILE, []);

export function getUsers(): User[] {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveUsers(users: User[]): void {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export function getUserByUsername(username: string): User | null {
  const users = getUsers();
  return users.find(u => u.username === username) || null;
}

export function createUser(username: string, password: string, email: string): User {
  const users = getUsers();
  const user: User = {
    id: Date.now().toString(),
    username,
    password, // Should be hashed before calling
    email,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  return user;
}

export function getProfiles(): UserProfile[] {
  try {
    const data = fs.readFileSync(PROFILES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveProfiles(profiles: UserProfile[]): void {
  fs.writeFileSync(PROFILES_FILE, JSON.stringify(profiles, null, 2));
}

export function getProfileByUserId(userId: string): UserProfile | null {
  const profiles = getProfiles();
  return profiles.find(p => p.userId === userId) || null;
}

export function saveProfile(profile: UserProfile): void {
  const profiles = getProfiles();
  const index = profiles.findIndex(p => p.userId === profile.userId);
  if (index >= 0) {
    profiles[index] = profile;
  } else {
    profiles.push(profile);
  }
  saveProfiles(profiles);
}

export function getPublications(): UserPublication[] {
  try {
    const data = fs.readFileSync(PUBLICATIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function savePublications(publications: UserPublication[]): void {
  fs.writeFileSync(PUBLICATIONS_FILE, JSON.stringify(publications, null, 2));
}

export function getPublicationsByUserId(userId: string): UserPublication[] {
  const publications = getPublications();
  return publications.filter(p => p.userId === userId);
}

export function addPublication(publication: UserPublication): void {
  const publications = getPublications();
  publications.push(publication);
  savePublications(publications);
}

export function deletePublication(id: string, userId: string): void {
  const publications = getPublications();
  const filtered = publications.filter(p => p.id !== id || p.userId !== userId);
  savePublications(filtered);
}

export function getAllPublicProfiles(): UserProfile[] {
  return getProfiles();
}

export function searchProfiles(query: string): UserProfile[] {
  const profiles = getProfiles();
  const lowerQuery = query.toLowerCase();
  return profiles.filter(profile => 
    profile.name.toLowerCase().includes(lowerQuery) ||
    profile.title.toLowerCase().includes(lowerQuery) ||
    profile.affiliation.toLowerCase().includes(lowerQuery) ||
    profile.researchInterests.some(interest => 
      interest.toLowerCase().includes(lowerQuery)
    )
  );
}

export function getStatistics(): any {
  const publications = getPublications();
  
  const totalPublications = publications.length;
  const totalCitations = publications.reduce((sum, p) => sum + (p.citations || 0), 0);
  
  // Calculate h-index
  const sortedByCitations = [...publications]
    .sort((a, b) => (b.citations || 0) - (a.citations || 0));
  let hIndex = 0;
  for (let i = 0; i < sortedByCitations.length; i++) {
    if ((sortedByCitations[i].citations || 0) >= i + 1) {
      hIndex = i + 1;
    } else {
      break;
    }
  }
  
  // Calculate i10-index
  const i10Index = publications.filter(p => (p.citations || 0) >= 10).length;
  
  // Citations by year
  const citationsByYearMap = new Map<number, number>();
  publications.forEach(pub => {
    const year = pub.year;
    citationsByYearMap.set(year, (citationsByYearMap.get(year) || 0) + (pub.citations || 0));
  });
  const citationsByYear = Array.from(citationsByYearMap.entries())
    .map(([year, citations]) => ({ year, citations }))
    .sort((a, b) => a.year - b.year);
  
  // Publications by year
  const publicationsByYearMap = new Map<number, number>();
  publications.forEach(pub => {
    const year = pub.year;
    publicationsByYearMap.set(year, (publicationsByYearMap.get(year) || 0) + 1);
  });
  const publicationsByYear = Array.from(publicationsByYearMap.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year - b.year);
  
  // Citations by type
  const citationsByTypeMap = new Map<string, number>();
  publications.forEach(pub => {
    const type = pub.type || 'article';
    citationsByTypeMap.set(type, (citationsByTypeMap.get(type) || 0) + (pub.citations || 0));
  });
  const citationsByType = Array.from(citationsByTypeMap.entries())
    .map(([type, count]) => ({ type, count }));
    
  return {
    totalPublications,
    totalCitations,
    hIndex,
    i10Index,
    citationsByYear,
    publicationsByYear,
    citationsByType,
  };
}

