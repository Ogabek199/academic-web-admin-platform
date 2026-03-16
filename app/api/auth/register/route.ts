import { NextRequest, NextResponse } from 'next/server';
import { registerUser, generateToken } from '@/lib/backend/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password, email } = await request.json();

    if (!username || !password || !email) {
      return NextResponse.json(
        { error: "Barcha maydonlar to'ldirilishi kerak" },
        { status: 400 }
      );
    }

    const user = await registerUser(username, password, email);
    const userId = user._id.toString();

    const token = generateToken(userId, user.username);

    const response = NextResponse.json({
      success: true,
      user: { id: userId, username: user.username, email: user.email },
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration xatolik';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}


// supabase ga register qilish
// export async function POST(request: NextRequest) {
//   try {
//     const { username, password, email } = await request.json();
//   } catch (error) {
//     return NextResponse.json(
//       { error: error instanceof Error ? error.message : 'Registration xatolik' },
//       { status: 400 }
//     );
//   }
// }