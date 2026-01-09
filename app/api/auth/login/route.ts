import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/backend/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username va password kiritilishi kerak' },
        { status: 400 }
      );
    }

    const result = await loginUser(username, password);

    const response = NextResponse.json({
      success: true,
      user: result.user,
    });

    response.cookies.set('auth-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Login xatolik' },
      { status: 401 }
    );
  }
}

