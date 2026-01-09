import fs from 'fs';
import path from 'path';
import { Profile, Publication } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PROFILES_FILE = path.join(DATA_DIR, 'profiles.json');
const PUBLICATIONS_FILE = path.join(DATA_DIR, 'publications.json');

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

