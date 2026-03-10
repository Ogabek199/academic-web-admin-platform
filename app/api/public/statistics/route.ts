import { NextResponse } from 'next/server';
import { getStatistics } from '@/lib/backend/db';

export async function GET() {
  try {
    const statistics = await getStatistics();
    return NextResponse.json(statistics);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Statistikani yuklashda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}
