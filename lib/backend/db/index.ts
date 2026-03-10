import dbConnect from './config';
import { UserModel, ProfileModel, PublicationModel } from './models';
import { Profile, Publication } from '@/types';

export async function getUsers() {
  await dbConnect();
  return await UserModel.find({});
}

export async function getUserByUsername(username: string) {
  await dbConnect();
  return await UserModel.findOne({ username });
}

export async function createUser(username: string, password: string, email: string) {
  await dbConnect();
  const user = new UserModel({
    username,
    password,
    email,
  });
  return await user.save();
}

export async function getProfileByUserId(userId: string) {
  await dbConnect();
  return await ProfileModel.findOne({ userId });
}

export async function saveProfile(profile: any) {
  await dbConnect();
  return await ProfileModel.findOneAndUpdate(
    { userId: profile.userId },
    profile,
    { upsert: true, new: true }
  );
}

export async function getPublications() {
  await dbConnect();
  return await PublicationModel.find({}).sort({ year: -1 });
}

export async function getPublicationsByUserId(userId: string) {
  await dbConnect();
  return await PublicationModel.find({ userId }).sort({ year: -1 });
}

export async function addPublication(publication: any) {
  await dbConnect();
  const pub = new PublicationModel(publication);
  return await pub.save();
}

export async function deletePublication(id: string, userId: string) {
  await dbConnect();
  return await PublicationModel.findOneAndDelete({ _id: id, userId });
}

export async function getAllPublicProfiles() {
  await dbConnect();
  return await ProfileModel.find({});
}

export async function searchProfiles(query: string) {
  await dbConnect();
  const lowerQuery = query.toLowerCase();
  return await ProfileModel.find({
    $or: [
      { name: { $regex: lowerQuery, $options: 'i' } },
      { title: { $regex: lowerQuery, $options: 'i' } },
      { affiliation: { $regex: lowerQuery, $options: 'i' } },
      { researchInterests: { $regex: lowerQuery, $options: 'i' } },
    ]
  });
}

export async function getStatistics() {
  await dbConnect();
  const publications = await PublicationModel.find({});
  
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

