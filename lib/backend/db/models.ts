import mongoose, { Schema, Document } from 'mongoose';

// User Schema
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Profile Schema
const ProfileSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  title: { type: String, required: true },
  affiliation: { type: String, required: true },
  bio: { type: String },
  email: { type: String },
  googleScholar: { type: String },
  researchGate: { type: String },
  linkedIn: { type: String },
  imageUrl: { type: String },
  researchInterests: [{ type: String }],
  stats: {
    publications: { type: Number, default: 0 },
    citations: { type: Number, default: 0 },
    hIndex: { type: Number, default: 0 },
    i10Index: { type: Number, default: 0 },
  }
});

// Publication Schema
const PublicationSchema = new Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  authors: [{ type: String }],
  journal: { type: String },
  year: { type: Number, required: true },
  citations: { type: Number, default: 0 },
  type: { type: String, enum: ['article', 'conference', 'book', 'thesis', 'other'], default: 'article' },
  doi: { type: String },
  link: { type: String },
  fileUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export const ProfileModel = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
export const PublicationModel = mongoose.models.Publication || mongoose.model('Publication', PublicationSchema);
