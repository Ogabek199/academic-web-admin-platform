import { NextRequest, NextResponse } from 'next/server';
import { getPublications } from '@/lib/backend/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || 'recent'; // recent, citations

    let publications = getPublications();

    // Sort publications
    if (sort === 'citations') {
      publications = publications.sort((a, b) => (b.citations || 0) - (a.citations || 0));
    } else {
      publications = publications.sort((a, b) => {
        const dateA = new Date(a.year || 0).getTime();
        const dateB = new Date(b.year || 0).getTime();
        return dateB - dateA;
      });
    }

    // Limit results
    publications = publications.slice(0, limit);

    return NextResponse.json({ publications });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Xatolik' },
      { status: 500 }
    );
  }
}

