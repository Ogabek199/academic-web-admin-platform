import { NextResponse } from 'next/server';
import { getStatistics } from '@/lib/backend/db';

export async function GET() {
  try {
    const statistics = getStatistics();
    return NextResponse.json(statistics);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Xatolik' },
      { status: 500 }
    );
  }
}
