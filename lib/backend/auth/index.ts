import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, getUserByUsername, getUsers } from '../db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string, username: string): string {
  return jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string; username: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; username: string };
    return decoded;
  } catch {
    return null;
  }
}

export async function registerUser(username: string, password: string, email: string) {
  const existingUser = getUserByUsername(username);
  if (existingUser) {
    throw new Error('Username already exists');
  }

  const hashedPassword = await hashPassword(password);
  const user = createUser(username, hashedPassword, email);
  return user;
}

export async function loginUser(username: string, password: string) {
  const user = getUserByUsername(username);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user.id, user.username);
  return { user: { id: user.id, username: user.username, email: user.email }, token };
}

// Initialize users file if doesn't exist (no default admin)
export async function initAdmin() {
  // Just ensure users file exists, don't create default admin
  // Each user should get their own login/password from admin
  getUsers(); // This will create the file if it doesn't exist
}

