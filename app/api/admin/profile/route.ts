import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getProfileByUserId, saveProfile } from '@/lib/db';
import { Profile } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = getProfileByUserId(decoded.userId);
    return NextResponse.json({ profile });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Xatolik' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profileData: Profile = await request.json();
    const profile = {
      ...profileData,
      userId: decoded.userId,
    };

    saveProfile(profile);
    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Xatolik' },
      { status: 500 }
    );
  }
}

