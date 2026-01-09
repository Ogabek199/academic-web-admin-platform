import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/backend/auth';
import { getUsers } from '@/lib/backend/db';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const users = getUsers();
    const user = users.find(u => u.id === decoded.userId);

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}

