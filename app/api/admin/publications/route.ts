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
      console.error('[DELETE Publication] Unauthorized: No token');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      console.error('[DELETE Publication] Unauthorized: Invalid token');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.error('[DELETE Publication] Error parsing JSON:', e);
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { id } = body;
    if (!id) {
      console.error('[DELETE Publication] Error: No ID provided in request body');
      return NextResponse.json({ error: 'ID tanlanmagan' }, { status: 400 });
    }

    console.log(`[DELETE Publication] Deleting publication ${id} for user ${decoded.userId}`);
    deletePublication(id, decoded.userId);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[DELETE Publication] Internal Error:', error);
    return NextResponse.json(
      { error: error.message || 'Xatolik yuz berdi' },
      { status: 500 }
    );
  }
}

