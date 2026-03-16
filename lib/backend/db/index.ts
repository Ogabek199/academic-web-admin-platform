import { supabaseAdmin } from '../supabase';
import { Publication } from '@/types';

export async function getUsers() {
  const { data, error } = await supabaseAdmin.from('users').select('*');
  if (error) throw error;
  return data || [];
}

export async function getUserByUsername(username: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = Row not found
    throw error;
  }

  return data || null;
}

export async function createUser(username: string, password: string, email: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert({ username, password, email })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function getProfileByUserId(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data || null;
}

export async function saveProfile(profile: {
  userId: string;
  name: string;
  title: string;
  affiliation: string;
  bio?: string;
  email?: string;
  contact?: {
    googleScholar?: string;
    researchGate?: string;
    linkedin?: string;
  };
  photo?: string;
  researchInterests?: string[];
  stats?: {
    publications?: number;
    citations?: number;
    hIndex?: number;
    i10Index?: number;
  };
}) {
  const payload = {
    user_id: profile.userId,
    name: profile.name,
    title: profile.title,
    affiliation: profile.affiliation,
    bio: profile.bio ?? null,
    email: profile.email ?? null,
    google_scholar: profile.contact?.googleScholar ?? null,
    research_gate: profile.contact?.researchGate ?? null,
    linkedin: profile.contact?.linkedin ?? null,
    image_url: profile.photo ?? null,
    research_interests: profile.researchInterests ?? [],
    stats_publications: profile.stats?.publications ?? 0,
    stats_citations: profile.stats?.citations ?? 0,
    stats_h_index: profile.stats?.hIndex ?? 0,
    stats_i10_index: profile.stats?.i10Index ?? 0,
  };

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .upsert(payload, { onConflict: 'user_id' })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function getPublications() {
  const { data, error } = await supabaseAdmin
    .from('publications')
    .select('*')
    .order('year', { ascending: false });

  if (error) throw error;
  return (data || []) as Publication[];
}

export async function getPublicationsByUserId(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('publications')
    .select('*')
    .eq('user_id', userId)
    .order('year', { ascending: false });

  if (error) throw error;
  return (data || []) as Publication[];
}

export async function addPublication(publication: any) {
  const payload = {
    user_id: publication.userId,
    title: publication.title,
    authors: publication.authors ?? [],
    journal: publication.journal ?? null,
    year: publication.year,
    citations: publication.citations ?? 0,
    type: publication.type ?? 'article',
    doi: publication.doi ?? null,
    link: publication.link ?? null,
    file_url: publication.fileUrl ?? null,
  };

  const { data, error } = await supabaseAdmin
    .from('publications')
    .insert(payload)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function deletePublication(id: string, userId: string) {
  const { error } = await supabaseAdmin
    .from('publications')
    .delete()
    .match({ id, user_id: userId });

  if (error) throw error;
  return true;
}

export async function getAllPublicProfiles() {
  const { data, error } = await supabaseAdmin.from('profiles').select('*');
  if (error) throw error;
  return data || [];
}

export async function searchProfiles(query: string) {
  const q = query.toLowerCase();

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .or(
      `name.ilike.%${q}%,title.ilike.%${q}%,affiliation.ilike.%${q}%`
    );

  if (error) throw error;
  return data || [];
}

export async function getStatistics() {
  const publications = (await getPublications()) as Publication[];

  const totalPublications = publications.length;
  const totalCitations = publications.reduce(
    (sum, p) => sum + (p.citations || 0),
    0
  );

  const sortedByCitations = [...publications].sort(
    (a, b) => (b.citations || 0) - (a.citations || 0)
  );
  let hIndex = 0;
  for (let i = 0; i < sortedByCitations.length; i++) {
    if ((sortedByCitations[i].citations || 0) >= i + 1) {
      hIndex = i + 1;
    } else {
      break;
    }
  }

  const i10Index = publications.filter(
    (p) => (p.citations || 0) >= 10
  ).length;

  const citationsByYearMap = new Map<number, number>();
  publications.forEach((pub: Publication) => {
    const year = pub.year;
    citationsByYearMap.set(
      year,
      (citationsByYearMap.get(year) || 0) + (pub.citations || 0)
    );
  });
  const citationsByYear = Array.from(citationsByYearMap.entries())
    .map(([year, citations]) => ({ year, citations }))
    .sort((a, b) => a.year - b.year);

  const publicationsByYearMap = new Map<number, number>();
  publications.forEach((pub) => {
    const year = pub.year;
    publicationsByYearMap.set(
      year,
      (publicationsByYearMap.get(year) || 0) + 1
    );
  });
  const publicationsByYear = Array.from(publicationsByYearMap.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year - b.year);

  const citationsByTypeMap = new Map<string, number>();
  publications.forEach((pub) => {
    const type = (pub.type as string) || 'article';
    citationsByTypeMap.set(
      type,
      (citationsByTypeMap.get(type) || 0) + (pub.citations || 0)
    );
  });
  const citationsByType = Array.from(citationsByTypeMap.entries()).map(
    ([type, count]) => ({ type, count })
  );

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

