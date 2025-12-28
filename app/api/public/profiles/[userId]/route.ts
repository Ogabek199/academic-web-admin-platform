import { NextRequest, NextResponse } from 'next/server';
import { getProfileByUserId, getPublicationsByUserId } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const profile = getProfileByUserId(userId);
    const publications = getPublicationsByUserId(userId);

    if (!profile) {
      return NextResponse.json(
        { error: 'Profil topilmadi' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      profile,
      publications,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Xatolik' },
      { status: 500 }
    );
  }
}

