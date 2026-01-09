import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/backend/auth';
import { getPublicationsByUserId, addPublication, deletePublication } from '@/lib/backend/db';
import { Publication } from '@/types';

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

    const publications = getPublicationsByUserId(decoded.userId);
    return NextResponse.json({ publications });
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

    const publicationData: Publication = await request.json();
    const publication = {
      ...publicationData,
      id: publicationData.id || Date.now().toString(),
      userId: decoded.userId,
    };

    addPublication(publication);
    return NextResponse.json({ success: true, publication });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Xatolik' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();
    deletePublication(id, decoded.userId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Xatolik' },
      { status: 500 }
    );
  }
}

