import { NextRequest, NextResponse } from 'next/server';
import { registerUser, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password, email } = await request.json();

    if (!username || !password || !email) {
      return NextResponse.json(
        { error: 'Barcha maydonlar to\'ldirilishi kerak' },
        { status: 400 }
      );
    }

    const user = await registerUser(username, password, email);
    const token = generateToken(user.id, user.username);

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username, email: user.email },
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Registration xatolik' },
      { status: 400 }
    );
  }
}

