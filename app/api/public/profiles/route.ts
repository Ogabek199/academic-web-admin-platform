import { NextRequest, NextResponse } from 'next/server';
import { getAllPublicProfiles, searchProfiles } from '@/lib/backend/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    let profiles;
    if (query) {
      profiles = await searchProfiles(query);
    } else {
      profiles = await getAllPublicProfiles();
    }

    return NextResponse.json({ profiles });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Ma\'lumotlarni yuklashda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}

